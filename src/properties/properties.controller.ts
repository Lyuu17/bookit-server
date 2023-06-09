import { BadRequestException, Body, Controller, Delete, Get, NotFoundException, Param, Patch, Post, Put, Query, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBadRequestResponse, ApiBearerAuth, ApiNotFoundResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { isMongoId } from 'class-validator';
import { existsSync, mkdirSync } from 'fs';
import { diskStorage } from 'multer';
import { extname, join } from 'path';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { Role } from 'src/enums/role.enum';
import { Roles } from 'src/roles/roles.decorator';
import { RolesGuard } from 'src/roles/roles.guard';
import { UserDto } from 'src/users/dto/user.dto';
import { UsersFacade } from 'src/users/users.facade';
import { ImageDto } from './dto/image.dto';
import { PropertyDto, UpdatePropertyDto } from './dto/property.dto';
import { PropertiesFacade } from './properties.facade';
import { PropertiesGuard } from './properties.guard';
import { PropertiesService } from './properties.service';

@ApiTags('Properties')
@ApiBearerAuth()
@Controller('properties')
export class PropertiesController {
  constructor(
    private readonly propertiesService: PropertiesService,
    private readonly usersFacade: UsersFacade,
    private readonly propertiesFacade: PropertiesFacade
  ) { }

  @Get()
  @ApiOkResponse({ description: 'Get all properties', type: [PropertyDto] })
  async getAll(): Promise<PropertyDto[]> {
    return this.propertiesFacade.getAll();
  }

  @Get('availability/')
  @ApiOkResponse({ description: 'Get all properties by availability', type: [PropertyDto] })
  async getAllByAvailability(
    @Query('checkin') checkin: string,
    @Query('checkout') checkout: string,
    @Query('country') country: string,
    @Query('city') city: string
  ): Promise<PropertyDto[]> {
    return this.propertiesFacade.getAllByAvailability(new Date(checkin), new Date(checkout), country, city);
  }

  @Get(':q')
  @ApiOkResponse({ description: 'Get one property', type: PropertyDto })
  @ApiNotFoundResponse({ description: 'Property not found' })
  @ApiBadRequestResponse()
  async getOne(@Param('q') q: string): Promise<PropertyDto> {
    if (!isMongoId(q)) {
      throw new BadRequestException();
    }

    const property = await this.propertiesFacade.findById(q);
    if (!property) {
      throw new NotFoundException();
    }

    return property;
  }

  @Get('availability/:q')
  @ApiOkResponse({ description: 'Get one property by availability', type: PropertyDto })
  async getOneByAvailability(
    @Param('q') q: string,
    @Query('checkin') checkin: string,
    @Query('checkout') checkout: string
  ): Promise<PropertyDto> {
    const properties = await this.propertiesFacade.findOneOrAllByAvailability(new Date(checkin), new Date(checkout), q);
    if (properties.length < 1) {
      throw new BadRequestException('Invalid property id');
    }

    return properties[0];
  }

  @Get('city/:q')
  @ApiOkResponse({ description: 'Get properties based on the city', type: [PropertyDto] })
  async findByCity(@Param('q') q: string): Promise<PropertyDto[]> {
    return this.propertiesFacade.findByCity(q);
  }

  @Get('country/:q')
  @ApiOkResponse({ description: 'Get properties based on the country', type: [PropertyDto] })
  async findByCountry(@Param('q') q: string): Promise<PropertyDto[]> {
    return this.propertiesFacade.findByCountry(q);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Post()
  @ApiOkResponse({ description: 'Add a property', type: PropertyDto })
  async addOne(@Body() propertyDto: PropertyDto): Promise<PropertyDto> {
    return this.propertiesFacade.addOne(propertyDto);
  }

  @UseGuards(JwtAuthGuard, PropertiesGuard('id'))
  @Patch(':id')
  @ApiOkResponse({ description: 'Update a property', type: PropertyDto })
  @ApiBadRequestResponse()
  async updateOne(@Param('id') id: string, @Body() updatePropertyDto: UpdatePropertyDto): Promise<PropertyDto> {
    if (!isMongoId(id)) {
      throw new BadRequestException();
    }

    return this.propertiesFacade.updateOne(id, updatePropertyDto);
  }

  @UseGuards(JwtAuthGuard, PropertiesGuard('property'))
  @Get(':property/admins')
  @ApiOkResponse({ description: 'Retrieve a list of property admin users' })
  @ApiBadRequestResponse({ description: 'Invalid property' })
  async getAdmins(@Param('property') propertyId: string): Promise<UserDto[]> {
    if (!isMongoId(propertyId)) {
      throw new BadRequestException();
    }

    return this.propertiesFacade.getAdminUsers(propertyId);
  }

  @UseGuards(JwtAuthGuard, PropertiesGuard('property'))
  @Post(':property/admins/:user')
  @ApiOkResponse({ description: 'Add a property admin user' })
  @ApiBadRequestResponse({ description: 'Invalid property' })
  @ApiBadRequestResponse({ description: 'Invalid user' })
  async addAdmin(@Param('property') propertyId: string, @Param('user') userId: string): Promise<UserDto[]> {
    if (!isMongoId(propertyId) || !isMongoId(userId)) {
      throw new BadRequestException('Invalid property');
    }

    if (await this.usersFacade.findById(userId) == null) {
      throw new BadRequestException('Invalid user');
    }

    await this.propertiesService.addAdminUser(propertyId, userId);

    return this.propertiesFacade.getAdminUsers(propertyId);
  }

  @UseGuards(JwtAuthGuard, PropertiesGuard('property'))
  @Delete(':property/admins/:user')
  @ApiOkResponse({ description: 'Remove a property admin user' })
  @ApiBadRequestResponse({ description: 'Invalid property' })
  @ApiBadRequestResponse({ description: 'Invalid user' })
  async removeAdmin(@Param('property') propertyId: string, @Param('user') userId: string): Promise<UserDto[]> {
    if (!isMongoId(propertyId) || !isMongoId(userId)) {
      throw new BadRequestException('Invalid property');
    }

    if (await this.usersFacade.findById(userId) == null) {
      throw new BadRequestException('Invalid user');
    }

    await this.propertiesService.removeAdminUser(propertyId, userId);

    return this.propertiesFacade.getAdminUsers(propertyId);
  }

  @UseGuards(JwtAuthGuard, PropertiesGuard('id'))
  @Post(':id/image')
  @UseInterceptors(FileInterceptor('file', {
    storage: diskStorage({
      destination: (req, file, cb) => {
        const path = join(process.cwd(), process.env.PUBLIC_DIR, `${req.params.q}`, 'images');
        if (!existsSync(path))
          mkdirSync(path, { recursive: true });
        cb(null, path);
      },
      filename: (req, file, cb) => {
        /* https://stackoverflow.com/a/49096069 */
        // Generate a 32 random chars long string
        const randomName = Array(32).fill(null).map(() => (Math.round(Math.random() * 16)).toString(16)).join('')
        cb(null, `${randomName}${extname(file.originalname)}`);
      }
    }),
    limits: {
      fileSize: 1024 * 1024 * 4
    },
    fileFilter: (req, file, cb) => {
      cb(null, Boolean(file.mimetype.match(/(jpg|jpeg|png)/)));
    }
  }))
  @ApiOkResponse({ description: 'Upload an image for a property' })
  @ApiBadRequestResponse({ description: 'Upload failed' })
  @ApiBadRequestResponse({ description: 'Invalid property' })
  async uploadImage(
    @Param('id') propertyId: string,
    @Body() imageData: ImageDto,
    @UploadedFile() file: Express.Multer.File
  ): Promise<ImageDto> {
    return this.propertiesService.uploadPropertyImage(propertyId, imageData, file);
  }

  @UseGuards(JwtAuthGuard, PropertiesGuard('property'))
  @Delete(':property/image/:image')
  @ApiOkResponse({ description: 'Delete an image of a property' })
  @ApiBadRequestResponse({ description: 'Invalid property' })
  @ApiBadRequestResponse({ description: 'Invalid image' })
  async deleteImage(
    @Param('property') propertyId: string,
    @Param('image') imageId: string
  ): Promise<void> {
    return this.propertiesService.deletePropertyImage(propertyId, imageId);
  }

  @UseGuards(JwtAuthGuard, PropertiesGuard('property'))
  @Put(':property/room/:room/image/:image')
  @ApiOkResponse({ description: 'Add a property image to a room' })
  @ApiBadRequestResponse({ description: 'Invalid property' })
  @ApiBadRequestResponse({ description: 'Invalid room' })
  @ApiBadRequestResponse({ description: 'Invalid image' })
  async addRoomImage(
    @Param('property') propertyId: string,
    @Param('room') roomId: string,
    @Param('image') imageId: string
  ): Promise<void> {
    return this.propertiesService.addRoomImage(propertyId, roomId, imageId);
  }

  @UseGuards(JwtAuthGuard, PropertiesGuard('property'))
  @Delete(':property/room/:room/image/:image')
  @ApiOkResponse({ description: 'Remove a property image from a room' })
  @ApiBadRequestResponse({ description: 'Invalid property' })
  @ApiBadRequestResponse({ description: 'Invalid room' })
  @ApiBadRequestResponse({ description: 'Invalid image' })
  async removeRoomImage(
    @Param('property') propertyId: string,
    @Param('room') roomId: string,
    @Param('image') imageId: string
  ): Promise<void> {
    return this.propertiesService.removeRoomImage(propertyId, roomId, imageId);
  }
}

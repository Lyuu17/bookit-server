import { BadRequestException, Body, Controller, Delete, Get, Param, Post, Put, Query, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBadRequestResponse, ApiOkResponse } from '@nestjs/swagger';
import { existsSync, mkdirSync } from 'fs';
import { diskStorage } from 'multer';
import { extname, join } from 'path';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { Role } from 'src/enums/role.enum';
import { Roles } from 'src/roles/roles.decorator';
import { RolesGuard } from 'src/roles/roles.guard';
import { ImageDto } from './dto/image.dto';
import { PropertyDto } from './dto/property.dto';
import { PropertiesFacade } from './properties.facade';
import { PropertiesService } from './properties.service';

@Controller('properties')
export class PropertiesController {
  constructor(
    private readonly propertiesService: PropertiesService,
    private readonly propertiesFacade: PropertiesFacade
  ) { }

  @Get()
  @ApiOkResponse({ description: 'Get all properties', type: [PropertyDto] })
  async getAll() {
    return this.propertiesFacade.getAll();
  }

  @Get('availability/')
  @ApiOkResponse({ description: 'Get all properties by availability', type: [PropertyDto] })
  async getAllByAvailability(
    @Query('checkin') checkin: string,
    @Query('checkout') checkout: string
  ) {
    return this.propertiesFacade.getAllByAvailability(new Date(checkin), new Date(checkout));
  }

  @Get(':q')
  @ApiOkResponse({ description: 'Get one property', type: PropertyDto })
  async getOne(@Param('q') q: string) {
    return this.propertiesFacade.getOne(q);
  }

  @Get('availability/:q')
  @ApiOkResponse({ description: 'Get one property by availability', type: PropertyDto })
  async getOneByAvailability(
    @Param('q') q: string,
    @Query('checkin') checkin: string,
    @Query('checkout') checkout: string
  ) {
    const properties = await this.propertiesFacade.findOneOrAllByAvailability(new Date(checkin), new Date(checkout), q);
    if (properties.length < 1) {
      throw new BadRequestException('Invalid property id');
    }

    return properties[0];
  }

  @Get('city/:q')
  @ApiOkResponse({ description: 'Get properties based on the city', type: [PropertyDto] })
  async findByCity(@Param('q') q: string) {
    return this.propertiesFacade.findByCity(q);
  }

  @Get('country/:q')
  @ApiOkResponse({ description: 'Get properties based on the country', type: [PropertyDto] })
  async findByCountry(@Param('q') q: string) {
    return this.propertiesFacade.findByCountry(q);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.PROPERTY_MANAGER, Role.ADMIN)
  @Post()
  @ApiOkResponse({ description: 'Add a property', type: PropertyDto })
  async addOne(@Body() propertyDto: PropertyDto) {
    return this.propertiesFacade.addOne(propertyDto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.PROPERTY_MANAGER, Role.ADMIN)
  @Post(':q/image')
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
    @Param('q') propertyId: string,
    @Body() imageData: ImageDto,
    @UploadedFile() file: Express.Multer.File
  ) {
    return this.propertiesService.uploadPropertyImage(propertyId, imageData, file);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.PROPERTY_MANAGER, Role.ADMIN)
  @Delete(':property/image/:image')
  @ApiOkResponse({ description: 'Delete an image of a property' })
  @ApiBadRequestResponse({ description: 'Invalid property' })
  @ApiBadRequestResponse({ description: 'Invalid image' })
  async deleteImage(
    @Param('property') propertyId: string,
    @Param('image') imageId: string
  ) {
    return this.propertiesService.deletePropertyImage(propertyId, imageId);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.PROPERTY_MANAGER, Role.ADMIN)
  @Put(':property/room/:room/image/:image')
  @ApiOkResponse({ description: 'Add a property image to a room' })
  @ApiBadRequestResponse({ description: 'Invalid property' })
  @ApiBadRequestResponse({ description: 'Invalid room' })
  @ApiBadRequestResponse({ description: 'Invalid image' })
  async addRoomImage(
    @Param('property') propertyId: string,
    @Param('room') roomId: string,
    @Param('image') imageId: string
  ) {
    return this.propertiesService.addRoomImage(propertyId, roomId, imageId);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.PROPERTY_MANAGER, Role.ADMIN)
  @Delete(':property/room/:room/image/:image')
  @ApiOkResponse({ description: 'Remove a property image from a room' })
  @ApiBadRequestResponse({ description: 'Invalid property' })
  @ApiBadRequestResponse({ description: 'Invalid room' })
  @ApiBadRequestResponse({ description: 'Invalid image' })
  async removeRoomImage(
    @Param('property') propertyId: string,
    @Param('room') roomId: string,
    @Param('image') imageId: string
  ) {
    return this.propertiesService.removeRoomImage(propertyId, roomId, imageId);
  }
}

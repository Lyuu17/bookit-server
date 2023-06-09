
import { PartialType } from '@nestjs/swagger';

import { PropertyDto } from './property.dto';

export class UpdatePropertyDto extends PartialType(PropertyDto) { }
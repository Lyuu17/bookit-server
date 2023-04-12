import { ApiProperty } from "@nestjs/swagger";

export class AuthSuccessDto {
  @ApiProperty({ description: "Bearer Access Token" })
  access_token: string;

  constructor(partial: Partial<AuthSuccessDto>) {
    Object.assign(this, partial);
  }
}
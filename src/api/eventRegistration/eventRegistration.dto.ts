import { Type } from 'class-transformer';
import { IsEmail, isNotEmpty, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateEventRegistrationDto {
  @IsNumber()
  @IsNotEmpty()
  @Type(()=>Number)
  public collectionId: number;

  @IsEmail()
  @IsNotEmpty()
  public email: string;
}

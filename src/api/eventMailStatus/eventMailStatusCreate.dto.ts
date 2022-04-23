import { Type } from 'class-transformer';
import { IsEmail, isNotEmpty, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { AtTimeEnum, mailStatusEnum } from './eventMailStatus.entity';

export class EventMailStatusCreate {
  @IsNumber()
  @IsNotEmpty()
  @Type(()=>Number)
  public collectionId: number;

  @IsNumber()
  @IsNotEmpty()
  @Type(()=>Number)
  public eventRegistrationId: number;

  @IsOptional()
  public mailStatus: mailStatusEnum;

  @IsOptional()
  public atTime: AtTimeEnum;
  
}

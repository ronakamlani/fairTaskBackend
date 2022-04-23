import { Type } from 'class-transformer';
import { IsDate, IsNotEmpty, IsOptional, IsString, MaxLength, MinDate, MinLength } from 'class-validator';

export class CreateCollectionDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(20)
  public name: string;

  @IsDate()
  @IsOptional()
  @Type(() => Date)
  @MinDate(new Date())
  public launchDate: Date;
}

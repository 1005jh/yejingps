import { Type } from 'class-transformer';
import { IsDate, IsNumber, IsString } from 'class-validator';

export class UpdateConcertDto {
  @IsNumber()
  id: number;
  @IsString()
  title?: string;
  @IsString()
  content?: string;
  @Type(() => Date)
  @IsDate()
  startDate?: Date;
  @IsString()
  location?: string;
  @IsString()
  gpsLat?: string;

  @IsString()
  gpsLng?: string;
}

import { Type } from 'class-transformer';
import { IsDate, IsNumber, IsString } from 'class-validator';

export class UpdateConcertDto {
  @IsString()
  title?: string;
  @IsString()
  content?: string;

  @IsString()
  startDate?: string;
  @IsString()
  location?: string;
  @IsString()
  gpsLat?: string;

  @IsString()
  gpsLng?: string;
}

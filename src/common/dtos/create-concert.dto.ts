import { Type } from 'class-transformer';
import { IsDate, IsNotEmpty, IsString } from 'class-validator';

export class CreateConcertDto {
  @IsNotEmpty()
  @IsString()
  title: string;
  @IsNotEmpty()
  @IsString()
  content?: string;
  @IsNotEmpty()
  @IsString()
  startDate: string;
  @IsNotEmpty()
  @IsString()
  location: string;
  @IsNotEmpty()
  @IsString()
  gpsLat: string;

  @IsNotEmpty()
  @IsString()
  gpsLng: string;
}

// @Column({ type: 'varchar', length: 64, nullable: false })
//   title: string;

//   @Column({ type: 'date', nullable: false })
//   startDate: Date;

//   //*내용 / 장소 / 장소 gps / lat,lng
//   @Column({ type: 'text', nullable: true })
//   content?: string;
//   @Column({ type: 'varchar', length: 32, nullable: false })
//   location: string;
//   @Column({ type: 'varchar', length: 24, nullable: false })
//   gpsLat: string;
//   @Column({ type: 'varchar', length: 24, nullable: false })
//   gpsLng: string;

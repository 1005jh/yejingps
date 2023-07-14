import { RoomEntity } from './room.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { EntityContent } from './content';

@Entity({ name: 'CONCERT' })
export class ConcertEntity extends EntityContent {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 64, nullable: false })
  title: string;

  @Column({ type: 'varchar', nullable: false })
  startDate: string;

  //*내용 / 장소 / 장소 gps / lat,lng
  @Column({ type: 'text', nullable: true })
  content?: string;
  @Column({ type: 'varchar', length: 32, nullable: false })
  location: string;
  @Column({ type: 'varchar', length: 24, nullable: false })
  gpsLat: string;
  @Column({ type: 'varchar', length: 24, nullable: false })
  gpsLng: string;
}

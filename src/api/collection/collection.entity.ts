import BaseEntity from '../../common/db/base.entity';
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, Index } from 'typeorm';

export enum mailSendStatusEnum{
  PENDING=1,
  PROCESS=2,
  DONE=3
}

@Entity()
export class Collection extends BaseEntity {
  
  @Column({ type: 'varchar', length: 300 })
  public name: string;

  @Column({ type: 'timestamp', default:null, nullable:true })
  @Index()
  public launchDate: Date;


  @Column({type:'int',default:1})
  @Index()
  public mailStatus:mailSendStatusEnum;
}

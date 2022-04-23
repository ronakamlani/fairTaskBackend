import BaseEntity from 'src/common/db/base.entity';
import { Entity, Column, JoinColumn, ManyToOne, Index, CreateDateColumn } from 'typeorm';
import { Collection } from '../collection/collection.entity';

@Entity()
export class EventRegistration extends BaseEntity {
  
  @ManyToOne( (_type)=>Collection, (collection)=>{ collection.id }, {
    cascade:true,
  })
  @JoinColumn({name:"collectonId"})
  @Index()
  public collection: Collection;

  @Index()
  @Column({ type: 'varchar', length: 120 })
  public email: string;

  @CreateDateColumn({ type: 'timestamp' })
  @Index()
  public createdAt!: Date;  
}

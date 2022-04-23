import BaseEntity from 'src/common/db/base.entity';
import { Entity, Column, JoinColumn, ManyToOne, Index } from 'typeorm';
import { Collection } from '../collection/collection.entity';
import { EventRegistration } from '../eventRegistration/eventRegistration.entity';

export enum mailStatusEnum{
  SENT=1,
  FAILED=2,
}

export enum AtTimeEnum{
  oneHr="1h",
  oneDay="1 day",
  now="IS LAUNCHING NOW!"
}

@Entity()
export class EventMailStatus extends BaseEntity {

  @ManyToOne( (_type)=>Collection, (collection)=>{ collection.id }, {
    cascade:true,
  })
  @JoinColumn({name:"collectionId"})
  @Index()
  public collection: Collection;

  @ManyToOne( (_type)=>EventRegistration, (eventRegistration)=>{ eventRegistration.id }, {
    cascade:true,
  })
  @JoinColumn({name:"eventId"})
  @Index()
  public eventRegister: EventRegistration;

  @Column({ type: 'int', default:1 })
  @Index()
  public mailStatus: mailStatusEnum

  @Column({type:"varchar",nullable:true,default:AtTimeEnum.oneHr})
  public atTime:AtTimeEnum;

}

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Brackets, getRepository, Repository } from 'typeorm';
import { ReadStream } from 'typeorm/platform/PlatformTools';
import { mailSendStatusEnum } from '../collection/collection.entity';
import { CollectionService } from '../collection/collection.service';
import { EventMailStatus, mailStatusEnum } from '../eventMailStatus/eventMailStatus.entity';
import { CreateEventRegistrationDto } from './eventRegistration.dto';
import { EventRegistration } from './eventRegistration.entity';

@Injectable()
export class EventRegistrationService {
  @InjectRepository(EventRegistration)
  private readonly repository: Repository<EventRegistration>;

  constructor(private readonly collectionService : CollectionService){
    
  }


  public getEventRegistration(id: number): Promise<EventRegistration> {
    return this.repository.findOne(id);
  }

  public getTotalCollectionWithEmail(collectionId: number,email:string): Promise<number> {
    return this.repository.count({where : {
        collection: {id : collectionId},
        email,
      }
    });
  }


  public async createEventRegistration(body: CreateEventRegistrationDto): Promise<EventRegistration|null> {
    
    if(await this.getTotalCollectionWithEmail(body.collectionId,body.email) > 0){
      return null;
    }
    
    const collectionOne = await this.collectionService.getCollection(body.collectionId);
    if(!collectionOne){
      return null;
    }
    const eventRegistration: EventRegistration = new EventRegistration();

    eventRegistration.collection = collectionOne;
    eventRegistration.email = body.email;

    return this.repository.save(eventRegistration);
  }

  public async getEventRegistrationStreamByDate(startDate:Date,endDate:Date):Promise<ReadStream>{

    const q = getRepository(EventRegistration)
    .createQueryBuilder("er")
    .innerJoinAndSelect("er.collection",
      "collection",
    )
    .select([
      "collection.id",
      "er.id",
      "er.email",
      "collection.name",
      "collection.launchDate"
    ])
    .andWhere(new Brackets(qb=>{
      qb
        .where("collection.lastMailDate IS NULL")
        .orWhere(new Brackets(iqb=>{
          iqb
          .where("collection.lastMailDate < :lastMailStartDate",{lastMailStartDate:startDate.toISOString()})
          .andWhere("collection.lastMailDate >= :lastMailEndDate",{lastMailEndDate:endDate.toISOString()})
        }));
    }))
    //.andWhere("collection.lastMailDate IS NOT NULL")
    .andWhere("collection.launchDate >= :startDate",{startDate:startDate.toISOString()})
    .andWhere("collection.launchDate < :endDate",{endDate:endDate.toISOString()})
    .andWhere("collection.launchDate IS NOT NULL")
    .andWhere("collection.mailStatus = :status " , { status : mailSendStatusEnum.DONE })
    .orderBy("collection.id","ASC");
    //
    //console.log("q.query",q.getQuery());

    //npm i pg-query-stream
    return q.stream();

  }

  public async getEventRegistrationStreamByMailFailed():Promise<ReadStream>{

    const q = getRepository(EventMailStatus)
    .createQueryBuilder("ems")
    .innerJoinAndSelect("ems.collection",
      "collection",
    )
    .innerJoin("ems.eventRegister","event_registration")
    .select([
      "ems.id",
      "collection.id",
      "event_registration.email as er_email",
      "collection.name",
      "collection.launchDate"
    ])
    .andWhere("ems.mailStatus = :status " , { status : mailStatusEnum.FAILED });
    //
    //console.log("q.query",q.getQuery());

    //npm i pg-query-stream
    return q.stream();

  }

   
}

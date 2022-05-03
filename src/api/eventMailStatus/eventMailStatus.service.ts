import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, UpdateResult } from 'typeorm';
import { Collection } from '../collection/collection.entity';
import { CollectionService } from '../collection/collection.service';
import { EventRegistrationService } from '../eventRegistration/eventRegistration.service';
import { EventMailStatus } from './eventMailStatus.entity';
import { EventMailStatusCreate } from './eventMailStatusCreate.dto';

@Injectable()
export class EventMailStatusService {
  @InjectRepository(EventMailStatus)
  private readonly repository: Repository<EventMailStatus>;

  constructor(private readonly collectionService : CollectionService,
    private readonly eventRegistrationService : EventRegistrationService){
    
  }
  

  public async createEventMailStatus(body: EventMailStatusCreate): Promise<EventMailStatus|null> {
     
    
    const collectionObj = await this.collectionService.getCollection(body.collectionId);
    const eventObj = await this.eventRegistrationService.getEventRegistration(body.eventRegistrationId);

    const eventMailStatus: EventMailStatus = new EventMailStatus();

    eventMailStatus.collection = collectionObj;
    eventMailStatus.eventRegister = eventObj;
    eventMailStatus.mailStatus = body.mailStatus;
    eventMailStatus.atTime = body.atTime;

    return this.repository.save(eventMailStatus);
  }

  public async update(id:number, body: EventMailStatusCreate):Promise<UpdateResult>{
    const collectionObj = await this.collectionService.getCollection(body.collectionId);
    const eventObj = await this.eventRegistrationService.getEventRegistration(body.eventRegistrationId);

    const eventMailStatus: EventMailStatus = new EventMailStatus();

    eventMailStatus.collection = collectionObj;
    eventMailStatus.eventRegister = eventObj;
    eventMailStatus.mailStatus = body.mailStatus;
    eventMailStatus.atTime = body.atTime;

    return this.repository.update(id,eventMailStatus); 
  }
}

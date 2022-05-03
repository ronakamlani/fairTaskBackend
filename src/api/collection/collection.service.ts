import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, UpdateResult } from 'typeorm';
import { CreateCollectionDto } from './collection.dto';
import { Collection, mailSendStatusEnum } from './collection.entity';

@Injectable()
export class CollectionService {
  @InjectRepository(Collection)
  private readonly repository: Repository<Collection>;

  public getCollection(id: number): Promise<Collection> {
    return this.repository.findOne(id);
  }

  public createCollection(body: CreateCollectionDto): Promise<Collection> {
    const collection: Collection = new Collection();

    collection.name = body.name;
    collection.launchDate = body.launchDate ? new Date(body.launchDate) : null;

    return this.repository.save(collection);
  }

  public async update(id:number,body:CreateCollectionDto):Promise<Collection>{
    body.mailStatus = mailSendStatusEnum.DONE;
    await this.repository.update(id, body);
    return this.getCollection(id);
  }

  public async updatePartial(id:number, data:any):Promise<UpdateResult>{
    data.mailStatus = mailSendStatusEnum.DONE;
    return await this.repository.update(id, data);
  }

  public async updateStatus(ids:number[],status: mailSendStatusEnum){
    const body = {
      mailStatus : status
    };
    await this.repository.update(ids, body);
  }

  public getAllCollections(): Promise<Collection[]>{
    return this.repository.find();
  }
}

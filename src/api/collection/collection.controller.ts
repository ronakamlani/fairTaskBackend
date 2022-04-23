import { Body, Controller, Get, HttpCode, HttpStatus, Inject, Param, ParseIntPipe, Post } from '@nestjs/common';
import { Observable } from 'rxjs';
import { DataResponse } from '../../common/response/dataResponse.class';
import { CreateCollectionDto } from './collection.dto';
import { Collection } from './collection.entity';
import { CollectionService } from './collection.service';



@Controller('collection')
export class CollectionController {
  @Inject(CollectionService)
  private readonly service: CollectionService;

  @Get('/')
  public async getAllCollections():Promise<DataResponse<{ collections : Collection[] }>> {
    
    return DataResponse.ok({
      collections : await this.service.getAllCollections(),
    });
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  public async getCollection(@Param('id', ParseIntPipe) id: number): Promise<DataResponse<{ collection : Collection }>> {
    return DataResponse.ok({
      collection : await this.service.getCollection(id),
    });
  }

  @Post('/create')
  @HttpCode(HttpStatus.OK)
  public async createCollection(@Body() body: CreateCollectionDto): Promise<DataResponse<{ collection : Collection }>> {

    return DataResponse.ok({
      collection : await this.service.createCollection(body),
    });
  }

  @Post('/update/:id')
  @HttpCode(HttpStatus.OK)
  public async updateCollection(@Param("id", ParseIntPipe) id:number,  @Body() body: CreateCollectionDto): Promise<DataResponse<{ collection : Collection }>> {

    return DataResponse.ok({
      collection : await this.service.update(id,body),
    });
  }
}

import { Body, Controller, Get, HttpException, Inject, Param, ParseIntPipe, Post } from '@nestjs/common';
import { DataResponse } from 'src/common/response/dataResponse.class';
import { CreateEventRegistrationDto } from './eventRegistration.dto';
import { EventRegistration } from './eventRegistration.entity';
import { EventRegistrationService } from './eventRegistration.service';

@Controller('event-registration')
export class EventRegistrationController {
  @Inject(EventRegistrationService)
  private readonly service: EventRegistrationService;


  @Post('/create')
  public async createEventRegistration(@Body() body: CreateEventRegistrationDto): Promise<DataResponse<{ eventRegistration : EventRegistration | null }>> {
    const eventRegistartionObj =  await this.service.createEventRegistration(body);
    
    if(!eventRegistartionObj){
      throw new HttpException("Already registrated", 400);
    }
    return DataResponse.ok({
      eventRegistration : eventRegistartionObj,
    });
  }

  
}

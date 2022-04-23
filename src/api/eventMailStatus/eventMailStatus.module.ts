import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CollectionModule } from '../collection/collection.module';
import { EventRegistrationModule } from '../eventRegistration/eventRegistration.module';
//import { EventMailStatusController } from './eventMailStatus.controller';
import { EventMailStatus } from './eventMailStatus.entity';
import { EventMailStatusService } from './eventMailStatus.service';

@Module({
  imports: [TypeOrmModule.forFeature([EventMailStatus]),CollectionModule,EventRegistrationModule],
  //controllers: [EventMailStatusController],
  providers: [EventMailStatusService],
  exports:[EventMailStatusService],
})
export class EventMailStatusModule {}

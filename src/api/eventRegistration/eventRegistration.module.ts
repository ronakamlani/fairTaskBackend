import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CollectionModule } from '../collection/collection.module';
import { EventRegistrationController } from './eventRegistration.controller';
import { EventRegistration } from './eventRegistration.entity';
import { EventRegistrationService } from './eventRegistration.service';

@Module({
  imports: [TypeOrmModule.forFeature([EventRegistration]),CollectionModule],
  controllers: [EventRegistrationController],
  providers: [EventRegistrationService],
  exports:[EventRegistrationService]
})
export class EventRegistrationModule {}

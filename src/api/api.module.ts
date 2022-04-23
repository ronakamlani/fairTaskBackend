import { Module } from '@nestjs/common';
import { EventRegistrationModule } from './eventRegistration/eventRegistration.module';
import { CollectionModule } from './collection/collection.module';

@Module({
  imports: [EventRegistrationModule, CollectionModule],
})
export class ApiModule {}

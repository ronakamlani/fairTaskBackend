import { Module } from '@nestjs/common';
import { CollectionModule } from 'src/api/collection/collection.module';
import { EventMailStatusModule } from 'src/api/eventMailStatus/eventMailStatus.module';
import { EventRegistrationModule } from 'src/api/eventRegistration/eventRegistration.module';
import { MailModule } from 'src/mail/mail.module';
import { EventAlerterService } from './event-alerter.service';

@Module({
    imports: [EventRegistrationModule,EventMailStatusModule,CollectionModule,MailModule],
    providers: [EventAlerterService],
    exports:[EventAlerterService]
})
export class EventAlerterModule {}

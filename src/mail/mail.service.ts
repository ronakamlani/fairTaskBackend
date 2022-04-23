import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { SentMessageInfo } from 'nodemailer';
import { Collection } from 'src/api/collection/collection.entity';
import { EventRegistrationStreamInterface } from 'src/common/interfaces/eventRegistrationStream.interface';

@Injectable()
export class MailService {
  constructor(private mailerService: MailerService) {}

  sendEventRegistration(eventRegistrationStream: EventRegistrationStreamInterface):Promise<SentMessageInfo> {

    let launchDateText = eventRegistrationStream.collection_launchDate;
    return this.mailerService.sendMail({
      to: eventRegistrationStream.er_email,
      // from: '"Support Team" <support@example.com>', // override default from
      subject: `REMINDER - THE COLLECTION ${eventRegistrationStream.collection_name} LAUNCHES IN ${eventRegistrationStream.atTime}`,
      template: './templates/confirmation', // `.hbs` extension is appended automatically
      context: { // ✏️ filling curly brackets with content
        collection_name : eventRegistrationStream.collection_name,
        time_text : eventRegistrationStream.atTime,
      },
    });

  }
}

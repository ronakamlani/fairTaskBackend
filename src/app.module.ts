import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ApiModule } from './api/api.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { getEnvPath } from './common/helper/env.helper';
import { TypeOrmConfigService } from './shared/typeorm/typeorm.service';
import { MailModule } from './mail/mail.module';
import { EventAlerterModule } from './event-alerter/event-alerter.module';
import { ScheduleModule } from '@nestjs/schedule';

const envFilePath: string = getEnvPath(`${__dirname}/../`);

@Module({
  imports: [
    ConfigModule.forRoot({ envFilePath, isGlobal: true }),
    TypeOrmModule.forRootAsync({ useClass: TypeOrmConfigService }),
    ScheduleModule.forRoot(),
    ApiModule,
    MailModule,
    EventAlerterModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

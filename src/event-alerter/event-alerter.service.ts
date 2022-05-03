import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { rejects } from 'assert';
import * as moment from 'moment';
import { mailSendStatusEnum } from 'src/api/collection/collection.entity';
import { CollectionService } from 'src/api/collection/collection.service';
import { AtTimeEnum, mailStatusEnum } from 'src/api/eventMailStatus/eventMailStatus.entity';
import { EventMailStatusService } from 'src/api/eventMailStatus/eventMailStatus.service';
import { EventMailStatusCreate } from 'src/api/eventMailStatus/eventMailStatusCreate.dto';
import { EventRegistrationService } from 'src/api/eventRegistration/eventRegistration.service';
import { EventRegistrationStreamInterface } from 'src/common/interfaces/eventRegistrationStream.interface';
import { MailService } from 'src/mail/mail.service';

/**
 * This class designed to send mail of all collections.
 */
@Injectable()
export class EventAlerterService {
    private readonly logger = new Logger(EventAlerterService.name);

    constructor(private readonly eventRegistrationSerivce:EventRegistrationService,
        private readonly collectionService:CollectionService,
        private readonly mailService:MailService,
        private readonly eventMailStatusService:EventMailStatusService){
    
    }

    protected async handleJobFreshQuery(startDate:Date,endDate:Date,atTime:AtTimeEnum){
        let lastDay = moment().add(1,"days");

        return new Promise(async(resolve,reject)=>{
            
            
            //Find last hours events
            const q = await this.eventRegistrationSerivce.getEventRegistrationStreamByDate(startDate, endDate);
            let lastCollectionId = null;
            
            q.on("data",async(chunk:EventRegistrationStreamInterface)=>{
                //console.log("chunk",chunk);
                
                if(lastCollectionId != chunk.collection_id){
                    await this.collectionService.updatePartial(chunk.collection_id,{
                        lastMailDate: new Date(),
                        mailStatus: mailSendStatusEnum.PROCESS,
                    });
                    
                }
                
                //Send mail process.
                const eventMailStatusCreate = new EventMailStatusCreate();
                eventMailStatusCreate.collectionId = chunk.collection_id;
                eventMailStatusCreate.eventRegistrationId = chunk.er_id;
                
                eventMailStatusCreate.atTime = atTime;
                
                try{
                    chunk.atTime = atTime;
                    const sendMailInfo = await this.mailService.sendEventRegistration(chunk);
                    this.logger.log("sendMailInfo",sendMailInfo);
                    
                    if(sendMailInfo.accepted.length > 0){
                        eventMailStatusCreate.mailStatus = mailStatusEnum.SENT;
                    }
                    else{
                        eventMailStatusCreate.mailStatus = mailStatusEnum.FAILED;
                    }
                }
                catch(e){
                    eventMailStatusCreate.mailStatus = mailStatusEnum.FAILED;
                }
                
                await this.eventMailStatusService.createEventMailStatus(eventMailStatusCreate);


                if(lastCollectionId != chunk.collection_id){
                    this.collectionService.updateStatus([chunk.collection_id], mailSendStatusEnum.DONE)
                    lastCollectionId = chunk.collection_id;
                }
            });
            q.on("end",()=>{
                this.logger.log("Crone JOB DONE");
                return resolve(null);
            });
            q.on("error",(e)=>{
                this.logger.error("Crone JOB query error ",e);
                reject(e);
            });
        });
    }

    protected async handleJobLastHour(atTime:AtTimeEnum){
        //Find records for one day before

        let lastHourS = moment().subtract(1,"hours").subtract(1,"minute");
        let lastHourE = moment().subtract(1,"hours");
        
        try{
            await this.handleJobFreshQuery(lastHourS.toDate(),lastHourE.toDate(),atTime);       
        }catch(e){
            this.logger.error("ERROR",e);
        }
        
    } 

    protected async handleJobRetry(){
        try{
            const q =  await this.eventRegistrationSerivce.getEventRegistrationStreamByMailFailed();
            q.on("data",async (chunk:EventRegistrationStreamInterface)=>{
                //console.log("chunk",chunk);
                //Send mail process.

                const eventMailStatusCreate = new EventMailStatusCreate();
                eventMailStatusCreate.collectionId = chunk.collection_id;
                eventMailStatusCreate.eventRegistrationId = chunk.er_id;
                eventMailStatusCreate.mailStatus = mailStatusEnum.SENT;
                eventMailStatusCreate.atTime = chunk.atTime;
                try{
                    chunk.atTime = chunk.atTime;
                    const sendMailInfo = await this.mailService.sendEventRegistration(chunk);
                    this.logger.log("sendMailInfo",sendMailInfo);
                    
                    if(sendMailInfo.accepted.length > 0){
                        eventMailStatusCreate.mailStatus = mailStatusEnum.SENT;
                    }
                    else{
                        eventMailStatusCreate.mailStatus = mailStatusEnum.FAILED;
                    }
                }
                catch(e){
                    eventMailStatusCreate.mailStatus = mailStatusEnum.FAILED;
                }
                //const sendMailInfo = await this.mailService.sendEventRegistration(chunk);

                await this.eventMailStatusService.update(chunk.ems_id, eventMailStatusCreate);

            });
            q.on("end",()=>{
                console.log("END");
                
            });
            q.on("error",(e)=>{
                this.logger.error("ERROR",e);
            });
        }
        catch(e){
            this.logger.error("ERROR",e);
        }
    }

    protected async handleJobLastDay(atTime:AtTimeEnum){
        //Find records for one day before
        let lastDay = moment().add(1,"days");
        try{
            await this.handleJobFreshQuery(lastDay.startOf("day").toDate(), lastDay.endOf("day").toDate(),atTime);       
        }catch(e){
            this.logger.error("ERROR",e);
        }
        
    } 

    protected async handleJobNow(atTime:AtTimeEnum){
        //Find records for one day before
        let lastHourS = moment().subtract(1,"minute");
        let lastHourE = moment();
        
        try{
            await this.handleJobFreshQuery(lastHourS.toDate(), lastHourE.toDate(),atTime);       
        }catch(e){
            this.logger.error("ERROR ME",e);
        }
        
    } 

    /**
     * This function will call every one mintues, it will resolve failed mail and also will take care of collection last hour or last day cases.
     * Return : NONE
     */
    @Cron(CronExpression.EVERY_MINUTE)
    //@Cron(CronExpression.EVERY_10_SECONDS)
    async handleJobs(){
        try{
            await this.handleJobRetry();
            await this.handleJobNow(AtTimeEnum.now);
            await this.handleJobLastHour(AtTimeEnum.oneHr);
            await this.handleJobLastDay(AtTimeEnum.oneDay);
        }
        catch(e){
            this.logger.error("crone error",e);
        }
    }
}

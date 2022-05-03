import { AtTimeEnum } from "src/api/eventMailStatus/eventMailStatus.entity";

export interface EventRegistrationStreamInterface{
    er_email: string;
    er_id:number;
    collection_id: number;
    collection_name: string;
    collection_launchDate: string;
    atTime?:AtTimeEnum;
    ems_id?:number;
}
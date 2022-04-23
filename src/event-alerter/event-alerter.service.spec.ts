import { Test, TestingModule } from '@nestjs/testing';
import { EventAlerterService } from './event-alerter.service';

describe('EventAlerterService', () => {
  let service: EventAlerterService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EventAlerterService],
    }).compile();

    service = module.get<EventAlerterService>(EventAlerterService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

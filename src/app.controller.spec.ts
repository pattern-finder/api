import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';

describe('AppController', () => {
  let appController: AppController;
  let appService: AppService;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [AppService],
    }).compile();

    appController = app.get<AppController>(AppController);
    appService = app.get<AppService>(AppService);
  });

  describe('login with bad creds', () => {
    it('should return an unauthorized response', async () => {
      const result = 'Welcome to PicSpy API !';
      jest.spyOn(appService, 'getHome').mockImplementation(() => result);
      expect(await appController.home()).toBe(result);
    });
  });
});

import { Test, TestingModule } from '@nestjs/testing';
import { expect } from 'chai';
import { AppController } from '../src/module/app/app.controller.js';
import { AppService } from '../src/module/app/app.service.js';

describe('AppController', () => {
  let appController: AppController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [AppService],
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  describe('root', () => {
    it('should return "I\'m alive."', () => {
      expect(appController.getHealth()).to.equal("I'm alive.");
    });
  });
});

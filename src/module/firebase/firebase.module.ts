import { Module } from '@nestjs/common';
// import { FirebaseController } from './firebase.controller.js';
import { FirebaseService } from './firebase.service.js';

@Module({
  imports: [],
  // controllers: [FirebaseController],
  providers: [FirebaseService],
  exports: [FirebaseService],
})
export class FirebaseModule {}

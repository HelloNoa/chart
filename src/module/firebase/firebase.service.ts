import { Injectable } from '@nestjs/common';
import admin from 'firebase-admin';
import * as process from 'process';
import { TokenMessage } from 'firebase-admin/messaging';
import { SendNotificationResponseDto } from '../../dto/firebase.dto.js';

@Injectable()
export class FirebaseService {
  private readonly fcm = admin;

  constructor() {
    const firebaseKeys = {
      type: process.env.FIREBASE_TYPE,
      projectId: process.env.FIREBASE_PROJECT_ID,
      privateKeyId: process.env.FIREBASE_PRIVATE_KEY_ID,
      privateKey: (process.env.FIREBASE_PRIVATE_KEY + '').replace(/\\n/g, '\n'),
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      clientId: process.env.FIREBASE_CLIENT_ID,
      auth_uri: process.env.FIREBASE_AUTH_URI,
      tokenUrl: process.env.FIREBASE_TOKEN_URI,
      auth_provider_x509_cert_url:
        process.env.FIREBASE_AUTH_PROVIDER_X509_CERT_URL,
      client_x509_cert_url: process.env.FIREBASE_CLIENT_X509_CERT_URL,
    };
    this.fcm.initializeApp({
      credential: admin.credential.cert(firebaseKeys),
    });
  }
  async sendNotification(
    registrationToken: string,
    payload: TokenMessage,
  ): Promise<SendNotificationResponseDto> {
    payload.token = registrationToken;
    await this.fcm.messaging().send(payload);
    return {
      success: true,
    };
  }
}

import {
  GetSecretValueCommand,
  SecretsManagerClient,
} from '@aws-sdk/client-secrets-manager';
import { AssumeRoleCommand, STS } from '@aws-sdk/client-sts';
import { KMSClient, DecryptCommand } from '@aws-sdk/client-kms';
import process from 'process';
import { randomUUID } from 'crypto';
import { DecryptCommandInput } from '@aws-sdk/client-kms/dist-types/commands/DecryptCommand.js';

export const getsetSecretString = async () => {
  const AWS_ACCESS_KEY = process.env.AWS_ACCESS_KEY as string;
  const AWS_SECRET_KEY = process.env.AWS_SECRET_KEY as string;
  const aws_region = process.env.AWS_REGION as string;
  const aws_secret_name = process.env.ASSUME_SECRET_NAME as string;

  const client = new SecretsManagerClient({
    credentials: {
      accessKeyId: AWS_ACCESS_KEY,
      secretAccessKey: AWS_SECRET_KEY,
    },
    region: aws_region,
  });
  let response;
  try {
    response = await client.send(
      new GetSecretValueCommand({
        SecretId: aws_secret_name,
        VersionId: undefined,
        VersionStage: undefined,
        // VersionStage: 'AWSCURRENT', // VersionStage defaults to AWSCURRENT if unspecified
      }),
    );
    const secret: {
      SECRET_NAME: string;
      ROLE_ARN: string;
      SESSION_NAME: string;
      KEY_ID: string;
    } = JSON.parse(response.SecretString as string);
    const KeyId = secret.KEY_ID;

    const command = new AssumeRoleCommand({
      RoleArn: secret.ROLE_ARN,
      RoleSessionName: `ACCOUNT-${randomUUID()}-${Date.now()}`,
    });
    const sts = new STS({
      region: process.env.AWS_REGION,
      credentials: {
        accessKeyId: AWS_ACCESS_KEY,
        secretAccessKey: AWS_SECRET_KEY,
      },
    });
    const { Credentials } = await sts.send(command);
    if (!Credentials) {
      console.error('INVALID_AWS_OPERATION');
      return null;
    }
    const secretManagerClient = new SecretsManagerClient({
      region: process.env.AWS_REGION,
      credentials: {
        accessKeyId: Credentials.AccessKeyId!,
        secretAccessKey: Credentials.SecretAccessKey!,
        sessionToken: Credentials?.SessionToken,
        expiration: Credentials?.Expiration,
      },
    });
    const secretManagerCommand = new GetSecretValueCommand({
      SecretId: secret.SECRET_NAME,
      VersionStage: 'AWSCURRENT', // VersionStage defaults to AWSCURRENT if unspecified
    });
    try {
      const { SecretBinary } = await secretManagerClient.send(
        secretManagerCommand,
      );
      const client = new KMSClient({
        region: process.env.AWS_REGION,
        credentials: {
          accessKeyId: Credentials.AccessKeyId!,
          secretAccessKey: Credentials.SecretAccessKey!,
          sessionToken: Credentials?.SessionToken,
          expiration: Credentials?.Expiration,
        },
      });
      const input: DecryptCommandInput = {
        // DecryptRequest
        CiphertextBlob: SecretBinary, // required
        // EncryptionContext: {
        //   // EncryptionContextType
        //   '<keys>': 'STRING_VALUE',
        // },
        // GrantTokens: [
        //   // GrantTokenList
        //   'STRING_VALUE',
        // ],
        KeyId: KeyId,
        EncryptionAlgorithm: 'SYMMETRIC_DEFAULT',
        // Recipient: {
        //   // RecipientInfo
        //   KeyEncryptionAlgorithm: 'RSAES_OAEP_SHA_256',
        //   AttestationDocument: 'BLOB_VALUE',
        // },
      };
      const command = new DecryptCommand(input);
      const response = await client.send(command);
      const plainText = response.Plaintext;
      const decoder = new TextDecoder();
      const decodedData = decoder.decode(plainText);
      const json = JSON.parse(decodedData);

      if (!json) return '';
      const secret = json;
      const isDev = process.env.USE_SSH_TUNNEL === 'true';
      Object.keys(secret).forEach((key: string) => {
        process.env[key] = secret[key];
      });
      if (isDev) {
        process.env.NODE_ENV = 'test';
        process.env.REDIS_HOST = '127.0.0.1';
        process.env.USE_SSH_TUNNEL = 'true';
      }
      return json;
    } catch (error) {
      console.log(error);
      return null;
    }
  } catch (error) {
    // throw error;
    console.error(error);
    return null;
  }
};

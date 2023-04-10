import {
  SecretsManagerClient,
  GetSecretValueCommand,
} from '@aws-sdk/client-secrets-manager';
import { STS, AssumeRoleCommand } from '@aws-sdk/client-sts';
import process from 'process';
import { randomUUID } from 'crypto';

export const getsetSecretString = async () => {
  console.log('getsetSecretString');
  const AWS_ACCESS_KEY = process.env.AWS_ACCESS_KEY as string;
  const AWS_SECRET_KEY = process.env.AWS_SECRET_KEY as string;
  const aws_region = process.env.AWS_REGION as string;
  const aws_secret_name = process.env.AWS_SECRET_NAME as string;

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
        VersionStage: 'AWSCURRENT', // VersionStage defaults to AWSCURRENT if unspecified
      }),
    );
    console.log(response);
    const secret: {
      SECRET_NAME: string;
      ROLE_ARN: string;
      SESSION_NAME: string;
    } = JSON.parse(response.SecretString as string);

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
    console.log('Credentials');
    console.log(Credentials);
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
      const { SecretString } = await secretManagerClient.send(
        secretManagerCommand,
      );
      if (!SecretString) return '';
      const secret = JSON.parse(SecretString);
      console.log('secret');
      console.log(secret);
      const isDev = process.env.NODE_ENV === 'local';
      Object.keys(secret).forEach((key: string) => {
        process.env[key] = secret[key];
      });
      if (isDev) {
        process.env.REDIS_HOST = '127.0.0.1';
        process.env.USE_SSH_TUNNEL = 'true';
        process.env.SSH_USERNAME = 'ec2-user';
      }
      return SecretString;
    } catch (error) {
      console.log(error);
      return null;
    }
  } catch (error) {
    // throw error;
    console.error(error);
  }
};

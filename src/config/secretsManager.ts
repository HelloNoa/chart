import {
  SecretsManagerClient,
  GetSecretValueCommand,
} from '@aws-sdk/client-secrets-manager';
import process from 'process';

export const getsetSecretString = async () => {
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
    const secret = JSON.parse(response.SecretString as string);
    Object.keys(secret).forEach((key: string) => {
      process.env[key] = secret[key];
    });
  } catch (error) {
    // throw error;
    console.error(error);
  }
};

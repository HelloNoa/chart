import tunnel from 'tunnel-ssh';

export async function useSSHTunnel(
  host: string,
  port: number,
  localPort: number,
  connectFunction: () => Promise<any>,
) {
  console.log(host, port, localPort);
  const sshConfig = {
    username: process.env.SSH_USERNAME,
    host: process.env.SSH_HOST,
    port: 22,
    password: process.env.SSH_PASSWORD,
    dstHost: host,
    dstPort: port,
    keepAlive: true,
    localHost: '127.0.0.1',
    localPort,
  };

  return new Promise((resolve, reject) => {
    tunnel(sshConfig, (error, server) => {
      if (error != null) {
        reject(error);
      } else if (server == null) {
        throw reject(new Error('server not found'));
      } else {
        console.log('SSH Connected');

        connectFunction().then((data) => {
          resolve(data);
        });
      }
    });
  });
}

import { Currency } from '../module/grpc/interface/message.js';

export const USER_REPOSITORY_KEY = 'repository.user';
export const ORDER_REPOSITORY_KEY = 'repository.order';
export const MYSQL_DATASOURCE_KEY = 'datasource.mysql';
export const MYSQL_WRITE_DATASOURCE_KEY = 'datasource.write.mysql';
export const DB_CONFIG_KEY = 'config.database';
export const DB_WRITER_CONFIG_KEY = 'write.config.database';
export const CACHE_CONFIG_KEY = 'config.cache';

export enum EnvMode {
  Local = 'local',
  Dev = 'dev',
  Prod = 'prod',
  Test = 'test',
}

export const AppMode = (() => {
  switch (process.env.NODE_ENV?.toLowerCase()) {
    case EnvMode.Local:
      return EnvMode.Local;
    case EnvMode.Prod:
      return EnvMode.Prod;
    case EnvMode.Dev:
      return EnvMode.Dev;
    default:
      return EnvMode.Test;
  }
})();

export const DEFAULT_ISOLATION_LEVEL:
  | 'READ UNCOMMITTED'
  | 'READ COMMITTED'
  | 'REPEATABLE READ'
  | 'SERIALIZABLE' =
  AppMode == EnvMode.Local ? 'SERIALIZABLE' : 'REPEATABLE READ';

export const WithdrawFee: { [key: string]: number } = {
  BTC: 0.0009,
  ETH: 0.01,
  ETC: 0.01,
  MATIC: 0.05,
  LPT: 0.1,
  MANA: 1.9,
  AXS: 0.1,
  AUDIO: 9.0,
  SAND: 2.0,
  COMP: 0.1,
  LINK: 0.3,
  DYDX: 1.53,
  BNB: 0.08,
  OP: 0.09,
  AVAX: 0.01,
  ARB: 0.5,
};
export const MinWithdrawAmount: { [key: string]: number } = {
  BTC: 0.001,
  ETH: 0.02,
  ETC: 0.02,
  MATIC: 0.05,
  LPT: 0.1,
  MANA: 1.9,
  AXS: 0.1,
  AUDIO: 9.0,
  SAND: 2.0,
  COMP: 0.1,
  LINK: 0.3,
  DYDX: 1.53,
  BNB: 0.08,
  OP: 0.09,
  AVAX: 0.01,
  ARB: 0.37,
};

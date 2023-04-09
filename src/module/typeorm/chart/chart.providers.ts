import { DataSource } from 'typeorm';
import { chart } from './chart.entity.js';
import { MYSQL_DATASOURCE_KEY } from '../../../constants/index.js';

export const chartProviders = [
  {
    provide: 'CHART_REPOSITORY',
    useFactory: (dataSource: DataSource) => dataSource.getRepository(chart),
    inject: [MYSQL_DATASOURCE_KEY],
  },
];

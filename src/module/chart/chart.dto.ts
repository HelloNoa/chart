import { duration } from '../typeorm/order_interval/order_interval.entity.js';

export interface ChartReqDto {
  order_symbol_name: string;
  interval: keyof typeof duration;
  length: number;
  created_at: string;
}

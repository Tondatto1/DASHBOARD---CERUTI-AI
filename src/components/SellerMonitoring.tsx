import { Salesperson } from '../types';
import { Monitoring } from './Monitoring';

export interface SellerMonitoringProps {
  salespeople: Salesperson[];
}

export function SellerMonitoring({ salespeople }: SellerMonitoringProps) {
  return <Monitoring salespeople={salespeople} />;
}

export { Monitoring };

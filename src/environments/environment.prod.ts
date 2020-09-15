import { AppConfig } from '../app/helpers/config';
import { commonConfig } from './base';

export const environment: AppConfig = Object.assign({}, commonConfig, {
  production: true,
});

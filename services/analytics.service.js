import helpers from '../helpers/APIHelper';
import { METHOD_TYPES, PATHS } from '../config/constants';

export function getAnalytics() {
  return helpers.callApi(METHOD_TYPES.GET, PATHS.ANALYTICS.GET, {}, {});
}

import helpers from '../helpers/APIHelper';
import { METHOD_TYPES, PATHS } from '../config/constants';

export function getConfig() {
  return helpers.callApi(METHOD_TYPES.GET, PATHS.CONFIG.GET, {}, {});
}

export function getGCoins() {
  return helpers.callApi(METHOD_TYPES.GET, PATHS.CONFIG.GCOINS, {}, {});
}


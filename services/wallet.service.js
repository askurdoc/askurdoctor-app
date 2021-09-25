import helpers from '../helpers/APIHelper';
import { METHOD_TYPES, PATHS } from '../config/constants';

export function getWallets() {
  return helpers.callApi(METHOD_TYPES.GET, PATHS.WALLET.GET_ALL, {}, {});
}

export function getMyWallet() {
  return helpers.callApi(METHOD_TYPES.GET, PATHS.WALLET.MY_WALLET, {}, {});
}

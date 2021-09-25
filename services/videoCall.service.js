import helpers from '../helpers/APIHelper';
import { METHOD_TYPES, PATHS } from '../config/constants';

export function createToken(data) {
  return helpers.callApi(METHOD_TYPES.POST, PATHS.VIDEO.CREATE_CHANNEL, data, {});
}

export function createRoom(data) {
  return helpers.callApi(METHOD_TYPES.POST, PATHS.VIDEO.CREATE_ROOM, data, {});
}

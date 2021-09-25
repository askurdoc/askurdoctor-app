import helpers from '../helpers/APIHelper';
import { METHOD_TYPES, PATHS } from '../config/constants';


export function getRX(id) {
  const path = PATHS.RX.GET.replace('{id}', id);
  return helpers.callApi(METHOD_TYPES.GET, path, {}, {});
}

export function getRXBYAPPT(id) {
  const path = PATHS.RX.GET_BY_APPT_ID.replace('{id}', id);
  return helpers.callApi(METHOD_TYPES.GET, path, {}, {});
}

export function createRx(data) {
  return helpers.callApi(METHOD_TYPES.POST, PATHS.RX.CREATE, data, {});
}

export function getRXbyId(id) {
  const path = PATHS.RX.GET_BY_ID.replace('{id}', id);
  return helpers.callApi(METHOD_TYPES.GET, path, {}, {});
}

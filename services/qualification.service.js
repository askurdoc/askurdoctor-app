import helpers from '../helpers/APIHelper';
import { METHOD_TYPES, PATHS } from '../config/constants';

export function get() {
  return helpers.callApi(METHOD_TYPES.GET, PATHS.QUALIFICATION.GET, {}, {});
}

export function getById(id) {
  const path = PATHS.QUALIFICATION.GET_BY_ID.replace('{id}', id);
  return helpers.callApi(METHOD_TYPES.GET, path, {}, {});
}

export function verifiedList() {
  let path = PATHS.QUALIFICATION.LIST;
  path = `${path}?isVerified=APPROVED`
  return helpers.callApi(METHOD_TYPES.GET, path, {}, {});
}


export function notVerified() {
  let path = PATHS.QUALIFICATION.LIST;
  path = `${path}?isVerified=SUBMITTED`
  return helpers.callApi(METHOD_TYPES.GET, path, {}, {});
}

export function getList() {
  return helpers.callApi(METHOD_TYPES.GET, PATHS.QUALIFICATION.LIST, {}, {});
}

export function create(data) {
  return helpers.callApi(METHOD_TYPES.POST, PATHS.QUALIFICATION.CREATE, data, {});
}

export function update(data) {
  return helpers.callApi(METHOD_TYPES.PATCH, PATHS.QUALIFICATION.PATCH, data, {});
}

export function processRequest(id, data) {
  const path = PATHS.QUALIFICATION.PROCESS.replace('{id}', id);
  return helpers.callApi(METHOD_TYPES.PATCH, path, data, {});
}


export function submitRequest(id, data) {
  const path = PATHS.QUALIFICATION.SUBMIT.replace('{id}', id);
  return helpers.callApi(METHOD_TYPES.PATCH, path, data, {});
}



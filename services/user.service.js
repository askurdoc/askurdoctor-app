import helpers from '../helpers/APIHelper';
import { METHOD_TYPES, PATHS } from '../config/constants';

export function getProfile() {
  return helpers.callApi(METHOD_TYPES.GET, PATHS.AUTH.SELF, {}, {});
}

export function getProfileById(id) {
  const path = PATHS.AUTH.GET_BY_ID.replace('{id}', id);
  return helpers.callApi(METHOD_TYPES.GET, path, {}, {});
}


export function updateProfile(data) {
  return helpers.callApi(METHOD_TYPES.PATCH, PATHS.PROFILE.UPDATE, data, {});
}

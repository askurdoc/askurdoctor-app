import helpers from '../helpers/APIHelper';
import { METHOD_TYPES, PATHS } from '../config/constants';

export function registerUser(data) {
  return helpers.callApi(
    METHOD_TYPES.POST,
    PATHS.AUTH.REGISTER_VISITORS,
    data,
    {},
  );
}

export function registerDoctor(data) {
  return helpers.callApi(
    METHOD_TYPES.POST,
    PATHS.AUTH.REGISTER_DOCTORS,
    data,
    {},
  );
}

export function login(data) {
  return helpers.callApi(METHOD_TYPES.POST, PATHS.AUTH.LOGIN, data, {});
}

export function logoutUser() {
  localStorage.clear();
}

export function updatePassword(data) {
  return helpers.callApi(METHOD_TYPES.PATCH, PATHS.AUTH.UPDATE_PASSWORD, data, {});
}

export function forgotPassword(data) {
  return helpers.callApi(METHOD_TYPES.POST, PATHS.AUTH.FORGOT_PASSWORD, data, {});
}

export function resetPassword(data) {
  return helpers.callApi(METHOD_TYPES.PATCH, PATHS.AUTH.RESET_PASSWORD, data, {});
}



export function isAuthenticated() {
  if (
    localStorage.getItem('accessToken') === null ||
    localStorage.getItem('refreshToken') === null
  ) {
    return false;
  }
  const user = localStorage.getItem('user');
  return JSON.parse(user);
}

export function storeUser(data) {
  for (const [key, value] of Object.entries(data)) {
    localStorage.setItem(key, value);
  }
  localStorage.setItem('user', JSON.stringify(data));
}

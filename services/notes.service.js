import helpers from '../helpers/APIHelper';
import { METHOD_TYPES, PATHS } from '../config/constants';

export function getNotes(id) {
  const path = PATHS.NOTES.GET.replace('{id}', id);
  return helpers.callApi(METHOD_TYPES.GET, path, {}, {});
}

export function createNotes(data) {
  return helpers.callApi(METHOD_TYPES.POST, PATHS.NOTES.CREATE, data, {});
}

export function updateNotes(id, data) {
  const path = PATHS.NOTES.PATCH.replace('{appointmentId}', id);
  return helpers.callApi(METHOD_TYPES.PATCH, path, data, {});
}

import helpers from '../helpers/APIHelper';
import { METHOD_TYPES, PATHS } from '../config/constants';

export function upload(data) {
  return helpers.callApi(
    METHOD_TYPES.POST,
    PATHS.RESOURCE.CREATE,
    data,
    {},
  );
}

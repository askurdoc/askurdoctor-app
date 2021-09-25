import helpers from '../helpers/APIHelper';
import { METHOD_TYPES, PATHS } from '../config/constants';

export function getAllDrugs(page, category) {
  const path = PATHS.DRUGS.GET_ALL.replace('{page}', page);
  if(category){
    path += `&category=${category}`
  }
  return helpers.callApi(METHOD_TYPES.GET, path, {}, {});
}

export function search(text) {
  const path = PATHS.DRUGS.SEARCH.replace('{searchText}', text);
  return helpers.callApi(METHOD_TYPES.GET, path, {}, {});
}

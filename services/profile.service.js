import useSWR from 'swr'
import axiosInstance from '../helpers/axiosInstance';
import helpers from '../helpers/APIHelper';
import { METHOD_TYPES,  PATHS } from '../config/constants';

export function profile() {
  const fetcher = (url) => axiosInstance.get(url).then((res) => res.data);
  const { data, error } = useSWR(PATHS.AUTH.SELF, fetcher, {
    revalidateOnFocus: false,
  });
  return { data, isLoading: !data && !error, error };
}


export function profileUpload(data) {
  return helpers.callApi(
    METHOD_TYPES.PATCH,
    PATHS.PROFILE.IMAGE,
    data,
    {},
  );
}

import helpers from '../helpers/APIHelper';
import useSWR from 'swr'
import axiosInstance from '../helpers/axiosInstance';
import { METHOD_TYPES, PATHS } from '../config/constants';

export function createPatients(data) {
  return helpers.callApi(METHOD_TYPES.POST, PATHS.PATIENTS.CREATE, data, {});
}

export function getSWRPatientById(id) {
  const path = PATHS.PATIENTS.GET_BY_ID.replace('{id}', id);
  const fetcher = (url) => axiosInstance.get(url).then((res) => res.data);
  const { data, error } = useSWR(path, fetcher, {
    revalidateOnFocus: false,
  });
  return { data, isLoading: !data && !error, error };
}

export function getAllPatients() {
  return helpers.callApi(METHOD_TYPES.GET, PATHS.PATIENTS.GET_ALL, {}, {});
}

export function getPatientById(id) {
  const path = PATHS.PATIENTS.GET_BY_QUERY.replace('{id}', id);
  return helpers.callApi(METHOD_TYPES.GET, path, {}, {});
}


export function requestAppointment(data) {
  return helpers.callApi(
    METHOD_TYPES.POST,
    PATHS.PATIENTS.REQUEST,
    { campaignId: data },
    {},
  );
}

export function getDoctorSchedule(id, page) {
  console.log(id)
  const path = PATHS.PATIENTS.GET_CAMPAIGN_REQUESTS.replace('{id}', id);
  console.log(path)
  const Url = path.replace('{number}', page);
  return helpers.callApi(METHOD_TYPES.GET, Url, {}, {});
}

export function approveAppointments(campaignId, requestId) {
  return helpers.callApi(
    METHOD_TYPES.PATCH,
    PATHS.PATIENTS.APPROVE_CAMPAIGN_REQUEST,
    { campaignId, requestId, status: 'APPROVED' },
    {},
  );
}

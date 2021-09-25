import helpers from '../helpers/APIHelper';
import { METHOD_TYPES, PATHS } from '../config/constants';

export function getSchedule(doctorId, date) {
  const path = PATHS.DOCTORS.GET_DOCTORS_SCHEDULE.replace('{id}', doctorId);
  console.log(path)
  const Url = path.replace('{date}', date);
  return helpers.callApi(METHOD_TYPES.GET, Url, {}, {});
}

export function getFollowUpSchedule(doctorId, date) {
  const path = PATHS.DOCTORS.GET_FOLLOWUP_SCHEDULE.replace('{id}', doctorId);
  const Url = path.replace('{date}', date);
  return helpers.callApi(METHOD_TYPES.GET, Url, {}, {});
}

export function getallScheduleforDoc() {
  return helpers.callApi(METHOD_TYPES.GET, PATHS.DOCTORS.GET_ALL, {}, {});
}

export function createDoctors(data) {
  return helpers.callApi(METHOD_TYPES.POST, PATHS.DOCTORS.CREATE, data, {});
}

export function getAllDoctors() {
  return helpers.callApi(METHOD_TYPES.GET, PATHS.DOCTORS.GET_DEFAULT_ALL, {}, {});
}

export function makeDefault(id, data) {
  const path = PATHS.DOCTORS.MAKE_DEFAULT.replace('{id}', id);
  return helpers.callApi(METHOD_TYPES.PATCH, path, data, {});
}

export function getDoctorById(id, isDefault=false) {
  let path = PATHS.DOCTORS.GET_BY_ID.replace('{id}', id);
  if(isDefault){
    path += '&isDefault='+isDefault
  }
  return helpers.callApi(METHOD_TYPES.GET, path, {}, {});
}

export function requestAppointment(data) {
  return helpers.callApi(
    METHOD_TYPES.POST,
    PATHS.DOCTORS.REQUEST,
    { campaignId: data },
    {},
  );
}

export function getDoctorSchedule(id, page) {
  console.log(id)
  const path = PATHS.DOCTORS.GET_CAMPAIGN_REQUESTS.replace('{id}', id);
  console.log(path)
  const Url = path.replace('{number}', page);
  return helpers.callApi(METHOD_TYPES.GET, Url, {}, {});
}

export function approveAppointments(campaignId, requestId) {
  return helpers.callApi(
    METHOD_TYPES.PATCH,
    PATHS.DOCTORS.APPROVE_CAMPAIGN_REQUEST,
    { campaignId, requestId, status: 'APPROVED' },
    {},
  );
}


import helpers from '../helpers/APIHelper';
import { METHOD_TYPES, PATHS } from '../config/constants';

export function createAppointment(data) {
  return helpers.callApi(METHOD_TYPES.POST, PATHS.APPOINTMENT.CREATE, data, {});
}

export function createFollowUPAppointment(data) {
  return helpers.callApi(METHOD_TYPES.POST, PATHS.APPOINTMENT.CREATE_FOLLOW_UP, data, {});
}

export function getAppointment(page, status="PENDING,FOLLOW_UP") {
  const path = `${PATHS.APPOINTMENT.GET}?status=${status}`;
  return helpers.callApi(METHOD_TYPES.GET, path, {}, {});
}

export function getAppointmentById(appointmentId) {
  const path = PATHS.APPOINTMENT.GET_BY_ID.replace('{id}', appointmentId);
  return helpers.callApi(METHOD_TYPES.GET, path, {}, {});
}

export function appointmentComplete(appointmentId){
  const path = PATHS.APPOINTMENT.COMPLETE.replace('{id}', appointmentId);
  return helpers.callApi(METHOD_TYPES.PATCH, path, {}, {});
}

export function appointmentNotShownUP(appointmentId){
  const path = PATHS.APPOINTMENT.NOT_JOINED.replace('{id}', appointmentId);
  return helpers.callApi(METHOD_TYPES.PATCH, path, {}, {});
}

export function updateAppointment(appointmentId, data){
  const path = PATHS.APPOINTMENT.UPDATE.replace('{id}', appointmentId);
  return helpers.callApi(METHOD_TYPES.PATCH, path, data, {});
}

export function refundAppointment(appointmentId, data){
  const path = PATHS.APPOINTMENT.REFUND.replace('{id}', appointmentId);
  return helpers.callApi(METHOD_TYPES.PATCH, path, data, {});
}

export function extendAppointment(appointmentId, data){
  const path = PATHS.APPOINTMENT.EXTEND.replace('{id}', appointmentId);
  return helpers.callApi(METHOD_TYPES.PATCH, path, data, {});
}

export function followUpAppointment(appointmentId, data){
  const path = PATHS.APPOINTMENT.FOLLOW.replace('{id}', appointmentId);
  return helpers.callApi(METHOD_TYPES.PATCH, path, data, {});
}


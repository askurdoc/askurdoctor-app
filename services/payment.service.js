import helpers from '../helpers/APIHelper';
import { METHOD_TYPES, PATHS } from '../config/constants';
import { queryProcessor } from '../helpers/utils';

export function createPaymentSession(data) {
  return helpers.callApi(METHOD_TYPES.POST, PATHS.PAYMENT.SESSION, data, {});
}

export function submitPaymentId(data) {
  return helpers.callApi(METHOD_TYPES.POST, PATHS.PAYMENT.COMPLETION, data, {});
}

export function getMyTransactions() {
  return helpers.callApi(METHOD_TYPES.GET, PATHS.PAYMENT.TXN, {}, {});
}

export function getMyRequests() {
  return helpers.callApi(METHOD_TYPES.GET, PATHS.PAYMENT.WITHDRAWAL, {}, {});
}

export function createMyRequests() {
  return helpers.callApi(METHOD_TYPES.POST, PATHS.PAYMENT.WITHDRAWAL, {}, {});
}

export function approveRequest(id, payload) {
  const path = PATHS.PAYMENT.WITHDRAWAL_APPROVE.replace('{id}', id);
  return helpers.callApi(METHOD_TYPES.PATCH, path, payload, {});
}

export function getLedgerTransactions(status, page=1, range=[]) {
  const dateRange = range.length>0? range[0]: {}
  const query = queryProcessor({ ...dateRange, status, page })
  let path = PATHS.PAYMENT.LEDGER;
  if(query){
    path = `${path}${query}`
  }
  console.log(path)
  return helpers.callApi(METHOD_TYPES.GET, path, {}, {});
}

export function getLedgerTransactionsById(id) {
  const path = PATHS.PAYMENT.LEDGER_BY_ID.replace('{id}', id);
  return helpers.callApi(METHOD_TYPES.GET, path, {}, {});
}


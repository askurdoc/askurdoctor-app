import React, { useEffect, useState, useContext } from 'react';
import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';
import Notiflix from 'notiflix';
import Pagination from '@material-ui/lab/Pagination';

import { getMyRequests, approveRequest } from '../../services/payment.service';
import { getDateString } from '../../helpers/utils';
import { Button } from 'react-bootstrap';

export default function AdminWithdrawal(props) {
  const [txn, setTxn] = useState([]);

  const getData = async () => {
    Notiflix.Loading.pulse('Loading...');
    console.log('Loading...');
    try {
      const response = await getMyRequests();
      Notiflix.Loading.remove();
      if (response.data && response.data.data) {
        setTxn(response.data.data);
      } else {
        Notiflix.Notify.warning(response.data.error || 'No Transaction detail available');
      }
    } catch (e) {
      console.log(e)
      Notiflix.Loading.remove();
      Notiflix.Notify.failure(e.response.data.message);
    }
  };

  const approve = async (detailId) => {
    props.callBack(detailId)
  };
  useEffect(() => {
    getData();
  }, [props]);

  const loadTxn = () => {
    return txn.map((value) => {
      return (
        <tr>
          <td>{getDateString(value.createdAt)}</td>
          <td>{value.requestId}</td>
          <td>{value.userId}</td>
          <td>{value.profile.firstName} {value.profile.lastName}</td>
          <td>
            {value.currency.currencyCode == 'INR' ? 'Rs' : '$'}{' '}
            {value.serviceFee && value.applicationFee
              ? value.amount / 100 +
              value.serviceFee / 100 +
              value.applicationFee / 100
              : value.amount / 100}
          </td>
          <td>{value.referenceId || '-' }</td>
          <td>{value.dateOfTransaction ||'-'}</td>
          <td>{value.status}</td>
          <td><Button
                className="btn tp-btn btn-primary btn-sm"
                onClick={(e) => {
                  approve(value.requestId);
                }}
              >
                Approve
              </Button></td>
        </tr>
      );
    });
  };
  return (
    <div className="row">
      <div className="col-xl-12 fixedHt">
        <div className="table-responsive">
          {txn.length > 0 ? (
            <table className="table table-responsive-md">
              <thead>
                <tr>
                  <th>
                    <strong>Date</strong>
                  </th>
                  <th>
                    <strong>Request Id</strong>
                  </th>
                  <th>
                    <strong>User Id</strong>
                  </th>
                  <th>
                    <strong>Doctor Name</strong>
                  </th>
                  <th>
                    <strong>Amount</strong>
                  </th>
                  <th>
                    <strong>Reference Id</strong>
                  </th>
                  <th>
                    <strong>Date of Completion</strong>
                  </th>
                  <th>
                    <strong>Status</strong>
                  </th>
                  <th>
                    <strong>Action</strong>
                  </th>
                  
                </tr>
              </thead>
              <tbody>{loadTxn()}</tbody>
            </table>
          ) : (
            <h5>No Transaction Details Available </h5>
          )}
        </div>
      </div>
    </div>
  );
}

import React, { useEffect, useState, useContext } from 'react';
import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';
import Notiflix from 'notiflix';
import Pagination from '@material-ui/lab/Pagination';

import { getMyTransactions } from '../../services/payment.service';
import { getDateString } from '../../helpers/utils';

export default function WalletTable(props) {
  const [txn, setTxn] = useState([]);

  const getData = async () => {
    Notiflix.Loading.pulse('Loading...');
    console.log('Loading...');
    try {
      const response = await getMyTransactions();
      Notiflix.Loading.remove();
      if (response.data && response.data.data) {
        setTxn(response.data.data);
      } else {
        Notiflix.Notify.warning(response.data.error ||  'No Transaction details available');
      }
    } catch (e) {
      Notiflix.Loading.remove();
      Notiflix.Notify.failure(e.response.data.message);
    }
  };
  useEffect(() => {
    getData();
  }, [props]);

  const loadTxn = () => {
    return txn.map((value) => {
      return (
        <tr>
          <td>{value.gatewayIntentId}</td>
          <td>
            {value.transactionObj.currency == 'INR' ? 'Rs' : '$'}{' '}
            {value.transactionObj.amount / 100}
          </td>
          <td>{getDateString(value.transactionObj.created_at*1000)}</td>
          <td>{value.status}</td>
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
                    <strong>Txn id</strong>
                  </th>
                  <th>
                    <strong>Amount</strong>
                  </th>
                  <th>
                    <strong>Date</strong>
                  </th>
                  <th>
                    <strong>Status</strong>
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

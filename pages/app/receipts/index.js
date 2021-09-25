import React, { useEffect, useState, useContext } from 'react';
import { useRouter } from 'next/router';
import { subDays } from 'date-fns';
import { DateRangePicker } from 'react-date-range';
import Pagination from '@material-ui/lab/Pagination';
import 'react-date-range/dist/styles.css'; // main style file
import 'react-date-range/dist/theme/default.css'; // theme css file

import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { getLedgerTransactions } from '../../../services/payment.service';
import SideMenuLayout from '../../../layouts/SideMenuLayout';
import { getDateString } from '../../../helpers/utils';
import { isAuthenticated } from '../../../services/auth.service';
import Notiflix from 'notiflix';
import _ from 'lodash';

export default function Receipts(props) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [txn, setTxn] = useState([]);
  const [user, setUser] = useState(null);
  const [range, setRange] = useState([
    {
      startDate: subDays(new Date(), 30),
      endDate: new Date(),
      key: 'selection'
    }
  ]);

  const handleChange = (event, value) => {
    setPage(value);
    init();
  };


  const loadPage = (id) => {
    const path = `/app/receipts/${id}`;
    router.push({
      pathname: path,
    });
  };

  const handleSelect = (date) => {
    console.log(date); // native Date object
    setRange(date);
  }


  const filterData = async () => {
    setIsLoading(true);
    Notiflix.Loading.pulse('Loading...');
    try {
      const response = await getLedgerTransactions('COMPLETED', 1, range);
      Notiflix.Loading.remove();
      setIsLoading(false);
      if (response.data && response.data.data) {
        setTxn(response.data.data);
        setTotalPages(response.data.totalPages);
      } else {
        Notiflix.Notify.warning(response.data.error || 'No transactions available');
      }
    } catch (e) {
      setIsLoading(false);
      Notiflix.Loading.remove();
      Notiflix.Notify.failure(e.response.data.message);
    }
  }

  useEffect(() => {
    console.log('hi');
    filterData();
    const user = isAuthenticated();
    setUser(user);
  }, [props.state]);

  const loadTxn = () => {
    return txn.map((value, i) => {
      return (
        <tr>
          <td>{value.ledgerId}</td>
          <td>
            {value.currency.currencyCode == 'INR' ? 'Rs' : '$'}{' '}
            {value.serviceFee && value.applicationFee
              ? value.amount / 100 +
              value.serviceFee / 100 +
              value.applicationFee / 100
              : value.amount / 100}
          </td>
          <td>{getDateString(value.createdAt)}</td>
          <td>{value.status}</td>
          <td>
            <button
              type="button"
              className="btn tp-btn btn-info btn-sm"
              data-toggle="dropdown"
              onClick={(e) => {
                loadPage(value.ledgerId);
              }}
            >
              {' '}
              view
            </button>
          </td>
        </tr>
      );
    });
  };
  return (
    <SideMenuLayout title="Payment Details">
      <div className="content-body">
        <div className="container-fluid">
          <div className="row">
            {user && user.role.indexOf('ADMIN') > -1 ? <div class="col-4">
              <DateRangePicker
                onChange={item => setRange([item.selection])}
                showSelectionPreview={true}
                moveRangeOnFirstSelection={false}
                months={1}
                ranges={range}
                direction="horizontal"
              />
              <br />
              <div className="">
                <a
                  type="submit"
                  onClick={filterData}
                  className="btn text-white btn-primary mt-5"
                >
                  Filter
                </a>
              </div>
            </div> : null}
            <div className="col col-sm-12">
              <div className="card">
                <div className="card-header">
                  <h4 className="card-title">Payments Details</h4>

                </div>
                <div className="card-body">
                  <Pagination
                    count={totalPages}
                    page={page}
                    color="secondary"
                    onChange={handleChange}
                  />
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
                            <th>
                              <strong>Options</strong>
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
            </div>
          </div>
        </div>
      </div>
    </SideMenuLayout>
  );
}

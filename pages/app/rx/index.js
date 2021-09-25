import React, { useEffect, useState, useContext } from 'react';
import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';
import Link from 'next/link';
import SideMenuLayout from '../../../layouts/SideMenuLayout';
import { getRX } from '../../../services/rx.service';
import Pagination from '@material-ui/lab/Pagination';
import Notiflix, { Notify } from 'notiflix';
import { getDateString } from '../../../helpers/utils';

export default function Rx(props) {
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [rx, setRx] = useState([]);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    console.log('hi');
    init();
  }, []);

  const handleChange = (event, value) => {
    setPage(value);
    init();
  };
  const init = async () => {
    setIsLoading(true);
    Notiflix.Loading.pulse('Loading...');
    try {
      const response = await getRX(page);
      Notiflix.Loading.remove();
      setIsLoading(false);
      if (response.data && response.data.data) {
        setRx(response.data.data);
        setTotalPages(response.data.totalPages);
      } else {
        Notiflix.Notify.warning(response.data.error || 'No prescription detail available');
      }
    } catch (e) {
      setIsLoading(false);
      Notiflix.Loading.remove();
      Notiflix.Notify.failure(e.response.data.message);
    }
  };

  const loadRx = () => {
    return rx.map((item, i) => {
      return (
        <tr>
          <td>{getDateString(item.createdAt)}</td>
          <td>{item.appointmentId}</td>
          <td>{item.rxId}</td>
          <td>
            <Link href={`/app/rx/${item.rxId}/view`}><a
              type="button"
              className="btn tp-btn btn-info btn-sm"
              data-toggle="dropdown"
            >
              {' '}
              view
            </a>
            </Link>
          </td>
        </tr>
      );
    });
  };
  return (
    <SideMenuLayout title="Rx">
      <div className="content-body">
        <div className="container-fluid">
          <Pagination
            count={totalPages}
            page={page}
            color="secondary"
            onChange={handleChange}
          />
          <div className="row">
            <div className="col-xl-12">
              <div className="table-responsive">
                <table className="table table-responsive-md">
                  <thead>
                    <tr>
                      <th>
                        <strong>Appointment Date</strong>
                      </th>
                      <th>
                        <strong>Appointment Id</strong>
                      </th>
                      <th>
                        <strong>Prescription Id</strong>
                      </th>
                      <th>options</th>
                    </tr>
                  </thead>
                  <tbody>{loadRx()}</tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </SideMenuLayout>
  );
}

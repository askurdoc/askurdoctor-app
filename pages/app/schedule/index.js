import React, { useEffect, useState, useContext } from 'react';
import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';
import Link from 'next/link';
import SideMenuLayout from '../../../layouts/SideMenuLayout';
import {
  getallScheduleforDoc,
  makeDefault,
} from '../../../services/doctors.service';
import Notiflix, { Notify } from 'notiflix';

export default function Schedule(props) {
  const router = useRouter();
  const [schedules, setSchedules] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const init = async () => {
    setIsLoading(true);
    Notiflix.Loading.pulse('Loading...');
    try {
      const response = await getallScheduleforDoc();
      Notiflix.Loading.remove();
      setIsLoading(false);
      if (response.data && response.data.data) {
        setSchedules(response.data.data);
      } else {
        Notiflix.Notify.warning(response.data.error || 'No doctor schedule available');
      }
    } catch (e) {
      setIsLoading(false);
      Notiflix.Loading.remove();
      Notiflix.Notify.failure(e.response.data.message);
    }
  };

  const makeDefaultItem = async (detailId) => {
    const payload = {
      isDefault: true,
    };
    setIsLoading(true);
    Notiflix.Loading.pulse('Loading...');
    try {
      const response = await makeDefault(detailId, payload);
      Notiflix.Loading.remove();
      setIsLoading(false);
      if (response.data && response.data.msg) {
        Notiflix.Notify.success(response.data.msg);
        init();
      } else {
        Notiflix.Notify.warning(response.data.error || 'Failed to update default');
      }
    } catch (e) {
      setIsLoading(false);
      Notiflix.Loading.remove();
      Notiflix.Notify.failure(e.response.data.message);
    }
  };

  useEffect(() => {
    console.log('hi');
    init();
  }, []);

  const loadSchedules = () => {
    return schedules.map((item, i) => {
      return (
        <tr>
          <td>{item.name}</td>
          <td>{item.status}</td>
          <td>
            {item.isDefault ? (
              <span className="badge light badge-success">Default</span>
            ) : (
              <a
                className="btn tp-btn btn-primary btn-sm"
                onClick={(e) => {
                  makeDefaultItem(item.detailId);
                }}
              >
                Make Default
              </a>
            )}
          </td>
          {/* <td>
            <button
              type="button"
              className="btn tp-btn btn-info btn-sm hide"
              data-toggle="dropdown"
            >
              {' '}
              view
            </button>
            <button
              type="button"
              className="btn tp-btn btn-warning btn-sm hide"
              data-toggle="dropdown"
            >
              {' '}
              edit
            </button>
            <button
              type="button"
              className="btn tp-btn btn-danger btn-sm hide"
              data-toggle="dropdown"
            >
              {' '}
              delete
            </button>
          </td> */}
        </tr>
      );
    });
  };

  return (
    <SideMenuLayout title="Schedule">
      <div className="content-body">
        <div className="container-fluid">
          <div className="form-head d-flex mb-3  mb-lg-5   align-items-start">
            <Link href="/app/schedule/add">
              <a className="btn btn-danger">+ New Schedule</a>
            </Link>
          </div>
          <div className="row">
            <div className="col-xl-12">
              <div className="table-responsive">
                <table className="table table-responsive-md">
                  <thead>
                    <tr>
                      <th>
                        <strong>Schedule Name</strong>
                      </th>
                      <th>
                        <strong>Created Date</strong>
                      </th>
                      <th>
                        <strong>STATUS</strong>
                      </th>
                      {/* <th>options</th> */}
                    </tr>
                  </thead>
                  <tbody>{loadSchedules()}</tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </SideMenuLayout>
  );
}

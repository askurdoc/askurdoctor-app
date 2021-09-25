import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

import Link from 'next/link';
import { useForm } from 'react-hook-form';
import SideMenuLayout from '../../../layouts/SideMenuLayout';
import { getAppointment } from '../../../services/appointment.service';
import { getAnalytics } from '../../../services/analytics.service';
import { processDateTime } from '../../../helpers/utils';
import Notiflix from 'notiflix';
import _ from 'lodash';
import { APP_CONFIG } from '../../../config/constants';

export default function Dashboard(props) {
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [appoitments, setAppointment] = useState([]);
  const [followUpList, setFollowUps] = useState([]);
  const [analytics, setAnalytics] = useState({});

  useEffect(() => {
    console.log(props)
    init();
  }, []);

  const init = async () => {
    setIsLoading(true);
    Notiflix.Loading.pulse('Loading...');
    try {
      const response = await getAppointment(1, 'PENDING');
      const followUps = await getAppointment(1, 'FOLLOW_UP');
      const analytics = await getAnalytics();
      Notiflix.Loading.remove();
      setIsLoading(false);
      if (response.data && response.data.data) {
        setAppointment(response.data.data);
      } else {
        Notiflix.Notify.warning(response.data.error || 'No data details available');
        setAppointment([]);
      }
      if (followUps.data && followUps.data.data) {
        setFollowUps(followUps.data.data);
      } else {
        Notiflix.Notify.warning(
          response.data.error || 'No data details available',
        );
        setAppointment([]);
      }
      if (analytics.data && analytics.data.funds) {
        setAnalytics(analytics.data);
      }
    } catch (e) {
      setIsLoading(false);
      Notiflix.Loading.remove();
      Notiflix.Notify.failure(e.response.data.message);
    }
  };

  const patientClick = (item) => {
    console.log(item);
    const path = `/app/patients/${item.patientId}`;
    router.push({
      pathname: path,
    });
  };

  const renderAppointment = () => {
    return appoitments.map((item, i) => {
      console.log(item);
      return (
        <tr>
          <td>
            <div className="media align-items-center hover" onClick={(e) => {
            patientClick(item);
          }}>
              <img
                className="mr-3 img-fluid rounded"
                width="78"
                src={item.patientDetail.profileImage}
                alt="DexignZone"
              />
              <div className="media-body">
                <a >
                  <h5 className="mt-0 mb-1">
                    {item.patientDetail.firstName} {item.patientDetail.lastName}
                  </h5>
                </a>
              </div>
            </div>
          </td>
          <td>
            <p className="mb-0">Doctor</p>
            <h5 className="my-0 text-primary">
              {item.docDetail.firstName} {item.docDetail.lastName}
            </h5>
          </td>
          <td>
            <div className="d-flex align-items-center">
              <div>
                <small>{processDateTime(item.schedule)} </small>
                <br />
                <Link href={`/app/consultation/${item.appointmentId}`}>
                  <a className="mt-0 mb-1 text-success">
                    Click to Start Consultation
                  </a>
                </Link>
              </div>
              <div className="dropdown ml-auto">
                <div className="btn-link" data-toggle="dropdown">
                  {/* <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="24px" height="24px" viewBox="0 0 24 24" version="1.1"><g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd"><rect x="0" y="0" width="24" height="24"></rect><circle fill="#000000" cx="12" cy="5" r="2"></circle><circle fill="#000000" cx="12" cy="12" r="2"></circle><circle fill="#000000" cx="12" cy="19" r="2"></circle></g></svg> */}
                </div>
                <div className="dropdown-menu dropdown-menu-right">
                  <a className="dropdown-item" href="#">
                    Edit
                  </a>
                  <a className="dropdown-item" href="#">
                    Delete
                  </a>
                </div>
              </div>
            </div>
          </td>
        </tr>
      );
    });
  };

  const renderFollowUps = () =>{
    return followUpList.map((item, i) => {
      console.log(item);
      return (
        <tr>
          <td>
            <div className="media align-items-center hover" onClick={(e) => {
            patientClick(item);
          }}>
              <img
                className="mr-3 img-fluid rounded"
                width="78"
                src={item.patientDetail.profileImage}
                alt="DexignZone"
                
              />
              <div className="media-body">
                <a >
                  <h5 className="mt-0 mb-1">
                    {item.patientDetail.firstName} {item.patientDetail.lastName}
                  </h5>
                </a>
              </div>
            </div>
          </td>
          <td>
            <p className="mb-0">Doctor</p>
            <h5 className="my-0 text-primary">
              {item.docDetail.firstName} {item.docDetail.lastName}
            </h5>
          </td>
          <td>
            <div className="d-flex align-items-center">
              <div>
                <small>{processDateTime(item.schedule)} </small>
                <br />
                <Link href={`/app/consultation/${item.appointmentId}`}>
                  <a className="mt-0 mb-1 text-success">
                    Click to Start Consultation
                  </a>
                </Link>
              </div>
              <div className="dropdown ml-auto">
                <div className="btn-link" data-toggle="dropdown">
                  {/* <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="24px" height="24px" viewBox="0 0 24 24" version="1.1"><g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd"><rect x="0" y="0" width="24" height="24"></rect><circle fill="#000000" cx="12" cy="5" r="2"></circle><circle fill="#000000" cx="12" cy="12" r="2"></circle><circle fill="#000000" cx="12" cy="19" r="2"></circle></g></svg> */}
                </div>
                <div className="dropdown-menu dropdown-menu-right">
                  <a className="dropdown-item" href="#">
                    Edit
                  </a>
                  <a className="dropdown-item" href="#">
                    Delete
                  </a>
                </div>
              </div>
            </div>
          </td>
        </tr>
      );
    });
  }

  return (
    <SideMenuLayout title="Dashboard">
      <div className="content-body">
        <div className="container-fluid">
          <div className="form-head d-flex mb-3 mb-md-5 align-items-start">
            <div className="mr-auto d-none d-lg-block">
              <h3 className="text-primary font-w600">
                Welcome to {APP_CONFIG.name}!
              </h3>
              <p className="mb-0">Online Consultation Platform</p>
            </div>

            
          </div>
          <div className="row">
            <div className="col-xl-6 col-xxl-12">
              <div className="row">
                <div className="col-xl-12 col-xxl-12 col-lg-12 col-md-12">
                  <div className="card">
                    <div className="card-header border-0 pb-0">
                      <h4 className="card-title">Upcoming Consultation</h4>
                      <div className="dropdown ml-auto">
                        <div className="btn-link" data-toggle="dropdown">
                          {/* <svg width="24px" height="24px" viewBox="0 0 24 24" version="1.1"><g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd"><rect x="0" y="0" width="24" height="24"></rect><circle fill="#000000" cx="5" cy="12" r="2"></circle><circle fill="#000000" cx="12" cy="12" r="2"></circle><circle fill="#000000" cx="19" cy="12" r="2"></circle></g></svg> */}
                        </div>
                        <div className="dropdown-menu dropdown-menu-right">
                          <a className="dropdown-item" href="#">
                            Edit
                          </a>
                          <a className="dropdown-item" href="#">
                            Delete
                          </a>
                        </div>
                      </div>
                    </div>
                    <div className="card-body">
                      <div className="table-responsive ">
                        <table className="table patient-activity">
                          {renderAppointment()}
                        </table>
                      </div>
                    </div>
                    <div className="card-footer border-0 pt-0 text-center hide">
                      <a href="#" className="btn-link">
                        See More
                      </a>
                    </div>
                  </div>
                </div>
                <div className="col-xl-12 col-xxl-12 col-lg-12 col-md-12">
                  <div className="card">
                    <div className="card-header border-0 pb-0">
                      <h4 className="card-title">
                        Follow Up
                      </h4>
                     
                    </div>
                    <div className="card-body">
                      <div className="table-responsive ">
                        <table className="table patient-activity">
                          {renderFollowUps()}
                        </table>
                      </div>
                    </div>
                    <div className="card-footer border-0 pt-0 text-center hide">
                      <a href="#" className="btn-link">
                        See More
                      </a>
                    </div>
                  </div>
                </div>
              
              </div>
            </div>
            <div className="col-xl-6 col-xxl-12">
              <div className="row">
                <div className="col-xl-6 col-lg-6 col-sm-6">
                  <div className="widget-stat card bg-danger">
                    <div className="card-body  p-4">
                      <div className="media">
                        <span className="mr-3">
                          <i className="flaticon-381-calendar-1"></i>
                        </span>
                        <div className="media-body text-white text-right">
                          <p className="mb-1">Appointment</p>
                          <h4 className="text-white">
                            {analytics && analytics.PENDING
                              ? analytics.PENDING.count
                              : 0}
                          </h4>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="col-xl-6 col-lg-6 col-sm-6">
                  <div className="widget-stat card bg-primary">
                    <div className="card-body p-4">
                      <div className="media">
                        <span className="mr-3">
                          <i className="flaticon-381-user-7"></i>
                        </span>
                        <div className="media-body text-white text-right">
                          <p className="mb-1">Funds</p>
                          <h4 className="text-white">
                            Rs{' '}
                            {analytics && analytics.funds
                              ? analytics.funds / 100
                              : 0}
                          </h4>
                        </div>
                      </div>
                    </div>
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

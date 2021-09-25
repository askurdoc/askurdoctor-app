import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

import Link from 'next/link';
import { useForm } from 'react-hook-form';
import SideMenuLayout from '../../../layouts/SideMenuLayout';
import { getAppointment } from '../../../services/appointment.service';
import { getAnalytics } from '../../../services/analytics.service';
import Notiflix from 'notiflix';
import _ from 'lodash';
import { APP_CONFIG } from '../../../config/constants';
import appointment from '../../../components/Appointment';

export default function Dashboard(props) {
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [appoitments, setAppointment] = useState([]);
  const [followUpList, setFollowUps] = useState([]);
  const [analytics, setAnalytics] = useState({});

  useEffect(() => {
    init();
  }, []);

  const init = async () => {
    setIsLoading(true);
    Notiflix.Loading.pulse('Loading...');
    try {
      const response = await getAppointment(1);
      const followUps = await getAppointment(1, 'REQUIRED_FOLLOW_UP');
      const analytics = await getAnalytics();
      Notiflix.Loading.remove();
      setIsLoading(false);
      if (response.data && response.data.data) {
        setAppointment(response.data.data);
      } else {
        Notiflix.Notify.warning(
          response.data.error || 'No data details available',
        );
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

  const loadFollowup = (doctorId, patientid, appointmentId) => {
    const path = `/app/appointments/${doctorId}`;
    router.push({
      pathname: path,
      query: { patientId: patientid, appointmentId: appointmentId },
    });
  }

  const processDateTime = (schedule) => {
    const monthShort = [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec',
    ];

    const dt = new Date(schedule.date);
    const date = dt.getDate();
    const mon = monthShort[dt.getUTCMonth()];
    const year = dt.getUTCFullYear();
    return `${date} ${mon} ${year} ${schedule.time}`;
  };

  const renderFollowUps = () => {
    return followUpList.map((item, i) => {
      console.log(item);
      return (
        <tr>
          <td>
            <div className="media align-items-center">
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
                <a className="onHover" onClick={(e) => { loadFollowup(item.doctorId, item.patientId, item.appointmentId) }}>
                  <a className="mt-0 mb-1 text-success">
                    Book New Appointment
                  </a>
                </a>
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

  const renderAppointment = () => {
    return appoitments.map((item, i) => {
      return (
        <tr>
          <td>
            <div className="media align-items-center">
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
                <br />
                {item.status == "FOLLOW_UP" ? <small className="text-primary">This is a follow up appointment</small> : null}
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

            <div className="input-group search-area ml-auto d-inline-flex hide">
              <input
                type="text"
                className="form-control"
                placeholder="Search here"
              />
              <div className="input-group-append">
                <a className="input-group-text">
                  <i className="flaticon-381-search-2"></i>
                </a>
              </div>
            </div>
            <a className="btn btn-primary ml-3 hide">
              <i className="flaticon-381-settings-2 mr-0"></i>
            </a>
          </div>
          <div className="row">
            <div className="col-xl-6 col-xxl-12">
              <div className="row">
                <div className="col-xl-12 col-xxl-12 col-lg-12 col-md-12">
                  <div className="card">
                    <div className="card-header border-0 pb-0">
                      <h4 className="card-title">
                        Recent Appointment Activity
                      </h4>

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
                        Need Follow Up
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
                <div className="col-xl-6 col-xxl-6 col-lg-6 col-md-6">
                  <div className="card">
                    <Link href="/app/appointments">
                      <div
                        className="plus-box onHover"
                        style={{ minHeight: '173px' }}
                      >
                        <p>Create new appointment</p>
                      </div>
                    </Link>
                    <div className="card-header border-0 pb-0 hide">
                      <h4 className="card-title">Visitors</h4>
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
                  </div>
                </div>

                <div className="col-xl-6 col-lg-6 col-sm-6 ">
                  <div className="widget-stat card bg-success">
                    <div className="card-body p-4">
                      <div className="media">
                        <span className="mr-3">
                          <i className="flaticon-381-diamond"></i>
                        </span>
                        <div className="media-body text-white text-right">
                          <p className="mb-1">Wallet</p>
                          <h3 className="text-white">
                            Rs{' '}
                            {analytics && analytics.funds
                              ? analytics.funds / 100
                              : 0}
                          </h3>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="col-xl-6 col-lg-6 col-sm-6">
                  <div className="widget-stat card bg-danger">
                    <div className="card-body  p-4">
                      <div className="media">
                        <span className="mr-3">
                          <i className="flaticon-381-calendar-1"></i>
                        </span>
                        <div className="media-body text-white text-right">
                          <p className="mb-1">Appointment</p>
                          <h3 className="text-white">
                            {analytics && analytics.PENDING
                              ? analytics.PENDING.count
                              : 0}
                          </h3>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-xl-6 col-lg-6 col-sm-6 hide">
                  <div className="widget-stat card bg-info">
                    <div className="card-body p-4">
                      <div className="media">
                        <span className="mr-3">
                          <i className="flaticon-381-heart"></i>
                        </span>
                        <div className="media-body text-white text-right">
                          <p className="mb-1">Wallet</p>
                          <h3 className="text-white">783K</h3>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-xl-6 col-lg-6 col-sm-6 hide">
                  <div className="widget-stat card bg-primary">
                    <div className="card-body p-4">
                      <div className="media">
                        <span className="mr-3">
                          <i className="flaticon-381-user-7"></i>
                        </span>
                        <div className="media-body text-white text-right">
                          <p className="mb-1">Doctor</p>
                          <h3 className="text-white">$76</h3>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="row hide">
                <div className="col-xl-12 col-xxl-12 col-lg-12 col-md-12">
                  <div className="card">
                    <div className="card-header border-0 pb-0">
                      <h4 className="card-title">Revenue</h4>
                      <select className="form-control style-1 default-select ">
                        <option>2021</option>
                        <option>2020</option>
                        <option>2019</option>
                      </select>
                    </div>
                    <div className="card-body pt-2">
                      <h3 className="text-primary font-w600">
                        $41,512k{' '}
                        <small className="text-dark ml-2">$25,612k</small>
                      </h3>
                      <div id="chartBar"></div>
                    </div>
                  </div>
                </div>
                <div className="col-12">
                  <div className="card">
                    <div className="card-header border-0 pb-0">
                      <h4 className="card-title">Top 5 Best Doctor</h4>
                      <a className="btn-link ml-auto" href="#">
                        More{' '}
                      </a>
                    </div>
                    <div className="card-body">
                      <div className="widget-media best-doctor">
                        <ul
                          className="timeline dz-scroll height630"
                          id="bestDoctorsContent"
                        >
                          <li>
                            <div className="timeline-panel">
                              <div className="media mr-4">
                                <img
                                  alt="image"
                                  width="90"
                                  src="images/avatar/1.jpg"
                                />
                                <div className="number">#1</div>
                              </div>
                              <div className="media-body">
                                <a >
                                  <h4 className="mb-2">Dr. Samantha Queque</h4>
                                </a>
                                <p className="mb-2 text-primary">
                                  Gynecologist
                                </p>
                                <div className="star-review">
                                  <i className="fa fa-star text-orange"></i>
                                  <i className="fa fa-star text-orange"></i>
                                  <i className="fa fa-star text-orange"></i>
                                  <i className="fa fa-star text-gray"></i>
                                  <i className="fa fa-star text-gray"></i>
                                  <span className="ml-3">451 reviews</span>
                                </div>
                              </div>
                              <div className="social-media">
                                <a className="btn btn-outline-primary btn-rounded fa fa-instagram btn-sm"></a>
                                <a className="btn btn-outline-primary btn-rounded fa fa-twitter btn-sm"></a>
                                <a className="btn btn-outline-primary btn-rounded fa fa-facebook btn-sm"></a>
                              </div>
                            </div>
                          </li>
                          <li>
                            <div className="timeline-panel active">
                              <div className="media mr-4">
                                <img
                                  alt="image"
                                  width="90"
                                  src="images/avatar/2.jpg"
                                />
                                <div className="number">#2</div>
                              </div>
                              <div className="media-body">
                                <a >
                                  <h4 className="mb-2">Dr. Abdul Aziz Lazis</h4>
                                </a>
                                <p className="mb-2 text-primary">
                                  Physical Therapy
                                </p>
                                <div className="star-review">
                                  <i className="fa fa-star text-orange"></i>
                                  <i className="fa fa-star text-orange"></i>
                                  <i className="fa fa-star text-orange"></i>
                                  <i className="fa fa-star text-orange"></i>
                                  <i className="fa fa-star text-gray"></i>
                                  <span className="ml-3">238 reviews</span>
                                </div>
                              </div>
                              <div className="social-media">
                                <a className="btn btn-outline-primary btn-rounded fa fa-instagram btn-sm"></a>
                                <a className="btn btn-outline-primary btn-rounded fa fa-twitter btn-sm"></a>
                                <a className="btn btn-outline-primary btn-rounded fa fa-facebook btn-sm"></a>
                              </div>
                            </div>
                          </li>
                          <li>
                            <div className="timeline-panel">
                              <div className="media mr-4">
                                <img
                                  alt="image"
                                  width="90"
                                  src="images/avatar/3.jpg"
                                />
                                <div className="number">#3</div>
                              </div>
                              <div className="media-body">
                                <a >
                                  <h4 className="mb-2">Dr. Samuel Jr.</h4>
                                </a>
                                <p className="mb-2 text-primary">Dentist</p>
                                <div className="star-review">
                                  <i className="fa fa-star text-orange"></i>
                                  <i className="fa fa-star text-orange"></i>
                                  <i className="fa fa-star text-orange"></i>
                                  <i className="fa fa-star text-gray"></i>
                                  <i className="fa fa-star text-gray"></i>
                                  <span className="ml-3">300 reviews</span>
                                </div>
                              </div>
                              <div className="social-media">
                                <a className="btn btn-outline-primary btn-rounded fa fa-instagram btn-sm"></a>
                                <a className="btn btn-outline-primary btn-rounded fa fa-twitter btn-sm"></a>
                                <a className="btn btn-outline-primary btn-rounded fa fa-facebook btn-sm"></a>
                              </div>
                            </div>
                          </li>
                          <li>
                            <div className="timeline-panel">
                              <div className="media mr-4">
                                <img
                                  alt="image"
                                  width="90"
                                  src="images/avatar/4.jpg"
                                />
                                <div className="number">#4</div>
                              </div>
                              <div className="media-body">
                                <a >
                                  <h4 className="mb-2">Dr. Alex Siauw</h4>
                                </a>
                                <p className="mb-2 text-primary">
                                  Physical Therapy
                                </p>
                                <div className="star-review">
                                  <i className="fa fa-star text-orange"></i>
                                  <i className="fa fa-star text-orange"></i>
                                  <i className="fa fa-star text-orange"></i>
                                  <i className="fa fa-star text-gray"></i>
                                  <i className="fa fa-star text-gray"></i>
                                  <span className="ml-3">451 reviews</span>
                                </div>
                              </div>
                              <div className="social-media">
                                <a className="btn btn-outline-primary btn-rounded fa fa-instagram btn-sm"></a>
                                <a className="btn btn-outline-primary btn-rounded fa fa-twitter btn-sm"></a>
                                <a className="btn btn-outline-primary btn-rounded fa fa-facebook btn-sm"></a>
                              </div>
                            </div>
                          </li>
                          <li>
                            <div className="timeline-panel">
                              <div className="media mr-4">
                                <img
                                  alt="image"
                                  width="90"
                                  src="images/avatar/5.jpg"
                                />
                                <div className="number">#5</div>
                              </div>
                              <div className="media-body">
                                <a >
                                  <h4 className="mb-2">Dr. Jennifer Ruby</h4>
                                </a>
                                <p className="mb-2 text-primary">Nursingc</p>
                                <div className="star-review">
                                  <i className="fa fa-star text-orange"></i>
                                  <i className="fa fa-star text-orange"></i>
                                  <i className="fa fa-star text-orange"></i>
                                  <i className="fa fa-star text-orange"></i>
                                  <i className="fa fa-star text-orange"></i>
                                  <span className="ml-3">700 reviews</span>
                                </div>
                              </div>
                              <div className="social-media">
                                <a className="btn btn-outline-primary btn-rounded fa fa-instagram btn-sm"></a>
                                <a className="btn btn-outline-primary btn-rounded fa fa-twitter btn-sm"></a>
                                <a className="btn btn-outline-primary btn-rounded fa fa-facebook btn-sm"></a>
                              </div>
                            </div>
                          </li>
                        </ul>
                      </div>
                    </div>
                    <div className="card-footer text-center border-0 pt-0">
                      <a
                        className="text-primary dz-load-more"
                        id="bestDoctors"


                      >
                        See More{' '}
                      </a>
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

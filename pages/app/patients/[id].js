import React, { useEffect, useState, useContext } from 'react';
import { useRouter } from 'next/router';

import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { getSWRPatientById } from '../../../services/patients.service';
import SideMenuLayout from '../../../layouts/SideMenuLayout';
import Notiflix from 'notiflix';
import _ from 'lodash';

export default function AddPatients(props) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [doctors, setDoctors] = useState([]);
  const [type, setType] = useState(null);
  const { id } = router.query;

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const { error, data, isLoading } = getSWRPatientById(id);
  console.log(data)

  const onTypeChange = (event) => {
    setType(event.target.value);
  };

  useEffect(() => {
    console.log('hi');
  }, [props.state]);


  const loadMedicalHistory = () => {

    return data.history
      .map((data) => {
        return (
          <li>
            <div class="timeline-badge primary"></div>
            <a class="timeline-panel text-muted" href="#">
              {/* <span>10 minutes ago</span> */}
              <h6
                class="mb-0"
                dangerouslySetInnerHTML={{
                  __html: data.notes,
                }}
              ></h6>
            </a>
          </li>

        );
      });
  };

  return (
    <SideMenuLayout title="Patient Record">
      <div className="content-body">
        <div className="container-fluid">
          <div className="row page-titles mx-0">
            <div className="col-sm-6 p-md-0">
              <div className="welcome-text">
                <h4>Patient Record</h4>
                <p className="mb-0">
                </p>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-sm-6 p-md-0">
              <div className="card">
                <div className="card-body">

                  {data ? (
                    <div>

                      <div className="row mb-2">
                        <div className="col-sm-3 col-5">
                          <h5 className="f-w-500">
                            Name <span className="pull-right">:</span>
                          </h5>
                        </div>
                        <div className="col-sm-9 col-7">
                          <span>
                            {data.firstName} {data.lastName}
                          </span>
                        </div>
                      </div>


                      <div className="row mb-2">
                        <div className="col-sm-3 col-5">
                          <h5 className="f-w-500">
                            Gender <span className="pull-right">:</span>
                          </h5>
                        </div>
                        <div className="col-sm-9 col-7">
                          <span>{data.gender}</span>
                        </div>
                      </div>
                      <div className="row mb-2">
                        <div className="col-sm-3 col-5">
                          <h5 className="f-w-500">
                            Age <span className="pull-right">:</span>
                          </h5>
                        </div>
                        <div className="col-sm-9 col-7">
                          <span>{data.details.age}</span>
                        </div>
                      </div>
                      <div className="row mb-2">
                        <div className="col-sm-3 col-5">
                          <h5 className="f-w-500">
                            Height <span className="pull-right">:</span>
                          </h5>
                        </div>
                        <div className="col-sm-9 col-7">
                          <span>{data.details.height} cm</span>
                        </div>
                      </div>
                      <div className="row mb-2">
                        <div className="col-sm-3 col-5">
                          <h5 className="f-w-500">
                            Weight <span className="pull-right">:</span>
                          </h5>
                        </div>
                        <div className="col-sm-9 col-7">
                          <span>{data.details.weight} kg</span>
                        </div>
                      </div>
                      <div className="row mb-2">
                        <div className="col-sm-3 col-5">
                          <h5 className="f-w-500">
                            Allergic To <span className="pull-right">:</span>
                          </h5>
                        </div>
                        <div className="col-sm-9 col-7">
                          <span>{data.details.allergicTo}</span>
                        </div>
                      </div>
                      <div className="row mb-2">
                        <div className="col-sm-3 col-5">
                          <h5 className="f-w-500">
                            Previous Medication <span className="pull-right">:</span>
                          </h5>
                        </div>
                        <div className="col-sm-9 col-7">
                          <span>{data.details.previousMedications}</span>
                        </div>
                      </div>
                      <div className="row mb-2">
                        <div className="col-sm-3 col-5">
                          <h5 className="f-w-500">
                            Medical Conditions <span className="pull-right">:</span>
                          </h5>
                        </div>
                        <div className="col-sm-9 col-7">
                          <span>{data.details.medicalHistory}</span>
                        </div>
                      </div>
                    </div>
                  ) : null}
                </div>
              </div>
            </div>
            <div className="col-sm-6 0">
              <div class="col-xl-12 col-xxl-12 col-lg-12">
                <div class="card">
                  <div class="card-header border-0 pb-0">
                    <h4 class="card-title">Medical History</h4>
                  </div>
                  <div class="card-body">
                    {data && data.history.length>0 ? <div id="DZ_W_TimeLine" class="widget-timeline dz-scroll height370" style={{ overflowY: "auto" }}>
                      <ul class="timeline">
                        {loadMedicalHistory()}
                      </ul>
                    </div> : <h5>No details found</h5>}
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

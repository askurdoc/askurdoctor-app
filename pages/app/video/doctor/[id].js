import React, { useEffect, useState, useContext } from 'react';
import { useRouter } from 'next/router';
import Notiflix from 'notiflix';
import { useForm } from 'react-hook-form';
import { EditorState } from 'draft-js';
import { convertToHTML } from 'draft-convert';
import styles from './NoteEditor.module.scss';
import _ from 'lodash';
import dynamic from 'next/dynamic';
import DropdownSearch from '../../../../components/DropdownSearch';
import PrescriptionForm from '../../../../components/PrescriptionForm';

const DailyChat = dynamic(() => import('../../../../components/DailyChat'), {
  ssr: false,
});

const Editor = dynamic(
  () => import('react-draft-wysiwyg').then((mod) => mod.Editor),
  { ssr: false },
);

import Link from 'next/link';
import SideMenuLayout from '../../../../layouts/SideMenuLayout';
import { updateNotes } from '../../../../services/notes.service';
import {
  getAppointmentById,
  appointmentComplete,
  extendAppointment,
  followUpAppointment,
  appointmentNotShownUP,
} from '../../../../services/appointment.service';
import { createRx, getRXBYAPPT } from '../../../../services/rx.service';
import { createToken } from '../../../../services/videoCall.service';
import { processDateTime } from '../../../../helpers/utils';

export default function video(props) {
  const [isLoading, setIsLoading] = useState(false);
  const [appointment, setAppointment] = useState({});
  const [previousHistory, setPreviousHistory] = useState({});
  const router = useRouter();
  const [editorState, setEditorState] = useState(EditorState.createEmpty());
  const { id, token, userId, room } = router.query;
  const [rx, setRx] = useState([]);
  const [notes, setNotes] = useState('');
  const [updatedTime, setUpdatedTime] = useState('');
  const [addMeds, setAddMeds] = useState('DONE');
  const [isJoined, setIsJoined] = useState(false);
  const [tempObj, setTemp] = useState({});

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const init = async () => {
    setIsLoading(true);
    Notiflix.Loading.pulse('Loading...');
    console.log('Loading...');
    try {
      const response = await getAppointmentById(id);
      Notiflix.Loading.remove();
      setIsLoading(false);
      if (response.data && response.data.data) {
        setAppointment(response.data.data);
      } else {
        Notiflix.Notify.warning(
          response.data.error || 'No appointment detail available',
        );
      }
    } catch (e) {
      setIsLoading(false);
      Notiflix.Loading.remove();
      Notiflix.Notify.failure(e.response.data.message);
    }
  };

  const getPreviousHistory = async (previousId) => {
    setIsLoading(true);
    Notiflix.Loading.pulse('Loading...');
    console.log('Loading...');
    try {
      const response = await getRXBYAPPT(previousId);
      Notiflix.Loading.remove();
      setIsLoading(false);
      if (
        response.data &&
        response.data.data &&
        response.data.data.length > 0
      ) {
        setPreviousHistory(response.data.data[0]);
      } else {
        Notiflix.Notify.warning(
          response.data.error || 'No previous prescription detail available',
        );
      }
    } catch (e) {
      setIsLoading(false);
      Notiflix.Loading.remove();
      Notiflix.Notify.failure(e.response.data.message);
    }
  };
  const onEditorStateChange = (editorState) => {
    setEditorState(editorState);
    const html = convertToHTML(editorState.getCurrentContent());
    setNotes(html);
  };

  const addMedicine = (meds) => {
    console.log('added');
    setAddMeds('INIT');
    const obj = {
      drugId: meds.drugId,
      name: meds.name,
      form: meds.form,
    };
    setTemp(obj);
  };

  const completeAdd = (data) => {
    console.log(data);
    rx.push(data);
    setRx(rx);
    setUpdatedTime(new Date());
    setAddMeds('DONE');
  };

  const deleteDrug = (i) => {
    rx.splice(i, 1);
    setRx(rx);
    setUpdatedTime(new Date());
  };

  const onSubmit = async (data) => {
    setIsLoading(true);

    const html = convertToHTML(editorState.getCurrentContent());
    setNotes(html);
    const obj = {};
    obj.notes = html;
    obj.appointmentId = appointment.appointmentId;
    obj.patientId = appointment.patientId;
    obj.userId = appointment.userId;
    obj.doctorId = appointment.doctorId;
    obj.drugs = rx;
    console.log(obj);

    if (rx.length == 0) {
      Notiflix.Confirm.show(
        'Submit Prescription',
        'There is no prescribed drugs do you want to proceed?',
        'Yes',
        'No',
        () => {
          submission(obj);
        },
        () => {
          return false;
        },
      );
    } else {
      submission(obj);
    }
  };

  const submission = async (obj) => {
    Notiflix.Loading.pulse('Loading...');
    try {
      const response = await createRx(obj);
      Notiflix.Loading.remove();
      setIsLoading(false);
      if (response.data && response.data.msg) {
        Notiflix.Notify.success(response.data.msg);
      } else {
        Notiflix.Notify.warning(
          response.data.error || 'Failed to Create Prescription Record',
        );
      }
    } catch (e) {
      setIsLoading(false);
      Notiflix.Loading.remove();
      Notiflix.Notify.failure(e.response.data.message);
    }
  };

  const followUp = () => {
    Notiflix.Confirm.show(
      'Appointment Follow Up',
      'Do you want to follow up on this appointment?',
      'Yes',
      'No',
      function () {
        followUpAppt();
      },
      function () {
        return false;
      },
    );
  };
  const completeConfirm = () => {
    Notiflix.Confirm.show(
      'Appointment Completion',
      'Do you want to close the appointment?',
      'Yes',
      'No',
      function () {
        completeAppointment();
      },
      function () {
        return false;
      },
    );
  };

  const didnotShowUp = () => {
    Notiflix.Confirm.show(
      'Patient didnt show up',
      'Do you want to close the appointment?',
      'Yes',
      'No',
      function () {
        notshownUPCall();
      },
      function () {
        return false;
      },
    );
  };
  

  const extendMeeting = () => {
    Notiflix.Confirm.show(
      'Extend this Appointment',
      'Do you want to extend the appointment?',
      'Yes',
      'No',
      function () {
        extentThis();
      },
      function () {
        return false;
      },
    );
  };

  const notshownUPCall = async () => {
    try {
      const response = await appointmentNotShownUP(appointment.appointmentId);
      Notiflix.Loading.remove();
      setIsLoading(false);
      if (response.data && response.data.msg) {
        Notiflix.Notify.success(response.data.msg);
        const path = `/home/doctors`;
        router.push({
          pathname: path,
        });
      } else {
        Notiflix.Notify.warning(response.data.error || 'Failed to Complete');
      }
    } catch (e) {
      setIsLoading(false);
      Notiflix.Loading.remove();
      Notiflix.Notify.failure(e.response.data.message);
    }
  };


  const extentThis = async () => {
    try {
      const response = await extendAppointment(appointment.appointmentId, {
        mins: 5,
      });
      Notiflix.Loading.remove();
      setIsLoading(false);
      if (response.data && response.data.msg) {
        Notiflix.Notify.success(response.data.msg);
      } else {
        Notiflix.Notify.warning(response.data.error || 'Failed to Complete');
      }
    } catch (e) {
      setIsLoading(false);
      Notiflix.Loading.remove();
      Notiflix.Notify.failure(e.response.data.message);
    }
  };

  const completeAppointment = async () => {
    try {
      const response = await appointmentComplete(appointment.appointmentId);
      Notiflix.Loading.remove();
      setIsLoading(false);
      if (response.data && response.data.msg) {
        Notiflix.Notify.success(response.data.msg);
        const path = `/home/doctors`;
        router.push({
          pathname: path,
        });
      } else {
        Notiflix.Notify.warning(response.data.error || 'Failed to Complete');
      }
    } catch (e) {
      setIsLoading(false);
      Notiflix.Loading.remove();
      Notiflix.Notify.failure(e.response.data.message);
    }
  };

  const followUpAppt = async () => {
    try {
      const response = await followUpAppointment(appointment.appointmentId);
      Notiflix.Loading.remove();
      setIsLoading(false);
      if (response.data && response.data.msg) {
        Notiflix.Notify.success(response.data.msg);
        const path = `/home/doctors`;
        router.push({
          pathname: path,
        });
      } else {
        Notiflix.Notify.warning(response.data.error || 'Failed to Complete');
      }
    } catch (e) {
      setIsLoading(false);
      Notiflix.Loading.remove();
      Notiflix.Notify.failure(e.response.data.message);
    }
  };
  const joining = () => {
    setIsJoined(true);
    if (appointment.status == 'FOLLOW_UP') {
      getPreviousHistory(appointment.previousAppointmentId);
    }
  };

  const loadPrescription = () => {
    return rx.map((item, i) => {
      console.log(item);
      return (
        <tr>
          <td>
            <strong>{i + 1}</strong>
          </td>
          <td>{item.name}</td>
          <td>
            {item.times} {item.phase.join(', ')}
          </td>
          <td>{item.meal}</td>
          <td>
            <span className="badge light badge-success">{item.quantity}</span>
          </td>
          <td>{item.totalValue}</td>
          <td>
            <div className="dropdown">
              <button
                type="button"
                className="btn btn-danger light sharp"
                data-toggle="dropdown"
                onClick={(e) => {
                  deleteDrug(i);
                }}
              >
                {' '}
                Delete
              </button>
            </div>
          </td>
        </tr>
      );
    });
  };

  useEffect(() => {
    console.log('hi');
    console.log(token);
    init();
  }, [props]);

  return (
    <SideMenuLayout title="Doctor Consultation">
      <div className="content-body">
        <div className="container-fluid">
          <div className="row">
            <div className="col-xl-12">
              {!isJoined ? (
                <div className="col-12">
                  <DailyChat
                    id={id}
                    token={token}
                    userId={userId}
                    room={room}
                    callBack={joining}
                    type="doctor"
                  />
                </div>
              ) : (
                <>
                  <div className="form-head d-flex mb-3  mb-lg-5   align-items-start">
                    {' '}
                    {appointment.status &&
                      appointment.status != 'FOLLOW_UP' ? (
                      <>
                        <a
                          className="btn btn-warning text-white"
                          onClick={extendMeeting}
                        >
                          Extend 5 more mins
                        </a>
                        <a
                          className="btn btn-success text-white ml-2"
                          onClick={followUp}
                        >
                          Request Follow Up
                        </a>
                      </>
                    ) : null}
                    <a
                      className="btn btn-danger text-white ml-2"
                      onClick={completeConfirm}
                    >
                      Complete Appointment
                    </a>
                    <a
                      className="btn btn-danger text-white ml-2"
                      onClick={didnotShowUp}
                    >
                     Patient didn't show up
                    </a>
                  </div>

                  <div className="row">
                    <div className="col-lg-5 card">
                      <div className="card-body">
                        <div className="col-lg-12 mt-2 mb-2 px-0">
                          <div className="field">
                            <h4>Consulation notes*</h4>
                            <Editor
                              editorState={editorState}
                              toolbarClassName="toolbarClassName"
                              wrapperClassName="wrapperClassName"
                              editorClassName={styles.editor}
                              onEditorStateChange={onEditorStateChange}
                            />
                          </div>
                        </div>
                        <div className="col-lg-12 mt-2 mb-2 px-0">
                          <DropdownSearch callBack={addMedicine} />
                        </div>
                        <div className="row">
                          <div className="col-lg-6 mt-2 mb-2">
                            <button
                              type="button"
                              className="btn btn-success btn-sm"
                              onClick={handleSubmit(onSubmit)}
                            >
                              Submit Prescription
                              <span className="btn-icon-right">
                                <i className="fa fa-check"></i>
                              </span>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="col-lg-7 p-4">
                      {addMeds == 'INIT' ? (
                        <div className="row">
                          <div className="col-lg-12 mx-4">
                            <PrescriptionForm
                              drug={tempObj}
                              callBack={completeAdd}
                            />
                          </div>
                        </div>
                      ) : (
                        <div className="row">
                          {previousHistory.rxId ? (
                            <div className="col-lg-12 mt-2 mb-2">
                              <div
                                className="post-title"
                              >
                                <h3 className="text-black">
                                  Previous consultation Notes
                                </h3>
                              </div>
                              <div
                                className="card-body"
                                dangerouslySetInnerHTML={{
                                  __html: previousHistory.notes,
                                }}
                              ></div>
                            </div>
                          ) : null}
                          <div className="col-lg-12 mt-2 mb-2">
                            <div
                              className="post-title"
                            >
                              <h3 className="text-black">Doctor Notes</h3>
                            </div>
                            <div
                              className="notes"
                              dangerouslySetInnerHTML={{
                                __html: notes,
                              }}
                            ></div>
                          </div>
                          <div className="col-lg-12 mt-2 mb-2">
                            <div
                              className="post-title"
                            >
                              <h3 className="text-black">Prescribed drugs</h3>
                            </div>
                            <div className="drugs">
                              <table className="table table-responsive-md">
                                <thead>
                                  <tr>
                                    <th style={{ width: '80px' }}>
                                      <strong>#</strong>
                                    </th>
                                    <th>
                                      <strong>Drugs</strong>
                                    </th>
                                    <th>
                                      <strong>No of Times</strong>
                                    </th>
                                    <th>
                                      <strong>Before/After Meal</strong>
                                    </th>
                                    <th>
                                      <strong>Dosage</strong>
                                    </th>
                                    <th>
                                      <strong>Total Quantity</strong>
                                    </th>
                                    <th></th>
                                  </tr>
                                </thead>
                                <tbody>{loadPrescription()}</tbody>
                              </table>
                            </div>
                          </div>
                        </div>
                      )}{' '}
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </SideMenuLayout>
  );
}

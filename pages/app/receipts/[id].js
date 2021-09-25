import React, { useEffect, useState, useContext } from 'react';
import { useRouter } from 'next/router';

import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { getLedgerTransactionsById } from '../../../services/payment.service';
import SideMenuLayout from '../../../layouts/SideMenuLayout';
import Notiflix from 'notiflix';
import _ from 'lodash';
import { APP_CONFIG } from '../../../config/constants';
import { getDateString } from '../../../helpers/utils';

export default function AddPatients(props) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [receipt, setReceipt] = useState({});
  const { id } = router.query;

  const init = async () => {
    setIsLoading(true);
    Notiflix.Loading.pulse('Loading...');
    try {
      const response = await getLedgerTransactionsById(id);
      Notiflix.Loading.remove();
      setIsLoading(false);
      if (response.data && response.data.response) {
        setReceipt(response.data.response);
      } else {
        Notiflix.Notify.warning(response.data.error || 'No receipt detail available');
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
  }, [props.state]);

  return (
    <SideMenuLayout title="Payment Receipt">
      <div className="content-body">
        <div className="container-fluid">
          <div className="row">
            <div className="col-xl-12 col-xxl-12">
              {receipt && receipt.ledgerId ? (
                <div className="row">
                  <div className="col-md-12">
                    <div className="white-box">
                      <h3>
                        <b>INVOICE</b>{' '}
                        <span className="pull-right">{receipt.ledgerId}</span>
                      </h3>
                      <hr />
                      <div className="row">
                        <div className="col-md-12">
                          <div className="pull-left">
                            <address>
                              <h3 className="text-primary text-bold my-0">
                                {APP_CONFIG.name}
                              </h3>
                              <p className="text-muted py-0">
                                Online Doctor Consultation Platform
                              </p>
                              {receipt.patient.patientId ? (
                                <>
                                  <p className="font-bold my-0">
                                    <strong>Patient:</strong>
                                  </p>
                                  <h6 className="font-bold my-0 text-muted">
                                    {receipt.patient.firstName}{' '}
                                    {receipt.patient.lastName}
                                  </h6>
                                </>
                              ) : null}
                            </address>
                          </div>
                          <div className="pull-right text-right">
                            <address>
                              <p className="addr-font-h3 mb-0">
                                <strong>Doctor,</strong>
                              </p>
                              {receipt.doctor.userId ? (
                                <p className="font-bold addr-font-h4">
                                  Dr. {receipt.doctor.firstName}{' '}
                                  {receipt.doctor.lastName}
                                </p>
                              ) : null}
                              {receipt.doctor.address ? (
                                <p className="text-muted m-l-30">
                                  {receipt.doctor.address.street}., <br />
                                  {receipt.doctor.address.city}, <br />
                                  {receipt.doctor.address.state}.
                                </p>
                              ) : null}
                              <p className="m-t-30">
                                <b>Invoice Date :</b>
                                <i className="fa fa-calendar"></i>{' '}
                                {getDateString(receipt.createdAt)}
                              </p>
                            </address>
                          </div>
                        </div>
                        <div
                          className="col-md-12 py-6"
                          style={{ marginTop: '50px' }}
                        >
                          <div className="table-responsive m-t-40">
                            <table className="table table-hover">
                              <thead>
                                <tr>
                                  <th className="text-center">#</th>
                                  <th>Item Name</th>
                                  <th className="text-right">Quantity</th>
                                  <th className="text-right">Unit Cost</th>
                                  <th className="text-right">Charges</th>
                                  <th className="text-right">Total</th>
                                </tr>
                              </thead>
                              <tbody>
                                <tr>
                                  <td className="text-center">1</td>
                                  <td>Visiting Charges</td>
                                  <td className="text-right">-</td>
                                  <td className="text-right">-</td>
                                  <td className="text-right">
                                    {receipt.currency.displayAs}{' '}
                                    {receipt.amount / 100}
                                  </td>

                                  <td className="text-right">
                                    {receipt.currency.displayAs}{' '}
                                    {receipt.amount / 100}
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                        </div>
                        <div
                          className="col-md-12"
                          style={{ marginTop: '25px' }}
                        >
                          <div className="pull-right m-t-30 text-right">
                            <p>
                              Sub - Total amount: {receipt.currency.displayAs}{' '}
                              {receipt.amount / 100}
                            </p>
                            <p>
                                Service Charge : {receipt.currency.displayAs}{' '}
                                {receipt.serviceFee / 100 +
                                  receipt.applicationFee / 100}
                              </p>
                            {/* {receipt.serviceFee && receipt.applicationFee ? (
                              <p>
                                Service Charge : {receipt.currency.displayAs}{' '}
                                {receipt.serviceFee / 100 +
                                  receipt.applicationFee / 100}
                              </p>
                            ) : null} */}
                            <hr />
                            <h3>
                            <p>
                                  Total: {receipt.currency.displayAs}{' '}
                                  {receipt.amount / 100 +
                                    receipt.serviceFee / 100 +
                                    receipt.applicationFee / 100}
                                </p>
                              {/* {receipt.serviceFee && receipt.applicationFee ? (
                                <p>
                                  Total: {receipt.currency.displayAs}{' '}
                                  {receipt.amount / 100 +
                                    receipt.serviceFee / 100 +
                                    receipt.applicationFee / 100}
                                </p>
                              ) : (
                                <p>
                                  Total: {receipt.currency.displayAs}{' '}
                                  {receipt.amount / 100}
                                </p>
                              )} */}
                            </h3>
                          </div>
                          <div className="clearfix"></div>
                          <hr />
                          <div className="text-right">
                            <button
                              onClick={(e) => {
                                window.print();
                              }}
                              className="btn btn-default btn-outline no-printme"
                              type="button"
                            >
                              <span>
                                <i className="fa fa-print"></i> Print
                              </span>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </SideMenuLayout>
  );
}

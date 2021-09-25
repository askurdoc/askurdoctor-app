import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import _ from 'lodash';
import { useForm } from 'react-hook-form';
import { APP_URL } from '../../config/constants';

import Notiflix from 'notiflix';
import { getMyWallet } from '../../services/wallet.service';
import { getGCoins } from '../../services/config.service';
import { createPaymentSession } from '../../services/payment.service';
import ModalBox from './ModalBox';

import { loadStripe } from '@stripe/stripe-js';
import {
  CardElement,
  Elements,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js';
import { formatCurrency } from '../../helpers/utils';

const stripePromise = loadStripe('pk_test_HDNE05871vQtoTzjbv7O3qts');

export default function Wallet({ userDetail }) {
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setType] = useState(null);
  const [platform, setPlatform] = useState({});
  const [user, setUser] = useState(null);
  const [gCoinStore, setCoins] = useState([]);
  const [wallet, setWallet] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const color = 'gray';

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const cancel = () => {
    setShowModal(false);
    setType(null);
  };

  const payment = async (value, type) => {
    setShowModal(false);
    setType(null);
    console.log(value);
    const stripe = await stripePromise;
    let payload;
    if (type === 'COIN') {
      payload = {
        currencyCode: 'USD',
        clientReferenceId: user.userId,
        amount: value.amount * 100,
        successUrl: `${APP_URL()}/app/wallet?success=true`,
        cancelUrl: `${APP_URL()}/app/wallet`,
        type: 'GCOIN',
        metadata: {
          type: 'GCOIN',
        },
        email: user.email,
        meta: value,
      };
    } else {
      payload = {
        currencyCode: 'USD',
        clientReferenceId: user.userId,
        amount: parseInt(value.amount) * 100,
        successUrl: `${APP_URL()}/app/wallet?success=true`,
        cancelUrl: `${APP_URL()}/app/wallet`,
        type: 'FUNDS',
        metadata: {
          type: 'FUNDS',
        },
        email: user.email,
        meta: value,
      };
    }

    createPaymentSession(payload)
      .then((response) => {
        if (response.data.id) {
          stripe.redirectToCheckout({
            sessionId: response.data.id,
          });
        }
      })
      .catch((e) => {
        console.log(e);
        Notiflix.Notify.failure(e.response.data.message);
      });
  };

  const getGCoinData = async () => {
    setIsLoading(true);
    try {
      const response = await getGCoins();
      console.log(response.data.gCredits);
      if (response.data && response.data.gCredits.length > 0) {
        setCoins(response.data.gCredits);
      }
    } catch (e) {
      console.log('ERROR');
      console.log(e);
      Notiflix.Notify.failure(e.response.data.message);
    } finally {
      setIsLoading(false);
    }
  };
  const getWalletData = async () => {
    setIsLoading(true);
    try {
      const response = await getMyWallet();
      if (response.data && response.data.walletId) {
        // Notiflix.Notify.success('Done');
        console.log(response.data);
        setWallet(response.data);
      }
    } catch (e) {
      console.log('ERROR');
      console.log(e);
      Notiflix.Notify.failure(e.response.data.message);
    } finally {
      setIsLoading(false);
    }
  };

  function checkRole(role) {
    return user.role.indexOf(role);
  }

  useEffect(() => {
    setIsLoading(true);
    getGCoinData();
    getWalletData();
    setUser(userDetail);
    console.log(userDetail);
    setIsLoading(false);
  }, [userDetail]);

  return (
    <>
      {showModal ? (
        <ModalBox
          coinsStore={gCoinStore}
          type={modalType}
          cancel={cancel}
          payment={payment}
        />
      ) : (
        <></>
      )}
      <div className="grid grid-cols-4  gap-4 mx-auto">
        {!isLoading ? (
          user.role && checkRole('BRAND_MANAGERS') == -1 ? (
            <div className="col-start-1 col-span-2 py-3">
              <div className="bg-white shadow-lg border-gray-100 max-h-80	 border sm:rounded-3xl p-8  flex space-x-8">
                <div className="flex flex-col w-7/12 space-y-4">
                  <div className="flex justify-between items-start">
                    {wallet ? (
                      <h2 className="text-3xl font-bold">{wallet.gCoins}</h2>
                    ) : (
                      <>Not Available</>
                    )}
                  </div>
                  <div className="text-lg text-green-600 text-a">GCoin</div>
                </div>
                <div className="overflow-hidden w-5/12">
                  <button
                    className="mt-6 bg-gray-800 active:bg-gray-700 uppercase text-white font-bold hover:shadow-md shadow text-xs px-4 py-2 rounded outline-none focus:outline-none sm:mr-2 mb-1 ease-linear transition-all duration-150"
                    type="button"
                    onClick={() => {
                      setType('COIN');
                      setShowModal(true);
                    }}
                  >
                    Purchase
                  </button>
                </div>
              </div>
            </div>
          ) : null
        ) : null}

        <div className=" col-span-2 py-3">
          <div className="bg-white shadow-lg border-gray-100 max-h-80	 border sm:rounded-3xl p-8  flex space-x-8">
            <div className="flex flex-col w-7/12 space-y-4">
              <div className="flex justify-between items-start">
                {wallet ? (
                  <h2 className="text-3xl font-bold">
                    ${formatCurrency(wallet.availableFunds)}
                  </h2>
                ) : (
                  <></>
                )}
              </div>
              <div className="text-lg text-pink-600 text-a">
                Available Funds
              </div>
            </div>
            <div className="overflow-hidden w-5/12">
              {!isLoading ? (
                user.role && checkRole('BRAND_MANAGERS') > -1 ? (
                  <button
                    className="mt-6 bg-gray-800 active:bg-gray-700 uppercase text-white font-bold hover:shadow-md shadow text-xs px-4 py-2 rounded outline-none focus:outline-none sm:mr-2 mb-1 ease-linear transition-all duration-150"
                    type="button"
                    onClick={() => {
                      setType('FUND');
                      setShowModal(true);
                    }}
                  >
                    Add Fund
                  </button>
                ) : (
                  <button
                    className="mt-6 bg-gray-800 active:bg-gray-700 uppercase text-white font-bold hover:shadow-md shadow text-xs px-4 py-2 rounded outline-none focus:outline-none sm:mr-2 mb-1 ease-linear transition-all duration-150"
                    type="button"
                    style={{ display: 'none' }}
                    onClick={() => {
                      setType('FUND');
                      setShowModal(true);
                    }}
                  >
                    Withdraw Fund
                  </button>
                )
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

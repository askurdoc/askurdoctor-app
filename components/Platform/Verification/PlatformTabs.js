import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import _ from 'lodash';
import { useForm } from 'react-hook-form';

import Notiflix from 'notiflix';
import {
  enrollPlatform,
  getMyPlatformReqs,
  submissions,
} from '../../../services/platform.service';

String.prototype.toProperCase = function () {
  return this.replace(/\w\S*/g, function (txt) {
    return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
  });
};

export default function PlatformTabsPlatformTabs() {
  const [openTab, setOpenTab] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [platform, setPlatform] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const color = 'gray';

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const getPlatfromData = async () => {
    setIsLoading(true);
    try {
      const response = await getMyPlatformReqs();
      if (response.data && response.data.length > 0) {
        // Notiflix.Notify.success('Done');
        const key = _.groupBy(response.data, 'platform');
        console.log(key);
        setPlatform(key);
      }
    } catch (e) {
      console.log('ERROR');
      console.log(e);
      Notiflix.Notify.failure(e.response.data.message);
    } finally {
      setIsLoading(false);
    }
  };

  const initialize = async (type) => {
    Notiflix.Loading.pulse('Fetching Data...');
    setIsLoading(true);
    try {
      const response = await enrollPlatform({ platform: type });
      if (response.data && response.data.influencerVerifyId) {
        getPlatfromData();
      }
    } catch (e) {
      console.log('ERROR');
      console.log(e);
      Notiflix.Notify.failure(e.response.data.message);
    } finally {
      setIsLoading(false);
      Notiflix.Loading.remove();
    }
  };

  const onSubmit = (data) => {
    console.log(data);
    setIsSubmitting(true);
    Notiflix.Loading.pulse('Updating...');
    setIsLoading(true);
    submissions(data)
      .then((response) => {
        if (response.status && response.status == 200) {
          getPlatfromData();
        }
      })
      .catch((e) => {
        console.log('ERROR');
        console.log(e);
        Notiflix.Notify.failure(e.response.data.message);
      })
      .finally(() => {
        setIsLoading(false);
        setIsSubmitting(false);
        Notiflix.Loading.remove();
      });
  };

  useEffect(() => {
    getPlatfromData();
  }, []);

  const loadContent = (type) => {
    const moderatedList = ['APPROVED', 'REJECTED'];
    const pendingList = ['PENDING', 'REQUEST_CHANGE'];
    const processingList = ['SUBMITTED', 'ASSIGNED', 'UPDATED'];
    let data;

    if (platform[type]) {
      const list = platform[type];
      if (list.length > 1) {
        const filtered = _.filter(list, (o) => o.status !== 'REJECTED');
        data = filtered[0];
      } else {
        data = list[0];
      }
    }
    if (data && data.status) {
      if (moderatedList.indexOf(data.status) > -1) {
        let tag, description;
        const status = data.status;
        if (status == 'APPROVED') {
          tag = 'Congrats!!!';
          description = `You have successfully verified you ${type.toProperCase()} account, Your are good to go`;
        } else {
          tag = 'Sorry, Your submission got rejected. ';
          description = `Reason: ${data.feedback}`;
        }
        return (
          <>
            <div className="flex flex-wrap mt-4 justify-center">
              <div className="lg:4/6 xl:w-3/4 mt-20 lg:mt-10  text-left">
                <div className="text-5xl font-semibold text-gray-900 leading-none">
                  {tag}
                </div>
                <div className="mt-6 text-xl font-light text-true-gray-500 antialiased">
                  {description}
                </div>
                {status == 'APPROVED' ? (
                  <button
                    className="mt-6 bg-gray-800 active:bg-gray-700 uppercase text-white font-bold hover:shadow-md shadow text-xs px-4 py-2 rounded outline-none focus:outline-none sm:mr-2 mb-1 ease-linear transition-all duration-150"
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      router.push()
                    }}
                  >
                    Browse Campaign
                  </button>
                ) : (
                  <button
                    className="mt-6 bg-gray-800 active:bg-gray-700 uppercase text-white font-bold hover:shadow-md shadow text-xs px-4 py-2 rounded outline-none focus:outline-none sm:mr-2 mb-1 ease-linear transition-all duration-150"
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      initialize(type);
                    }}
                  >
                    Retry
                  </button>
                )}
              </div>
            </div>
          </>
        );
      } else if (pendingList.indexOf(data.status) > -1) {
        return (
          <>
            <div className="flex flex-wrap mt-3 justify-center">
              <div className="lg:4/6 xl:w-3/4  lg:mt-10  text-left">
                <div className="mb-12 text-3xl font-light text-true-gray-500 antialiased">
                  Create and share a content in your {type.toProperCase()}{' '}
                  account with details <br />
                  and submit the URL for verification.
                </div>
                <div className="mt-6 text-2xl font-light text-gray-600 text-true-gray-500 antialiased">
                  Share this content
                </div>
                <div className=" bg-gray-100 p-8 shadow-lg rounded-lg">
                  <div className=" text-6xl font-semibold text-gray-900 leading-none">
                    {data.promotionalText.appName}
                  </div>
                  <div className=" text-xl font-light text-true-gray-500 antialiased">
                    {data.promotionalText.subText}
                  </div>
                </div>
                {data.status == 'REQUEST_CHANGE' ? (
                  <>
                    <hr className="mt-12 border-b-1 border-gray-400" />
                    <div className=" bg-gray-100 p-8 mt-12 shadow-lg rounded-lg">
                      <div className="text-5xl font-semibold text-gray-900 leading-none">
                        Change Required
                      </div>
                      <div className="mt-6 text-xl font-light text-true-gray-500 antialiased">
                        Reason: {data.feedback}
                      </div>
                    </div>
                  </>
                ) : (
                  <></>
                )}

                <hr className="mt-12 border-b-1 border-gray-400" />
                <div className="mt-12 text-xl font-light text-true-gray-500 antialiased">
                  please provide your {type.toProperCase()} details with the
                  post url having above promotional content
                </div>
                <form onSubmit={handleSubmit(onSubmit)} className="mt-12">
                  <div className="relative w-full mb-3">
                    <input
                      type="hidden"
                      value={data.influencerVerifyId}
                      className="px-3 py-3 placeholder-gray-400 text-gray-700 bg-white rounded text-sm shadow focus:outline-none focus:shadow-outline w-full ease-linear transition-all duration-150"
                      placeholder="Content URL"
                      {...register('influencerVerifyId', {
                        required: true,
                      })}
                    />
                  </div>
                  <div className="relative w-full mb-3">
                    <label className="block uppercase text-gray-700 text-xs font-bold mb-2">
                      promotional Content URL
                    </label>
                    <input
                      type="text"
                      className="px-3 py-3 placeholder-gray-400 text-gray-700 bg-white rounded text-sm shadow focus:outline-none focus:shadow-outline w-full ease-linear transition-all duration-150"
                      placeholder="Content URL"
                      {...register('contentUrl', {
                        required: true,
                        pattern: /^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/,
                      })}
                    />
                  </div>
                  <div className="mt-12 relative w-full mb-3">
                    <label className="block uppercase text-gray-700 text-xs font-bold mb-2">
                      {type == 'INSTAGRAM'
                        ? 'Instagram handle'
                        : type == 'YOUTUBE'
                        ? 'Channel Name'
                        : type == 'TIKTOK'
                        ? 'Tiktok Handle'
                        : ''}
                    </label>
                    <input
                      type="text"
                      className="px-3 py-3 placeholder-gray-400 text-gray-700 bg-white rounded text-sm shadow focus:outline-none focus:shadow-outline w-full ease-linear transition-all duration-150"
                      placeholder={
                        type == 'INSTAGRAM'
                          ? 'Instagram handle'
                          : type == 'YOUTUBE'
                          ? 'Channel Name'
                          : type == 'TIKTOK'
                          ? 'Tiktok Handle'
                          : ''
                      }
                      {...register('channelId', { required: true })}
                    />
                  </div>

                  <div className="relative w-full mb-4">
                    <label className="block uppercase text-gray-700 text-xs font-bold mb-2">
                      {type == 'INSTAGRAM'
                        ? 'Instagram Url'
                        : type == 'YOUTUBE'
                        ? 'Channel Url'
                        : type == 'TIKTOK'
                        ? 'Tiktok Url'
                        : ''}
                    </label>
                    <input
                      type="text"
                      className="px-3 py-3 placeholder-gray-400 text-gray-700 bg-white rounded text-sm shadow focus:outline-none focus:shadow-outline w-full ease-linear transition-all duration-150"
                      placeholder={
                        type == 'INSTAGRAM'
                          ? 'Instagram Url'
                          : type == 'YOUTUBE'
                          ? 'Channel Url'
                          : type == 'TIKTOK'
                          ? 'Tiktok Url'
                          : ''
                      }
                      {...register('channelUrl', {
                        required: true,
                        pattern: /^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/,
                      })}
                    />
                  </div>
                  <div className="relative w-full mb-4">
                    <label className="block uppercase text-gray-700 text-xs font-bold mb-2">
                      How do you want to describe yourself as an influencer?
                    </label>
                    <textarea
                      type="text"
                      className="my-4 px-3 py-3 placeholder-gray-400 text-gray-700 bg-white rounded text-sm shadow focus:outline-none focus:shadow-outline w-full ease-linear transition-all duration-150"
                      placeholder="About yourself (minimum 250 characters)"
                      {...register('bioDetail', {
                        required: true,
                        minLength: 250,
                      })}
                    ></textarea>
                  </div>
                  <div className="relative w-full mb-4">
                    <label className="block uppercase text-gray-700 text-xs font-bold mb-2">
                      Followers / Subscribers
                    </label>
                    <input
                      type="number"
                      className="px-3 py-3 placeholder-gray-400 text-gray-700 bg-white rounded text-sm shadow focus:outline-none focus:shadow-outline w-full ease-linear transition-all duration-150"
                      placeholder="Followers / Subscribers"
                      {...register('followers', { required: true })}
                    />
                  </div>

                  <div className="text-center mt-6">
                    <button
                      className="mt-6 bg-gray-800 active:bg-gray-700 uppercase text-white font-bold hover:shadow-md shadow text-xs px-4 py-2 rounded outline-none focus:outline-none sm:mr-2 mb-1 ease-linear transition-all duration-150"
                      type="submit"
                      // onClick={onSubmit}
                    >
                      {isSubmitting ? (
                        <>
                          <i className="animate-spin fas fa-lg fa-spinner"></i>
                          Submitting
                        </>
                      ) : (
                        'Submit'
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </>
        );
      } else if (processingList.indexOf(data.status) > -1) {
        return (
          <>
            <div className="flex flex-wrap mt-4 justify-center">
              <div className="lg:4/6 xl:w-3/4 mt-20 lg:mt-10  text-left">
                <div className="text-5xl font-semibold text-gray-900 leading-none">
                  In Review
                </div>
                <div className="mt-6 text-xl font-light text-true-gray-500 antialiased">
                  Review process will take 2 - 3 working days. <br />
                  P.s: Please do keep the promotional content until we complete
                  the review process.
                </div>

                {/* <button
                  className="mt-6 bg-gray-800 active:bg-gray-700 uppercase text-white font-bold hover:shadow-md shadow text-xs px-4 py-2 rounded outline-none focus:outline-none sm:mr-2 mb-1 ease-linear transition-all duration-150"
                  type="button"
                >
                  Connect
                </button> */}
              </div>
            </div>
          </>
        );
      } else {
        return (
          <>
            <div className="flex flex-wrap mt-4 justify-center">
              <div className="lg:4/6 xl:w-3/4 mt-20 lg:mt-40  text-left">
                <div className="text-6xl font-semibold text-gray-900 leading-none">
                  Monetize your {type.toProperCase()} skill
                </div>
                <div className="mt-6 text-xl font-light text-true-gray-500 antialiased">
                  Connect your {type.toProperCase()} with us to earn revenues.
                </div>

                <button
                  className="mt-6 bg-gray-800 active:bg-gray-700 uppercase text-white font-bold hover:shadow-md shadow text-xs px-4 py-2 rounded outline-none focus:outline-none sm:mr-2 mb-1 ease-linear transition-all duration-150"
                  type="button"
                >
                  Connect
                </button>
              </div>
            </div>
          </>
        );
      }
    } else {
      return (
        <>
          <div className="flex flex-wrap mt-4 justify-center">
            <div className="lg:4/6 xl:w-3/4 mt-20 lg:mt-40  text-left">
              <div className="text-6xl font-semibold text-gray-900 leading-none">
                Monetize your {type.toProperCase()} skill
              </div>
              <div className="mt-6 text-xl font-light text-true-gray-500 antialiased">
                Connect your {type.toProperCase()} with us to earn revenues.
              </div>

              <button
                className="mt-6 bg-gray-800 active:bg-gray-700 uppercase text-white font-bold hover:shadow-md shadow text-xs px-4 py-2 rounded outline-none focus:outline-none sm:mr-2 mb-1 ease-linear transition-all duration-150"
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  initialize(type);
                }}
              >
                Connect
              </button>
            </div>
          </div>
        </>
      );
    }
  };

  return (
    <>
      <div className="flex flex-wrap">
        <div className="w-full">
          <ul
            className="flex mb-0 list-none flex-wrap pt-3 pb-4 flex-row"
            role="tablist"
          >
            <li className="-mb-px mr-2 last:mr-0 flex-auto text-center">
              <a
                className={
                  'text-xs font-bold uppercase px-5 py-3 shadow-lg rounded block leading-normal ' +
                  (openTab === 1
                    ? 'text-white bg-' + color + '-800'
                    : 'text-' + color + '-600 bg-white')
                }
                onClick={(e) => {
                  e.preventDefault();
                  setOpenTab(1);
                }}
                data-toggle="tab"
                href="#link1"
                role="tablist"
              >
                Instagram
              </a>
            </li>
            <li className="-mb-px mr-2 last:mr-0 flex-auto text-center">
              <a
                className={
                  'text-xs font-bold uppercase px-5 py-3 shadow-lg rounded block leading-normal ' +
                  (openTab === 2
                    ? 'text-white bg-' + color + '-800'
                    : 'text-' + color + '-600 bg-white')
                }
                onClick={(e) => {
                  e.preventDefault();
                  setOpenTab(2);
                }}
                data-toggle="tab"
                href="#link2"
                role="tablist"
              >
                Youtube
              </a>
            </li>
            <li className="-mb-px mr-2 last:mr-0 flex-auto text-center">
              <a
                className={
                  'text-xs font-bold uppercase px-5 py-3 shadow-lg rounded block leading-normal ' +
                  (openTab === 3
                    ? 'text-white bg-' + color + '-800'
                    : 'text-' + color + '-600 bg-white')
                }
                onClick={(e) => {
                  e.preventDefault();
                  setOpenTab(3);
                }}
                data-toggle="tab"
                href="#link3"
                role="tablist"
              >
                TikTok
              </a>
            </li>
          </ul>
          <div className="relative flex flex-col min-w-0 break-words  w-full mb-6  rounded">
            <div className="px-4 py-5 flex-auto">
              <div className="tab-content tab-space">
                <div className={openTab === 1 ? 'block' : 'hidden'} id="link1">
                  {platform && !isLoading ? loadContent('INSTAGRAM') : <></>}
                </div>
                <div className={openTab === 2 ? 'block' : 'hidden'} id="link2">
                  {platform && !isLoading ? loadContent('YOUTUBE') : <></>}
                </div>
                <div className={openTab === 3 ? 'block' : 'hidden'} id="link3">
                  {platform && !isLoading ? loadContent('TIKTOK') : <></>}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

import React, { useEffect, useState, useContext } from 'react';
import AgoraRTC from 'agora-rtc-sdk';
import {
  ClientConfig,
  IAgoraRTCRemoteUser,
  ICameraVideoTrack,
  IMicrophoneAudioTrack,
} from "agora-rtc-sdk-ng";
import {
  AgoraVideoPlayer,
  createClient,
  createMicrophoneAndCameraTracks,
} from "../../assets/vendor/agora-rtc-react";

const appId = 'c57cff727e3544f6ba9260336a820003';
import useWindowDimensions from '../window';
import permission from '../../public/images/permission.jpg';

import './index.css';

export default function agoraVideo(props) {
  const [state, setState] = useState('INIT');
  const [rtc, setRTC] = useState({});
  const { height, width } = useWindowDimensions();
  const config = {
    mode: 'rtc',
    codec: 'vp8',
  };
  useEffect(() => {
    const rtc = {
      client: null,
      joined: false,
      published: false,
      localStream: null,
      remoteStreams: [],
      params: {},
    };
    setRTC(rtc);
  }, []);

  // Options for joining a channel
  var option = {
    appID: 'c57cff727e3544f6ba9260336a820003',
    channel: props.id,
    uid: props.userId,
    token: props.token,
    key: '',
    secret: '',
  };

  function joinChannel(role) {
    // Create a client
    rtc.client = AgoraRTC.createClient({ mode: 'live', codec: 'h264' });
    // Initialize the client
    rtc.client.init(
      option.appID,
      function () {
        console.log('init success');

        // Join a channel
        rtc.client.join(
          option.token ? option.token : null,
          option.channel,
          option.uid ? +option.uid : null,
          function (uid) {
            setState('STARTED');
            console.log(
              'join channel: ' + option.channel + ' success, uid: ' + uid,
            );
            rtc.params.uid = uid;
            if (role === 'host') {
              rtc.client.setClientRole('host');
              // Create a local stream
              rtc.localStream = AgoraRTC.createStream({
                streamID: rtc.params.uid,
                audio: true,
                video: true,
                screen: false,
              });

              // Initialize the local stream
              rtc.localStream.init(
                function () {
                  console.log('init local stream success');
                  rtc.localStream.play('local_stream');
                  rtc.client.publish(rtc.localStream, function (err) {
                    console.log('publish failed');
                    console.error(err);
                  });
                },
                function (err) {
                  console.error('init local stream failed ', err);
                },
              );

              rtc.client.on('connection-state-change', function (evt) {
                console.log('audience', evt);
              });
            }
            if (role === 'audience') {
              rtc.client.on('connection-state-change', function (evt) {
                console.log('audience', evt);
              });

              rtc.client.on('stream-added', function (evt) {
                var remoteStream = evt.stream;
                var id = remoteStream.getId();
                if (id !== rtc.params.uid) {
                  rtc.client.subscribe(remoteStream, function (err) {
                    console.log('stream subscribe failed', err);
                  });
                }
                console.log('stream-added remote-uid: ', id);
              });

              rtc.client.on('stream-removed', function (evt) {
                var remoteStream = evt.stream;
                var id = remoteStream.getId();
                console.log('stream-removed remote-uid: ', id);
              });

              rtc.client.on('stream-subscribed', function (evt) {
                var remoteStream = evt.stream;
                var id = remoteStream.getId();
                remoteStream.play('remote_video_');
                console.log('stream-subscribed remote-uid: ', id);
              });

              rtc.client.on('stream-unsubscribed', function (evt) {
                var remoteStream = evt.stream;
                var id = remoteStream.getId();
                remoteStream.pause('remote_video_');
                console.log('stream-unsubscribed remote-uid: ', id);
              });
            }
          },
          function (err) {
            console.error('client join failed', err);
          },
        );
      },
      (err) => {
        console.error(err);
      },
    );
  }

  function leaveEventHost(params) {
    setState('LEFT');
    rtc.client.unpublish(rtc.localStream, function (err) {
      console.log('publish failed');
      console.error(err);
    });
    rtc.client.leave(function (ev) {
      console.log(ev);
    });
  }

  function leaveEventAudience(params) {
    setState('LEFT');
    rtc.client.leave(
      function () {
        console.log('client leaves channel');
        //……
      },
      function (err) {
        console.log('client leave failed ', err);
        //error handling
      },
    );
  }

  return (
    <div className="col-xl-12">
      <div className="cam media-body">
        {props.type == 'doctor' ? (
          <div className="row">
            {state == 'INIT' ? (
              <div className="col-lg-12 text-center">
                <div className="row  mt-5">
                  <div className="col-lg-6">
                    <h5>Step 1: </h5>
                    <p>Please click join button to start the call</p>
                  </div>
                  <div className="col-lg-6">
                    <h5>Step 2: </h5>
                    <p>
                      Please enable the browser permission to acccess video and
                      microphone
                    </p>
                    <img
                      className="logo-abbr"
                      src={permission}
                      alt=""
                      width={300}
                    />
                  </div>
                </div>
                <div className="col-lg-12 p-5 mt-5">
                  <button
                    className="btn btn-rounded btn-success"
                    onClick={() => joinChannel('host')}
                  >
                    <span className="btn-icon-left text-success">
                      <i className="fa fa-camera color-success"></i>
                    </span>
                    Join
                  </button>
                </div>
              </div>
            ) : null}
            {state == 'STARTED' ? (
              <div className="col-lg-12" style={{minHeight:"600px"}}>
                <div className=" text-center col-lg-12 leaveArea">
                  <button
                    className="btn btn-rounded btn-danger"
                    onClick={() => leaveEventAudience('host')}
                  >
                    Leave
                  </button>
                </div>
                <div className="col-sm-12">
                  <div
                    id="remote_video_"
                    style={{ width: '100%', height: '400px' }}
                  />
                </div>
                <div
                  id="local_stream"
                  className="col-lg-12 local_stream"
                  style={{ width: '200px', height: '150px' }}
                ></div>

                {/* <div
                  id="local_stream"
                  className="local_stream"
                  className="col-lg-12 local_stream"
                  style={{ width: '200px', height: '150px' }}
                ></div>
                <div
                  id="remote_video_"
                  className="col-lg-12 remoteStream"
                  style={{ minWidth: '800px', height: '600px' }}
                /> */}
              </div>
            ) : null}
            {state == 'LEFT' ? (
              <div className="row">
                <div className=" text-center col-lg-12 leaveArea">
                  Thanks for the Session
                </div>
              </div>
            ) : null}
          </div>
        ) : (
          <div className="row">
            {state == 'INIT' ? (
              <div className="col-lg-12 text-center">
                <div className="row  mt-5">
                  <div className="col-lg-6">
                    <h5>Step 1: </h5>
                    <p>Please click join button to start the call</p>
                  </div>
                  <div className="col-lg-6">
                    <h5>Step 2: </h5>
                    <p>
                      Please enable the browser permission to acccess video and
                      microphone
                    </p>
                    <img
                      className="logo-abbr"
                      src={permission}
                      alt=""
                      width={300}
                    />
                  </div>
                </div>
                <div className="col-lg-12 p-5 mt-5">
                  <button
                    className="btn btn-rounded btn-success"
                    onClick={() => joinChannel('host')}
                  >
                    <span className="btn-icon-left text-success">
                      <i className="fa fa-camera color-success"></i>
                    </span>
                    Join Host
                  </button>
                </div>
              </div>
            ) : null}
            {state == 'STARTED' ? (
              <div className="col-lg-12" style={{minHeight:"600px"}}>
                <div className=" text-center col-lg-12 leaveArea">
                  <button
                    className="btn btn-rounded btn-danger"
                    onClick={() => leaveEventAudience('host')}
                  >
                    Leave
                  </button>
                </div>
                <div
                  id="local_stream"
                  className="col-lg-12 local_stream"
                  style={{ width: '200px', height: '150px' }}
                ></div>
                <div className="col-sm-12">
                  <div
                    id="remote_video_"
                    style={{ width: '100%', height: '400px' }}
                  />
                </div>
                {/* <div id="local_stream" className="col-lg-12 local_stream"></div> */}
                {/* <div id="remote_video_" className="col-lg-12 remote_video_" /> */}
              </div>
            ) : null}
            {state == 'LEFT' ? (
              <div className="row">
                <div className=" text-center col-lg-12 leaveArea">
                  Thanks for the Session
                </div>
              </div>
            ) : null}
          </div>
        )}

        {/* <div>
      width: {width} ~ height: {height}
    </div> */}
      </div>
    </div>
  );
}

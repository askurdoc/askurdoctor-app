import React, { useEffect, useState, useContext } from 'react';
import AgoraRTC from 'agora-rtc-sdk';
import {
  ClientConfig,
  IAgoraRTCRemoteUser,
  ICameraVideoTrack,
  IMicrophoneAudioTrack,
} from 'agora-rtc-sdk-ng';
import {
  AgoraVideoPlayer,
  createClient,
  createMicrophoneAndCameraTracks,
} from '../../assets/vendor/agora-rtc-react';

import useWindowDimensions from '../window';
import permission from '../../public/images/permission.jpg';

const config = {
  mode: 'rtc',
  codec: 'vp8',
};
const appId = ""; //ENTER APP ID HERE
const token = "";
const App = () => {
    const [inCall, setInCall] = useState(false);
    const [channelName, setChannelName] = useState("");
    return (React.createElement("div", null,
        React.createElement("h1", { className: "heading" }, "Agora RTC NG SDK React Wrapper"),
        inCall ? (React.createElement(VideoCall, { setInCall: setInCall, channelName: channelName })) : (React.createElement(ChannelForm, { setInCall: setInCall, setChannelName: setChannelName }))));
};
// the create methods in the wrapper return a hook
// the create method should be called outside the parent component
// this hook can be used the get the client/stream in any component
const useClient = createClient(config);
const useMicrophoneAndCameraTracks = createMicrophoneAndCameraTracks();
const VideoCall = (props) => {
    const { setInCall, channelName } = props;
    const [users, setUsers] = useState([]);
    const [start, setStart] = useState(false);
    // using the hook to get access to the client object
    const client = useClient();
    // ready is a state variable, which returns true when the local tracks are initialized, untill then tracks variable is null
    const { ready, tracks } = useMicrophoneAndCameraTracks();
    useEffect(() => {
        // function to initialise the SDK
        let init = async (name) => {
            client.on("user-published", async (user, mediaType) => {
                var _a;
                await client.subscribe(user, mediaType);
                console.log("subscribe success");
                if (mediaType === "video") {
                    setUsers((prevUsers) => {
                        return [...prevUsers, user];
                    });
                }
                if (mediaType === "audio") {
                    (_a = user.audioTrack) === null || _a === void 0 ? void 0 : _a.play();
                }
            });
            client.on("user-unpublished", (user, type) => {
                var _a;
                console.log("unpublished", user, type);
                if (type === "audio") {
                    (_a = user.audioTrack) === null || _a === void 0 ? void 0 : _a.stop();
                }
                if (type === "video") {
                    setUsers((prevUsers) => {
                        return prevUsers.filter((User) => User.uid !== user.uid);
                    });
                }
            });
            client.on("user-left", (user) => {
                console.log("leaving", user);
                setUsers((prevUsers) => {
                    return prevUsers.filter((User) => User.uid !== user.uid);
                });
            });
            await client.join(appId, name, token, null);
            if (tracks)
                await client.publish([tracks[0], tracks[1]]);
            setStart(true);
        };
        if (ready && tracks) {
            console.log("init ready");
            init(channelName);
        }
    }, [channelName, client, ready, tracks]);
    return (React.createElement("div", { className: "App" },
        ready && tracks && (React.createElement(Controls, { tracks: tracks, setStart: setStart, setInCall: setInCall })),
        start && tracks && React.createElement(Videos, { users: users, tracks: tracks })));
};
const Videos = (props) => {
    const { users, tracks } = props;
    return (React.createElement("div", null,
        React.createElement("div", { id: "videos" },
            React.createElement(AgoraVideoPlayer, { style: { height: '95%', width: '95%' }, className: 'vid', videoTrack: tracks[1] }),
            users.length > 0 &&
                users.map((user) => {
                    if (user.videoTrack) {
                        return (React.createElement(AgoraVideoPlayer, { style: { height: '95%', width: '95%' }, className: 'vid', videoTrack: user.videoTrack, key: user.uid }));
                    }
                    else
                        return null;
                }))));
};
export const Controls = (props) => {
    const client = useClient();
    const { tracks, setStart, setInCall } = props;
    const [trackState, setTrackState] = useState({ video: true, audio: true });
    const mute = async (type) => {
        if (type === "audio") {
            await tracks[0].setEnabled(!trackState.audio);
            setTrackState((ps) => {
                return Object.assign(Object.assign({}, ps), { audio: !ps.audio });
            });
        }
        else if (type === "video") {
            await tracks[1].setEnabled(!trackState.video);
            setTrackState((ps) => {
                return Object.assign(Object.assign({}, ps), { video: !ps.video });
            });
        }
    };
    const leaveChannel = async () => {
        await client.leave();
        client.removeAllListeners();
        // we close the tracks to perform cleanup
        tracks[0].close();
        tracks[1].close();
        setStart(false);
        setInCall(false);
    };
    return (React.createElement("div", { className: "controls" },
        React.createElement("p", { className: trackState.audio ? "on" : "", onClick: () => mute("audio") }, trackState.audio ? "MuteAudio" : "UnmuteAudio"),
        React.createElement("p", { className: trackState.video ? "on" : "", onClick: () => mute("video") }, trackState.video ? "MuteVideo" : "UnmuteVideo"),
        React.createElement("p", { onClick: () => leaveChannel() }, "Leave")));
};
const ChannelForm = (props) => {
    const { setInCall, setChannelName } = props;
    return (React.createElement("form", { className: "join" },
        appId === '' && React.createElement("p", { style: { color: 'red' } }, "Please enter your Agora App ID in App.tsx and refresh the page"),
        React.createElement("input", { type: "text", placeholder: "Enter Channel Name", onChange: (e) => setChannelName(e.target.value) }),
        React.createElement("button", { onClick: (e) => {
                e.preventDefault();
                setInCall(true);
            } }, "Join")));
};
export default App;
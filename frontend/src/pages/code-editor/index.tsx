import React, { useState, useEffect, useRef, ChangeEvent } from 'react';
import { useParams } from 'react-router-dom';
import Whiteboard from '../../components/Whiteboard';
import { socket, connectWithSocketServer } from '../../socketConn/socketConn';
import Header from './components/Header';
import Editor from './components/CodeEditor';
import { useAppSelector } from '../../hooks';

const ICE_SERVERS = {
  iceServers: [
    {
      urls: 'stun:openrelay.metered.ca:80',
    },
  ],
};

interface MessageType {
  yours: boolean;
  data: string;
}

const CodeEditor = () => {
  const { roomId } = useParams();
  const [micActive, setMicActive] = useState(true);
  const [cameraActive, setCameraActive] = useState(true);
  const [messages, setMessages] = useState<Array<MessageType>>([]);
  const [chatText, setChatText] = useState<string>();
  const [code, setCode] = useState<string>('');
  const activePage = useAppSelector((state) => state.editor.activePage);

  // Refs for video elements
  const userVideoRef = useRef<HTMLVideoElement>(null);
  const peerVideoRef = useRef<HTMLVideoElement>(null);
  const userStreamRef = useRef<MediaStream>();

  // Store ref to the WebRTC connection
  const rtcConnectionRef = useRef<RTCPeerConnection>();
  const sendChannelRef = useRef<RTCDataChannel>();
  const hostRef = useRef(false);

  useEffect(() => {
    connectWithSocketServer();
    socket.emit('join', roomId);

    socket.on('created', handleRoomCreated);
    socket.on('joined', handleRoomJoined);
    socket.on('ready', initiateCall);
    socket.on('leave', onPeerLeave);
    socket.on('full', () => {
      alert('Room is full');
    });
    socket.on('offer', handleReceivedOffer);
    socket.on('answer', handleReceivedAnswer);
    socket.on('ice-candidate', handleNewPeerIceCandidate);

    // Add handlers for code changes
    socket.on('code-edit', handleCodeEdit);
  }, []);

  const handleCodeWrite = (val: string) => {
    socket.emit('code-write', val);
    setCode(val);
  };

  const handleCodeEdit = (val: string) => {
    setCode(val);
  };

  const setUserMediaStream = async () => {
    const mediaTracks = { audio: true, video: true };
    try {
      const stream = await navigator.mediaDevices.getUserMedia(mediaTracks);
      userStreamRef.current = stream;
      if (userVideoRef.current) {
        userVideoRef.current.srcObject = stream;
      }
    } catch (error) {
      console.log('Error getUserMediaStream: ', error);
    }
  };

  const handleRoomCreated = async () => {
    hostRef.current = true;
    await setUserMediaStream();
  };

  const handleRoomJoined = async () => {
    await setUserMediaStream();
    socket.emit('ready', roomId);
  };

  const createOffer = async () => {
    try {
      const offerSDP = await rtcConnectionRef.current?.createOffer();
      await rtcConnectionRef.current?.setLocalDescription(offerSDP);
      return offerSDP;
    } catch (error) {
      console.log('Error createOffer: ', error);
    }
  };

  const createAnswer = async () => {
    try {
      const answerSDP = await rtcConnectionRef.current?.createAnswer();
      await rtcConnectionRef.current?.setLocalDescription(answerSDP);
      return answerSDP;
    } catch (error) {
      console.log('Error createAnswer: ', error);
    }
  };

  const initiateCall = async () => {
    if (!hostRef.current) return;
    rtcConnectionRef.current = createPeerConnection();
    // Adding data channels for other functionalities
    sendChannelRef.current = rtcConnectionRef.current.createDataChannel(
      'sendChannel',
      { ordered: true }
    );
    sendChannelRef.current.onmessage = handleReceiveMessage;

    // Add local tracks to RTC connection
    userStreamRef.current?.getTracks().forEach((track) => {
      rtcConnectionRef.current?.addTrack(track, userStreamRef.current!);
    });
    const offerSDP = await createOffer();
    socket.emit('offer', offerSDP, roomId);
  };

  const handleReceiveMessage = (e: MessageEvent) => {
    setMessages((messages) => [...messages, { yours: false, data: e.data }]);
  };

  const createPeerConnection = () => {
    const connection = new RTCPeerConnection(ICE_SERVERS);
    connection.onicecandidate = handleICECandidateEvent;
    // We received a remote stream
    connection.ontrack = handleTrackEvent;
    return connection;
  };
  const handleICECandidateEvent = (event: RTCPeerConnectionIceEvent) => {
    if (event.candidate) {
      socket.emit('ice-candidate', event.candidate, roomId);
    }
  };
  const handleTrackEvent = (event: RTCTrackEvent) => {
    if (peerVideoRef.current) {
      peerVideoRef.current.srcObject = event.streams[0];
    }
  };

  const leaveRoom = () => {
    socket.emit('leave', roomId);
    closeTracks(userVideoRef.current?.srcObject as MediaStream);
    closeTracks(peerVideoRef.current?.srcObject as MediaStream);
    closeRTCPeerConnection();
  };
  const onPeerLeave = () => {
    hostRef.current = true;
    closeTracks(peerVideoRef.current?.srcObject as MediaStream);
    closeRTCPeerConnection();
  };

  const closeTracks = (stream: MediaStream) => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
    }
  };

  const closeRTCPeerConnection = () => {
    if (rtcConnectionRef.current) {
      rtcConnectionRef.current.ontrack = null;
      rtcConnectionRef.current.onicecandidate = null;
      rtcConnectionRef.current.close();
      rtcConnectionRef.current = undefined;
    }
  };

  const handleChatInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    setChatText(event.target.value);
  };

  const sendMessage = () => {
    sendChannelRef.current?.send(chatText!);
    setMessages((messages) => [...messages, { yours: true, data: chatText! }]);
    setChatText('');
  };

  const handleReceivedOffer = async (offerSDP: RTCSessionDescription) => {
    if (hostRef.current) return;
    rtcConnectionRef.current = createPeerConnection();
    // Receiving data channel from peer connection
    rtcConnectionRef.current.ondatachannel = (event: RTCDataChannelEvent) => {
      sendChannelRef.current = event.channel;
      sendChannelRef.current.onmessage = handleReceiveMessage;
    };

    // Add local tracks to RTC connection
    userStreamRef.current?.getTracks().forEach((track) => {
      rtcConnectionRef.current?.addTrack(track, userStreamRef.current!);
    });
    try {
      await rtcConnectionRef.current.setRemoteDescription(offerSDP);
    } catch (error) {
      console.log('Error handleReceivedOffer: ', error);
    }
    const answerSDP = await createAnswer();
    socket.emit('answer', answerSDP, roomId);
  };
  const handleReceivedAnswer = async (answerSDP: RTCSessionDescription) => {
    try {
      await rtcConnectionRef.current?.setRemoteDescription(answerSDP);
    } catch (error) {
      console.log('Error handleReceivedAnswer: ', error);
    }
  };

  const handleNewPeerIceCandidate = async (incoming: RTCIceCandidateInit) => {
    try {
      const candidate = new RTCIceCandidate(incoming);
      await rtcConnectionRef.current?.addIceCandidate(candidate);
    } catch (error) {
      console.log('Error handleNewIceCandidate: ', error);
    }
  };

  const toggleMic = () => {
    const audioTracks = userStreamRef.current?.getAudioTracks();
    setMicActive((prev) => {
      audioTracks![0].enabled = !prev;
      return !prev;
    });
  };
  const toggleCamera = () => {
    const videoTracks = userStreamRef.current?.getVideoTracks();
    setCameraActive((prev) => {
      videoTracks![0].enabled = !prev;
      return !prev;
    });
  };

  return (
    <div className='flex flex-col flex-1'>
      <Header />
      {/* CODE EDITOR SECTION */}
      <main className='bg-darkgrey flex-1'>
        <div className='border-b border-charcoal text-white'>
          <div className='py-2 px-8'>Python 3</div>
        </div>
        {activePage === 0 && <Editor code={code} setCode={handleCodeWrite} />}
        {activePage === 1 && <Whiteboard />}
      </main>

      {/* <div>
        <video autoPlay ref={userVideoRef} />
        <video autoPlay ref={peerVideoRef} />
        <button onClick={toggleMic} type='button'>
          {micActive ? 'Mute Mic' : 'Unmute Mic'}
        </button>
        <button onClick={toggleCamera} type='button'>
          {cameraActive ? 'Stop Camera' : 'Start Camera'}
        </button>
        <button onClick={leaveRoom} type='button'>
          Leave
        </button>
      </div>
      <div>
        <div>
          {messages.map((message) => {
            return (
              <p
                style={{
                  textAlign: message.yours ? 'right' : 'left',
                }}
              >
                {message.data}
              </p>
            );
          })}
        </div>
        <input type='text' value={chatText} onChange={handleChatInputChange} />
        <button onClick={sendMessage}>Send Message</button>
      </div> */}
    </div>
  );
};

export default CodeEditor;

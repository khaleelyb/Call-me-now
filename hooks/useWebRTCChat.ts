import { useState, useRef, useCallback, useEffect } from 'react';
import { CallStatus } from '../types';

// In a real app, this would be a WebSocket connection to a signaling server.
// Here we simulate it with a browser CustomEvent for local demonstration.
const signalingChannel = {
  send: (to: string, message: object) => {
    const event = new CustomEvent('signal', { detail: { to, message } });
    window.dispatchEvent(event);
  }
};

const servers = {
  iceServers: [
    {
      urls: ['stun:stun1.l.google.com:19302', 'stun:stun2.l.google.com:19302'],
    },
  ],
  iceCandidatePoolSize: 10,
};

export const useWebRTCChat = (localUserName: string, remoteUserName: string) => {
  const [status, setStatus] = useState<CallStatus>(CallStatus.IDLE);
  const pc = useRef<RTCPeerConnection | null>(null);
  const localStream = useRef<MediaStream | null>(null);
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
  const [error, setError] = useState<string | null>(null);

  const cleanup = useCallback(() => {
    if (pc.current) {
      pc.current.getTransceivers().forEach(transceiver => transceiver.stop());
      pc.current.close();
      pc.current = null;
    }
    if (localStream.current) {
      localStream.current.getTracks().forEach(track => track.stop());
      localStream.current = null;
    }
    setRemoteStream(null);
    setStatus(CallStatus.IDLE);
  }, []);
  
  const hangUp = useCallback(() => {
    signalingChannel.send(remoteUserName, { type: 'hangup' });
    cleanup();
  }, [remoteUserName, cleanup]);

  const startCall = useCallback(async () => {
    setStatus(CallStatus.CALLING);
    setError(null);
    pc.current = new RTCPeerConnection(servers);

    try {
      localStream.current = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
      localStream.current.getTracks().forEach(track => {
        pc.current?.addTrack(track, localStream.current!);
      });
    } catch (err) {
      setError('Could not get microphone access.');
      setStatus(CallStatus.ERROR);
      console.error(err);
      return;
    }

    pc.current.onicecandidate = event => {
      if (event.candidate) {
        signalingChannel.send(remoteUserName, { type: 'candidate', candidate: event.candidate.toJSON() });
      }
    };

    pc.current.ontrack = event => {
      setRemoteStream(event.streams[0]);
    };

    pc.current.onconnectionstatechange = () => {
      if (pc.current?.connectionState === 'connected') {
        setStatus(CallStatus.CONNECTED);
      } else if (pc.current?.connectionState === 'failed' || pc.current?.connectionState === 'disconnected') {
        hangUp();
      }
    };

    const offerDescription = await pc.current.createOffer();
    await pc.current.setLocalDescription(offerDescription);
    signalingChannel.send(remoteUserName, { type: 'offer', sdp: offerDescription.sdp });
  }, [remoteUserName, hangUp]);

  useEffect(() => {
    const handleSignal = async (event: Event) => {
      const { to, message } = (event as CustomEvent).detail;
      if (to !== localUserName) return;

      if (!pc.current && message.type === 'offer') {
         setStatus(CallStatus.CALLING);
         setError(null);
         pc.current = new RTCPeerConnection(servers);

         try {
            localStream.current = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
            localStream.current.getTracks().forEach(track => {
                pc.current?.addTrack(track, localStream.current!);
            });
         } catch(err) {
             setError('Could not get microphone access.');
             setStatus(CallStatus.ERROR);
             console.error(err);
             return;
         }

         pc.current.onicecandidate = iceEvent => {
             if (iceEvent.candidate) {
                signalingChannel.send(remoteUserName, { type: 'candidate', candidate: iceEvent.candidate.toJSON() });
             }
         };

         pc.current.ontrack = trackEvent => {
            setRemoteStream(trackEvent.streams[0]);
         };
        
         pc.current.onconnectionstatechange = () => {
             if (pc.current?.connectionState === 'connected') {
                 setStatus(CallStatus.CONNECTED);
             } else if (pc.current?.connectionState === 'failed' || pc.current?.connectionState === 'disconnected') {
                hangUp();
             }
         };
      }

      if (message.type === 'offer') {
          await pc.current?.setRemoteDescription(new RTCSessionDescription({ type: 'offer', sdp: message.sdp }));
          const answerDescription = await pc.current?.createAnswer();
          await pc.current?.setLocalDescription(answerDescription);
          signalingChannel.send(remoteUserName, { type: 'answer', sdp: answerDescription?.sdp });
      } else if (message.type === 'answer') {
          await pc.current?.setRemoteDescription(new RTCSessionDescription({ type: 'answer', sdp: message.sdp }));
      } else if (message.type === 'candidate' && pc.current?.remoteDescription) {
          try {
            await pc.current.addIceCandidate(new RTCIceCandidate(message.candidate));
          } catch (e) {
            console.error('Error adding received ice candidate', e);
          }
      } else if (message.type === 'hangup') {
        cleanup();
      }
    };

    window.addEventListener('signal', handleSignal);
    return () => {
      window.removeEventListener('signal', handleSignal);
    }
  }, [localUserName, remoteUserName, hangUp, cleanup]);


  return { status, remoteStream, error, startCall, hangUp };
};

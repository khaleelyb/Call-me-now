import React, { useRef, useEffect } from 'react';
import { CallStatus } from '../types';
import { useWebRTCChat } from '../hooks/useWebRTCChat';
import { CallButton } from './CallButton';

interface ChatPanelProps {
  localUserName: string;
  remoteUserName: string;
  avatarUrl: string;
  accentColor: string;
}

export const ChatPanel: React.FC<ChatPanelProps> = ({ localUserName, remoteUserName, avatarUrl, accentColor }) => {
  const { status, remoteStream, error, startCall, hangUp } = useWebRTCChat(localUserName, remoteUserName);
  const remoteAudioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    if (remoteStream && remoteAudioRef.current) {
      remoteAudioRef.current.srcObject = remoteStream;
    }
  }, [remoteStream]);
  
  const getStatusText = () => {
    switch (status) {
      case CallStatus.IDLE:
        return `Ready to call ${remoteUserName}.`;
      case CallStatus.CALLING:
        return `Calling ${remoteUserName}...`;
      case CallStatus.CONNECTED:
        return `Connected with ${remoteUserName}.`;
      case CallStatus.ERROR:
        return "Error occurred.";
      default:
        return "";
    }
  }

  return (
    <div className="bg-gray-800 rounded-2xl p-6 flex flex-col h-[50vh] shadow-lg border border-gray-700">
      <div className="flex items-center mb-4">
        <img src={avatarUrl} alt={localUserName} className="w-16 h-16 rounded-full mr-4 border-2" style={{borderColor: accentColor}} />
        <div>
          <h2 className="text-2xl font-bold">{localUserName}</h2>
          <p className="text-sm text-gray-400">
            Peer-to-Peer Chat
          </p>
        </div>
      </div>
      
      <div className="flex-grow flex flex-col items-center justify-center text-center text-gray-400">
          <p className="text-lg">{getStatusText()}</p>
          {error && <p className="text-red-400 text-sm mt-2">{error}</p>}
      </div>

      <div className="mt-auto flex flex-col items-center pt-4">
        <CallButton status={status} onCall={startCall} onHangUp={hangUp} />
      </div>

      <audio ref={remoteAudioRef} autoPlay playsInline />
    </div>
  );
};

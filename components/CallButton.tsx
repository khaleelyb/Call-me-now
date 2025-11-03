import React from 'react';
import { CallStatus } from '../types';

interface CallButtonProps {
  status: CallStatus;
  onCall: () => void;
  onHangUp: () => void;
}

const PhoneIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path fillRule="evenodd" d="M1.5 4.5a3 3 0 0 1 3-3h1.372c.86 0 1.61.586 1.819 1.42l1.105 4.423a1.875 1.875 0 0 1-.694 1.955l-1.293.97c-.135.101-.164.279-.087.431l4.108 7.293a.875.875 0 0 0 .934.464l1.432-.43a1.875 1.875 0 0 1 1.955.694l4.423 1.105c.834.209 1.42.959 1.42 1.82V19.5a3 3 0 0 1-3 3h-2.25C8.552 22.5 1.5 15.448 1.5 6.75V4.5Z" clipRule="evenodd" />
  </svg>
);

const PhoneHangUpIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path fillRule="evenodd" d="M11.237 21.433a3.75 3.75 0 0 1-5.247 0l-1.25-1.25a3.75 3.75 0 0 1 0-5.247L9.985 9.7a.75.75 0 0 1 1.06 0l4.25 4.25a.75.75 0 0 1 0 1.06l-5.248 5.247Z" clipRule="evenodd" />
    <path fillRule="evenodd" d="M12.75 3.99a.75.75 0 0 1 .75-.75h2.25a.75.75 0 0 1 .75.75v2.25a.75.75 0 0 1-1.5 0V5.06l4.22 4.22a.75.75 0 0 1 0 1.06l-4.25 4.25a.75.75 0 0 1-1.06 0L12 13.06l-2.147 2.147a.75.75 0 0 1-1.06 0L4.545 10.96a.75.75 0 0 1 0-1.06l4.25-4.25a.75.75 0 0 1 1.06 0l2.147 2.147 1.22-1.22a.75.75 0 0 1 1.06 0l.75.75a.75.75 0 0 1 0 1.06l-1.22 1.22L16.94 12l1.03-1.03a.75.75 0 0 1 1.06 0l.75.75a.75.75 0 0 1 0 1.06L18.75 13.81V16.5a.75.75 0 0 1-1.5 0v-2.25a.75.75 0 0 1 .75-.75h2.25a.75.75 0 0 1 .75.75v2.25a.75.75 0 0 1-1.5 0v-1.44l-4.22 4.22a.75.75 0 0 1-1.06 0l-4.25-4.25a.75.75 0 0 1 0-1.06L9.94 9.7l2.147-2.147a.75.75 0 0 1 1.06 0l1.22 1.22a.75.75 0 0 1 1.06 0l.75-.75a.75.75 0 0 1 1.06 0l1.22 1.22 1.03-1.03a.75.75 0 0 1 1.06 0l.75.75a.75.75 0 0 1 0 1.06l-1.22 1.22L21.94 12 21 12.94a.75.75 0 0 1-1.06 0l-1.22-1.22a.75.75 0 0 1 0-1.06l.75-.75a.75.75 0 0 1 1.06 0l1.22 1.22 1.03-1.03a.75.75 0 0 1 1.06 0l.75.75a.75.75 0 0 1 0 1.06l-1.22 1.22L22.5 16.5a.75.75 0 0 1-1.5 0v-2.25a.75.75 0 0 1 .75-.75h2.25a.75.75 0 0 1 .75.75v2.25a3.75 3.75 0 0 1-3.75 3.75h-2.25a3.75 3.75 0 0 1-2.652-1.1L12 16.06l-2.848 2.848a3.75 3.75 0 0 1-5.247 0l-1.25-1.25a3.75 3.75 0 0 1 0-5.247l5.247-5.247a.75.75 0 0 1 1.06 0L12 9.939l1.414-1.414a3.75 3.75 0 0 1 5.247 0l1.25 1.25a3.75 3.75 0 0 1 0 5.247l-5.247 5.247a.75.75 0 0 1-1.06 0l-1.414-1.414-2.848 2.848Z" clipRule="evenodd" />
  </svg>
);


export const CallButton: React.FC<CallButtonProps> = ({ status, onCall, onHangUp }) => {
  const isConnected = status === CallStatus.CONNECTED;
  const isCalling = status === CallStatus.CALLING;

  const getButtonProps = () => {
    if (isConnected || isCalling) {
      return {
        text: isConnected ? "Hang Up" : "Calling...",
        onClick: onHangUp,
        Icon: PhoneHangUpIcon,
        className: 'bg-red-600 hover:bg-red-700',
        disabled: isCalling,
      };
    }
    return {
      text: "Call",
      onClick: onCall,
      Icon: PhoneIcon,
      className: 'bg-green-600 hover:bg-green-700',
      disabled: false,
    };
  };

  const { text, onClick, Icon, className, disabled } = getButtonProps();

  return (
    <div className="flex flex-col items-center gap-3">
      <button
        onClick={onClick}
        disabled={disabled}
        className={`w-48 h-16 rounded-full flex items-center justify-center gap-3 text-xl font-semibold transition-all duration-300 ease-in-out focus:outline-none shadow-lg text-white ${className} disabled:opacity-50 disabled:cursor-wait`}
      >
        <Icon className="w-7 h-7" />
        <span>{text}</span>
      </button>
    </div>
  );
};

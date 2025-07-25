import React from 'react';
import { motion } from 'framer-motion';
import { Phone, PhoneOff, Video, VideoOff, Mic, MicOff } from 'lucide-react';
import { useVideoCall } from '../hooks/useVideoCall';

interface VideoCallProps {
  receiverId?: string;
}

export const VideoCall: React.FC<VideoCallProps> = ({ receiverId }) => {
  const {
    isCallActive,
    isIncomingCall,
    caller,
    localVideoRef,
    remoteVideoRef,
    startCall,
    answerCall,
    endCall,
    toggleVideo,
    toggleAudio,
  } = useVideoCall();

  if (isIncomingCall && caller) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      >
        <div className="bg-white rounded-lg p-6 text-center">
          <h3 className="text-xl font-semibold mb-4">Incoming Video Call</h3>
          <p className="text-gray-600 mb-6">From: {caller.caller_name}</p>
          <div className="flex gap-4 justify-center">
            <button
              onClick={() => answerCall(caller.id)}
              className="bg-green-500 hover:bg-green-600 text-white p-3 rounded-full"
            >
              <Phone className="w-6 h-6" />
            </button>
            <button
              onClick={endCall}
              className="bg-red-500 hover:bg-red-600 text-white p-3 rounded-full"
            >
              <PhoneOff className="w-6 h-6" />
            </button>
          </div>
        </div>
      </motion.div>
    );
  }

  if (isCallActive) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="fixed inset-0 bg-black z-50 flex flex-col"
      >
        <div className="flex-1 relative">
          {/* Remote video */}
          <video
            ref={remoteVideoRef}
            autoPlay
            playsInline
            className="w-full h-full object-cover"
          />
          
          {/* Local video */}
          <div className="absolute top-4 right-4 w-48 h-36 bg-gray-800 rounded-lg overflow-hidden">
            <video
              ref={localVideoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Controls */}
        <div className="bg-gray-900 p-4 flex justify-center gap-4">
          <button
            onClick={toggleVideo}
            className="bg-gray-700 hover:bg-gray-600 text-white p-3 rounded-full"
          >
            <Video className="w-6 h-6" />
          </button>
          <button
            onClick={toggleAudio}
            className="bg-gray-700 hover:bg-gray-600 text-white p-3 rounded-full"
          >
            <Mic className="w-6 h-6" />
          </button>
          <button
            onClick={endCall}
            className="bg-red-500 hover:bg-red-600 text-white p-3 rounded-full"
          >
            <PhoneOff className="w-6 h-6" />
          </button>
        </div>
      </motion.div>
    );
  }

  if (receiverId) {
    return (
      <button
        onClick={() => startCall(receiverId)}
        className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2"
      >
        <Video className="w-4 h-4" />
        Start Video Call
      </button>
    );
  }

  return null;
};
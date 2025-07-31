import React from 'react';
import { motion } from 'framer-motion';
import { Phone, PhoneOff, Video, VideoOff, Mic, MicOff, Loader } from 'lucide-react';
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
    isVideoEnabled,
    isAudioEnabled,
    connectionStatus,
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
        className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50"
      >
        <div className="bg-white rounded-2xl p-8 text-center max-w-sm w-full mx-4">
          <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-2xl mx-auto mb-4">
            {caller.caller_name.charAt(0).toUpperCase()}
          </div>
          <h3 className="text-2xl font-semibold mb-2">Incoming Video Call</h3>
          <p className="text-gray-600 mb-8 text-lg">{caller.caller_name}</p>
          <div className="flex gap-6 justify-center">
            <button
              onClick={() => answerCall(caller.id)}
              className="bg-green-500 hover:bg-green-600 text-white p-4 rounded-full shadow-lg transform hover:scale-105 transition-all"
            >
              <Phone className="w-8 h-8" />
            </button>
            <button
              onClick={endCall}
              className="bg-red-500 hover:bg-red-600 text-white p-4 rounded-full shadow-lg transform hover:scale-105 transition-all"
            >
              <PhoneOff className="w-8 h-8" />
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
        {/* Connection Status */}
        {connectionStatus === 'connecting' && (
          <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-yellow-500 text-white px-4 py-2 rounded-full flex items-center gap-2 z-10">
            <Loader className="w-4 h-4 animate-spin" />
            Connecting...
          </div>
        )}

        <div className="flex-1 relative">
          {/* Remote video */}
          <video
            ref={remoteVideoRef}
            autoPlay
            playsInline
            className="w-full h-full object-cover bg-gray-900"
          />
          
          {/* No remote video placeholder */}
          <div className="absolute inset-0 flex items-center justify-center bg-gray-900">
            <div className="text-center text-white">
              <div className="w-24 h-24 bg-gray-700 rounded-full flex items-center justify-center text-3xl font-bold mx-auto mb-4">
                ?
              </div>
              <p className="text-lg">Waiting for connection...</p>
            </div>
          </div>
          
          {/* Local video */}
          <div className="absolute top-4 right-4 w-48 h-36 bg-gray-800 rounded-xl overflow-hidden shadow-lg border-2 border-white">
            <video
              ref={localVideoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-cover"
              style={{ display: isVideoEnabled ? 'block' : 'none' }}
            />
            {!isVideoEnabled && (
              <div className="w-full h-full bg-gray-700 flex items-center justify-center">
                <VideoOff className="w-8 h-8 text-gray-400" />
              </div>
            )}
          </div>

          {/* Connection status indicator */}
          <div className="absolute top-4 left-4">
            <div className={`px-3 py-1 rounded-full text-sm font-medium ${
              connectionStatus === 'connected' 
                ? 'bg-green-500 text-white' 
                : connectionStatus === 'connecting'
                ? 'bg-yellow-500 text-white'
                : 'bg-red-500 text-white'
            }`}>
              {connectionStatus === 'connected' && '● Connected'}
              {connectionStatus === 'connecting' && '● Connecting...'}
              {connectionStatus === 'disconnected' && '● Disconnected'}
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="bg-gray-900 bg-opacity-90 p-6 flex justify-center gap-6">
          <button
            onClick={toggleVideo}
            className={`p-4 rounded-full transition-all transform hover:scale-105 ${
              isVideoEnabled 
                ? 'bg-gray-700 hover:bg-gray-600 text-white' 
                : 'bg-red-500 hover:bg-red-600 text-white'
            }`}
          >
            {isVideoEnabled ? <Video className="w-6 h-6" /> : <VideoOff className="w-6 h-6" />}
          </button>
          
          <button
            onClick={toggleAudio}
            className={`p-4 rounded-full transition-all transform hover:scale-105 ${
              isAudioEnabled 
                ? 'bg-gray-700 hover:bg-gray-600 text-white' 
                : 'bg-red-500 hover:bg-red-600 text-white'
            }`}
          >
            {isAudioEnabled ? <Mic className="w-6 h-6" /> : <MicOff className="w-6 h-6" />}
          </button>
          
          <button
            onClick={endCall}
            className="bg-red-500 hover:bg-red-600 text-white p-4 rounded-full transition-all transform hover:scale-105"
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
        className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-all transform hover:scale-105"
      >
        <Video className="w-4 h-4" />
        Start Video Call
      </button>
    );
  }

  return null;
};
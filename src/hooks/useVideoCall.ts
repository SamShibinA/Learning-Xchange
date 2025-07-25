import { useState, useRef, useEffect } from 'react';
import Peer from 'simple-peer';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';

export const useVideoCall = () => {
  const { user } = useAuth();
  const [isCallActive, setIsCallActive] = useState(false);
  const [isIncomingCall, setIsIncomingCall] = useState(false);
  const [caller, setCaller] = useState<any>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
  const peerRef = useRef<Peer.Instance | null>(null);
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (!user) return;

    // Listen for incoming calls
    const channel = supabase
      .channel('video_calls')
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'video_calls',
        filter: `receiver_id=eq.${user.id}`,
      }, (payload) => {
        setIsIncomingCall(true);
        setCaller(payload.new);
        toast('Incoming video call!', { icon: '📞' });
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  const startCall = async (receiverId: string) => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      setStream(mediaStream);

      if (localVideoRef.current) {
        localVideoRef.current.srcObject = mediaStream;
      }

      // Create peer connection as initiator
      const peer = new Peer({
        initiator: true,
        trickle: false,
        stream: mediaStream,
      });

      peer.on('signal', async (signal) => {
        // Store call in database with signal data
        await supabase.from('video_calls').insert([
          {
            caller_id: user?.id,
            receiver_id: receiverId,
            status: 'pending',
            signal_data: JSON.stringify(signal),
          },
        ]);
      });

      peer.on('stream', (remoteStream) => {
        setRemoteStream(remoteStream);
        if (remoteVideoRef.current) {
          remoteVideoRef.current.srcObject = remoteStream;
        }
      });

      peerRef.current = peer;
      setIsCallActive(true);
    } catch (error) {
      console.error('Error starting call:', error);
      toast.error('Failed to start call');
    }
  };

  const answerCall = async (callId: string) => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      setStream(mediaStream);

      if (localVideoRef.current) {
        localVideoRef.current.srcObject = mediaStream;
      }

      // Get call data
      const { data: callData } = await supabase
        .from('video_calls')
        .select('*')
        .eq('id', callId)
        .single();

      if (callData?.signal_data) {
        const peer = new Peer({
          initiator: false,
          trickle: false,
          stream: mediaStream,
        });

        peer.on('signal', async (signal) => {
          // Send answer signal back
          await supabase
            .from('video_calls')
            .update({
              answer_signal: JSON.stringify(signal),
              status: 'active',
            })
            .eq('id', callId);
        });

        peer.on('stream', (remoteStream) => {
          setRemoteStream(remoteStream);
          if (remoteVideoRef.current) {
            remoteVideoRef.current.srcObject = remoteStream;
          }
        });

        peer.signal(JSON.parse(callData.signal_data));
        peerRef.current = peer;
        setIsCallActive(true);
        setIsIncomingCall(false);
      }
    } catch (error) {
      console.error('Error answering call:', error);
      toast.error('Failed to answer call');
    }
  };

  const endCall = () => {
    if (peerRef.current) {
      peerRef.current.destroy();
      peerRef.current = null;
    }
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    setRemoteStream(null);
    setIsCallActive(false);
    setIsIncomingCall(false);
    setCaller(null);
  };

  const toggleVideo = () => {
    if (stream) {
      const videoTrack = stream.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled;
      }
    }
  };

  const toggleAudio = () => {
    if (stream) {
      const audioTrack = stream.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
      }
    }
  };

  return {
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
  };
};
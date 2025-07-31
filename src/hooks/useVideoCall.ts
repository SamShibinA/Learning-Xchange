import { useState, useRef, useEffect, useCallback } from 'react';
import Peer from 'simple-peer';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';

interface CallData {
  id: string;
  caller_id: string;
  receiver_id: string;
  caller_name: string;
  status: string;
  signal_data?: string;
  answer_signal?: string;
}

export const useVideoCall = () => {
  const { user } = useAuth();
  const [isCallActive, setIsCallActive] = useState(false);
  const [isIncomingCall, setIsIncomingCall] = useState(false);
  const [caller, setCaller] = useState<CallData | null>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [connectionStatus, setConnectionStatus] = useState<'connecting' | 'connected' | 'disconnected'>('disconnected');
  
  const peerRef = useRef<Peer.Instance | null>(null);
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const currentCallId = useRef<string | null>(null);

  // Initialize media stream
  const initializeMedia = useCallback(async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 1280 },
          height: { ideal: 720 },
          facingMode: 'user'
        },
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        }
      });
      
      setStream(mediaStream);
      
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = mediaStream;
      }
      
      return mediaStream;
    } catch (error) {
      console.error('Error accessing media devices:', error);
      toast.error('Failed to access camera/microphone. Please check permissions.');
      throw error;
    }
  }, []);

  // Clean up media stream
  const cleanupMedia = useCallback(() => {
    if (stream) {
      stream.getTracks().forEach(track => {
        track.stop();
      });
      setStream(null);
    }
    
    if (localVideoRef.current) {
      localVideoRef.current.srcObject = null;
    }
    
    if (remoteVideoRef.current) {
      remoteVideoRef.current.srcObject = null;
    }
  }, [stream]);

  // Create peer connection
  const createPeer = useCallback((initiator: boolean, mediaStream: MediaStream) => {
    const peer = new Peer({
      initiator,
      trickle: false,
      stream: mediaStream,
      config: {
        iceServers: [
          { urls: 'stun:stun.l.google.com:19302' },
          { urls: 'stun:stun1.l.google.com:19302' }
        ]
      }
    });

    peer.on('connect', () => {
      console.log('Peer connected');
      setConnectionStatus('connected');
    });

    peer.on('stream', (remoteStream) => {
      console.log('Received remote stream');
      if (remoteVideoRef.current) {
        remoteVideoRef.current.srcObject = remoteStream;
      }
    });

    peer.on('error', (error) => {
      console.error('Peer error:', error);
      toast.error('Connection error occurred');
      setConnectionStatus('disconnected');
    });

    peer.on('close', () => {
      console.log('Peer connection closed');
      setConnectionStatus('disconnected');
    });

    return peer;
  }, []);

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
      }, async (payload) => {
        const callData = payload.new as CallData;
        
        // Get caller info
        const { data: callerData } = await supabase
          .from('users')
          .select('full_name')
          .eq('id', callData.caller_id)
          .single();
        
        setCaller({
          ...callData,
          caller_name: callerData?.full_name || 'Unknown'
        });
        setIsIncomingCall(true);
        toast('Incoming video call!', { icon: '📞' });
      })
      .on('postgres_changes', {
        event: 'UPDATE',
        schema: 'public',
        table: 'video_calls',
        filter: `caller_id=eq.${user.id}`,
      }, (payload) => {
        const callData = payload.new as CallData;
        
        if (callData.answer_signal && currentCallId.current === callData.id) {
          // Receiver answered, signal the peer
          if (peerRef.current && callData.answer_signal) {
            try {
              peerRef.current.signal(JSON.parse(callData.answer_signal));
            } catch (error) {
              console.error('Error signaling peer:', error);
            }
          }
        }
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  const startCall = async (receiverId: string) => {
    try {
      setConnectionStatus('connecting');
      const mediaStream = await initializeMedia();

      // Create peer connection as initiator
      const peer = createPeer(true, mediaStream);

      peer.on('signal', async (signal) => {
        try {
          // Store call in database with signal data
          const { data, error } = await supabase
            .from('video_calls')
            .insert([
              {
                caller_id: user?.id,
                receiver_id: receiverId,
                status: 'pending',
                signal_data: JSON.stringify(signal),
              },
            ])
            .select()
            .single();

          if (error) throw error;
          currentCallId.current = data.id;
        } catch (error) {
          console.error('Error storing call:', error);
          toast.error('Failed to initiate call');
        }
      });

      peerRef.current = peer;
      setIsCallActive(true);
      toast.success('Calling...');
    } catch (error) {
      console.error('Error starting call:', error);
      setConnectionStatus('disconnected');
    }
  };

  const answerCall = async (callId: string) => {
    try {
      setConnectionStatus('connecting');
      const mediaStream = await initializeMedia();

      // Get call data
      const { data: callData, error } = await supabase
        .from('video_calls')
        .select('*')
        .eq('id', callId)
        .single();

      if (error || !callData?.signal_data) {
        throw new Error('Call data not found');
      }

      // Create peer connection as receiver
      const peer = createPeer(false, mediaStream);

      peer.on('signal', async (signal) => {
        try {
          // Send answer signal back
          await supabase
            .from('video_calls')
            .update({
              answer_signal: JSON.stringify(signal),
              status: 'active',
            })
            .eq('id', callId);
        } catch (error) {
          console.error('Error sending answer signal:', error);
        }
      });

      // Signal with the caller's offer
      peer.signal(JSON.parse(callData.signal_data));
      
      peerRef.current = peer;
      currentCallId.current = callId;
      setIsCallActive(true);
      setIsIncomingCall(false);
      setCaller(null);
      toast.success('Call connected!');
    } catch (error) {
      console.error('Error answering call:', error);
      toast.error('Failed to answer call');
      setConnectionStatus('disconnected');
    }
  };

  const endCall = useCallback(async () => {
    try {
      // Update call status in database
      if (currentCallId.current) {
        await supabase
          .from('video_calls')
          .update({ status: 'ended' })
          .eq('id', currentCallId.current);
      }
    } catch (error) {
      console.error('Error updating call status:', error);
    }

    // Clean up peer connection
    if (peerRef.current) {
      peerRef.current.destroy();
      peerRef.current = null;
    }

    // Clean up media
    cleanupMedia();

    // Reset state
    setIsCallActive(false);
    setIsIncomingCall(false);
    setCaller(null);
    setConnectionStatus('disconnected');
    currentCallId.current = null;
    
    toast.success('Call ended');
  }, [cleanupMedia]);

  const toggleVideo = useCallback(() => {
    if (stream) {
      const videoTrack = stream.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled;
        setIsVideoEnabled(videoTrack.enabled);
        
        if (localVideoRef.current) {
          localVideoRef.current.style.display = videoTrack.enabled ? 'block' : 'none';
        }
      }
    }
  }, [stream]);

  const toggleAudio = useCallback(() => {
    if (stream) {
      const audioTrack = stream.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
        setIsAudioEnabled(audioTrack.enabled);
      }
    }
  }, [stream]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (peerRef.current) {
        peerRef.current.destroy();
      }
      cleanupMedia();
    };
  }, [cleanupMedia]);

  return {
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
  };
};
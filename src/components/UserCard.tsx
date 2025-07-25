import React from 'react';
import { motion } from 'framer-motion';
import { Star, Video, MessageCircle } from 'lucide-react';
import { User } from '../types';
import { VideoCall } from './VideoCall';

interface UserCardProps {
  user: User;
}

export const UserCard: React.FC<UserCardProps> = ({ user }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
    >
      <div className="text-center mb-4">
        <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-xl mx-auto mb-3">
          {user.full_name.charAt(0).toUpperCase()}
        </div>
        
        <h3 className="font-semibold text-gray-900 text-lg">{user.full_name}</h3>
        
        <div className="flex items-center justify-center gap-1 text-yellow-500 mt-1">
          <Star className="w-4 h-4 fill-current" />
          <span className="text-sm font-medium">{user.rating}</span>
        </div>
      </div>

      {user.bio && (
        <p className="text-gray-600 text-sm text-center mb-4">{user.bio}</p>
      )}

      <div className="mb-4">
        <h4 className="text-sm font-medium text-gray-700 mb-2">Expertise:</h4>
        <div className="flex flex-wrap gap-1">
          {user.expertise.slice(0, 3).map((skill, index) => (
            <span
              key={index}
              className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full"
            >
              {skill}
            </span>
          ))}
          {user.expertise.length > 3 && (
            <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
              +{user.expertise.length - 3} more
            </span>
          )}
        </div>
      </div>

      <div className="flex gap-2">
        <VideoCall receiverId={user.id} />
        
        <button className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-2 rounded-lg flex items-center justify-center gap-2 text-sm">
          <MessageCircle className="w-4 h-4" />
          Message
        </button>
      </div>
    </motion.div>
  );
};
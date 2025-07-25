import React from 'react';
import { motion } from 'framer-motion';
import { Heart, MessageCircle, Star, Calendar } from 'lucide-react';
import { KnowledgePost } from '../types';

interface PostCardProps {
  post: KnowledgePost;
}

export const PostCard: React.FC<PostCardProps> = ({ post }) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
            {post.author.full_name.charAt(0).toUpperCase()}
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">{post.author.full_name}</h3>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Calendar className="w-4 h-4" />
              {formatDate(post.created_at)}
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-1 text-yellow-500">
          <Star className="w-4 h-4 fill-current" />
          <span className="text-sm font-medium">{post.author.rating}</span>
        </div>
      </div>

      <div className="mb-4">
        <h2 className="text-xl font-bold text-gray-900 mb-2">{post.title}</h2>
        <p className="text-gray-700 leading-relaxed">{post.content}</p>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex flex-wrap gap-2">
          {post.tags.map((tag, index) => (
            <span
              key={index}
              className="px-3 py-1 bg-blue-100 text-blue-700 text-sm rounded-full"
            >
              #{tag}
            </span>
          ))}
        </div>

        <div className="flex items-center gap-4">
          <button className="flex items-center gap-2 text-gray-500 hover:text-red-500 transition-colors">
            <Heart className="w-5 h-5" />
            <span className="text-sm">{post.likes_count}</span>
          </button>
          
          <button className="flex items-center gap-2 text-gray-500 hover:text-blue-500 transition-colors">
            <MessageCircle className="w-5 h-5" />
            <span className="text-sm">{post.comments_count}</span>
          </button>
        </div>
      </div>
    </motion.div>
  );
};
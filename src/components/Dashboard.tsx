import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Plus, Video, MessageCircle, Star, Users } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { KnowledgePost, User } from '../types';
import { VideoCall } from './VideoCall';
import { PostCard } from './PostCard';
import { UserCard } from './UserCard';
import { CreatePost } from './CreatePost';

export const Dashboard: React.FC = () => {
  const { user, signOut } = useAuth();
  const [posts, setPosts] = useState<KnowledgePost[]>([]);
  const [experts, setExperts] = useState<User[]>([]);
  const [activeTab, setActiveTab] = useState<'feed' | 'experts' | 'create'>('feed');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPosts();
    fetchExperts();
  }, []);

  const fetchPosts = async () => {
    try {
      const { data, error } = await supabase
        .from('knowledge_posts')
        .select(`
          *,
          author:users(*)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPosts(data || []);
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchExperts = async () => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .order('rating', { ascending: false })
        .limit(10);

      if (error) throw error;
      setExperts(data || []);
    } catch (error) {
      console.error('Error fetching experts:', error);
    }
  };

  const filteredPosts = posts.filter(post =>
    post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    post.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
    post.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900">
                Knowledge Exchange
              </h1>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search knowledge..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">Welcome, {user?.full_name}</span>
                <button
                  onClick={signOut}
                  className="text-sm text-red-600 hover:text-red-700"
                >
                  Sign Out
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-8">
          {/* Sidebar */}
          <div className="w-64 flex-shrink-0">
            <nav className="space-y-2">
              <button
                onClick={() => setActiveTab('feed')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${
                  activeTab === 'feed'
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <MessageCircle className="w-5 h-5" />
                Knowledge Feed
              </button>
              
              <button
                onClick={() => setActiveTab('experts')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${
                  activeTab === 'experts'
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <Users className="w-5 h-5" />
                Find Experts
              </button>
              
              <button
                onClick={() => setActiveTab('create')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${
                  activeTab === 'create'
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <Plus className="w-5 h-5" />
                Share Knowledge
              </button>
            </nav>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {activeTab === 'feed' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-bold text-gray-900">Knowledge Feed</h2>
                </div>
                
                {loading ? (
                  <div className="text-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading posts...</p>
                  </div>
                ) : filteredPosts.length === 0 ? (
                  <div className="text-center py-12">
                    <MessageCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">No posts found. Be the first to share knowledge!</p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {filteredPosts.map((post) => (
                      <PostCard key={post.id} post={post} />
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'experts' && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-900">Find Experts</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {experts.map((expert) => (
                    <UserCard key={expert.id} user={expert} />
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'create' && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-900">Share Your Knowledge</h2>
                <CreatePost onPostCreated={fetchPosts} />
              </div>
            )}
          </div>
        </div>
      </div>

      <VideoCall />
    </div>
  );
};
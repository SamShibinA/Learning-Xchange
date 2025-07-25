export interface User {
  id: string;
  email: string;
  full_name: string;
  avatar_url?: string;
  expertise: string[];
  bio?: string;
  rating: number;
  created_at: string;
}

export interface KnowledgePost {
  id: string;
  title: string;
  content: string;
  category: string;
  tags: string[];
  author_id: string;
  author: User;
  created_at: string;
  updated_at: string;
  likes_count: number;
  comments_count: number;
}

export interface Comment {
  id: string;
  content: string;
  post_id: string;
  author_id: string;
  author: User;
  created_at: string;
}

export interface VideoCall {
  id: string;
  caller_id: string;
  receiver_id: string;
  status: 'pending' | 'active' | 'ended';
  created_at: string;
}

export interface Message {
  id: string;
  content: string;
  sender_id: string;
  receiver_id: string;
  created_at: string;
}
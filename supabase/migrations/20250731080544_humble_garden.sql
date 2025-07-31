/*
  # Create knowledge posts table

  1. New Tables
    - `knowledge_posts`
      - `id` (uuid, primary key)
      - `title` (text)
      - `content` (text)
      - `category` (text)
      - `tags` (text array)
      - `author_id` (uuid, references users)
      - `likes_count` (integer, default 0)
      - `comments_count` (integer, default 0)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `knowledge_posts` table
    - Add policies for reading all posts and managing own posts
*/

CREATE TABLE IF NOT EXISTS knowledge_posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  content text NOT NULL,
  category text NOT NULL,
  tags text[] DEFAULT '{}',
  author_id uuid REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  likes_count integer DEFAULT 0 CHECK (likes_count >= 0),
  comments_count integer DEFAULT 0 CHECK (comments_count >= 0),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE knowledge_posts ENABLE ROW LEVEL SECURITY;

-- Policies for knowledge posts
CREATE POLICY "Anyone can view posts"
  ON knowledge_posts
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can create posts"
  ON knowledge_posts
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = author_id);

CREATE POLICY "Users can update their own posts"
  ON knowledge_posts
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = author_id);

CREATE POLICY "Users can delete their own posts"
  ON knowledge_posts
  FOR DELETE
  TO authenticated
  USING (auth.uid() = author_id);

-- Create updated_at trigger
CREATE TRIGGER update_knowledge_posts_updated_at
  BEFORE UPDATE ON knowledge_posts
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
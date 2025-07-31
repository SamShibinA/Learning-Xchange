/*
  # Create video calls table

  1. New Tables
    - `video_calls`
      - `id` (uuid, primary key)
      - `caller_id` (uuid, references users)
      - `receiver_id` (uuid, references users)
      - `status` (text, call status)
      - `signal_data` (text, WebRTC signal data)
      - `answer_signal` (text, WebRTC answer signal)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `video_calls` table
    - Add policies for users to manage their own calls
*/

CREATE TABLE IF NOT EXISTS video_calls (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  caller_id uuid REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  receiver_id uuid REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'active', 'ended', 'rejected')),
  signal_data text,
  answer_signal text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE video_calls ENABLE ROW LEVEL SECURITY;

-- Policies for video calls
CREATE POLICY "Users can view their own calls"
  ON video_calls
  FOR SELECT
  TO authenticated
  USING (auth.uid() = caller_id OR auth.uid() = receiver_id);

CREATE POLICY "Users can create calls"
  ON video_calls
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = caller_id);

CREATE POLICY "Users can update their own calls"
  ON video_calls
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = caller_id OR auth.uid() = receiver_id);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_video_calls_updated_at
  BEFORE UPDATE ON video_calls
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
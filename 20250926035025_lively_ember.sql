/*
  # Create patients and wound records tables

  1. New Tables
    - `patients`
      - `id` (uuid, primary key)
      - `name` (text)
      - `age` (integer)
      - `condition` (text)
      - `date_of_injury` (date)
      - `last_upload` (timestamptz)
      - `created_at` (timestamptz)
    - `wound_records`
      - `id` (uuid, primary key)
      - `patient_id` (uuid, foreign key)
      - `image_url` (text)
      - `processed_image_url` (text)
      - `timestamp` (timestamptz)
      - `wound_area` (integer)
      - `healing_score` (integer)
      - `redness_level` (text)
      - `recommendations` (text array)
      - `area_change` (decimal)
      - `score_change` (integer)
      - `trend` (text)
      - `created_at` (timestamptz)
    - `alerts`
      - `id` (uuid, primary key)
      - `patient_id` (uuid, foreign key)
      - `type` (text)
      - `message` (text)
      - `severity` (text)20250926035025_lively_ember.sql
      - `timestamp` (timestamptz)
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to manage their data
*/

-- Create patients table
CREATE TABLE IF NOT EXISTS patients (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  age integer NOT NULL,
  condition text NOT NULL,
  date_of_injury date NOT NULL,
  last_upload timestamptz,
  created_at timestamptz DEFAULT now()
);

-- Create wound_records table
CREATE TABLE IF NOT EXISTS wound_records (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id uuid REFERENCES patients(id) ON DELETE CASCADE,
  image_url text NOT NULL,
  processed_image_url text,
  timestamp timestamptz DEFAULT now(),
  wound_area integer NOT NULL,
  healing_score integer NOT NULL,
  redness_level text NOT NULL CHECK (redness_level IN ('low', 'medium', 'high')),
  recommendations text[] DEFAULT '{}',
  area_change decimal,
  score_change integer,
  trend text CHECK (trend IN ('improving', 'stable', 'concerning')),
  created_at timestamptz DEFAULT now()
);

-- Create alerts table
CREATE TABLE IF NOT EXISTS alerts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id uuid REFERENCES patients(id) ON DELETE CASCADE,
  type text NOT NULL CHECK (type IN ('infection_risk', 'regression', 'no_progress')),
  message text NOT NULL,
  severity text NOT NULL CHECK (severity IN ('low', 'medium', 'high')),
  timestamp timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE patients ENABLE ROW LEVEL SECURITY;
ALTER TABLE wound_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE alerts ENABLE ROW LEVEL SECURITY;

-- Create policies for patients table
CREATE POLICY "Allow all operations on patients"
  ON patients
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Create policies for wound_records table
CREATE POLICY "Allow all operations on wound_records"
  ON wound_records
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Create policies for alerts table
CREATE POLICY "Allow all operations on alerts"
  ON alerts
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Insert sample data
INSERT INTO patients (id, name, age, condition, date_of_injury, last_upload) VALUES
  ('550e8400-e29b-41d4-a716-446655440001', 'Sarah Johnson', 45, 'Diabetic foot ulcer', '2024-01-15', '2024-01-22T09:00:00Z'),
  ('550e8400-e29b-41d4-a716-446655440002', 'Michael Chen', 32, 'Post-surgical wound', '2024-01-10', '2024-01-21T09:00:00Z'),
  ('550e8400-e29b-41d4-a716-446655440003', 'Emma Davis', 67, 'Pressure ulcer', '2024-01-08', '2024-01-20T09:00:00Z');

INSERT INTO wound_records (patient_id, image_url, processed_image_url, timestamp, wound_area, healing_score, redness_level, recommendations) VALUES
  ('550e8400-e29b-41d4-a716-446655440001', 'https://images.pexels.com/photos/4386431/pexels-photo-4386431.jpeg?auto=compress&cs=tinysrgb&w=400', 'https://images.pexels.com/photos/4386431/pexels-photo-4386431.jpeg?auto=compress&cs=tinysrgb&w=400', '2024-01-15T09:00:00Z', 1200, 65, 'high', ARRAY['Apply prescribed antibiotic ointment', 'Keep wound clean and dry', 'Monitor for signs of infection']),
  ('550e8400-e29b-41d4-a716-446655440001', 'https://images.pexels.com/photos/4167541/pexels-photo-4167541.jpeg?auto=compress&cs=tinysrgb&w=400', 'https://images.pexels.com/photos/4167541/pexels-photo-4167541.jpeg?auto=compress&cs=tinysrgb&w=400', '2024-01-18T09:00:00Z', 950, 78, 'medium', ARRAY['Continue current treatment', 'Wound showing improvement', 'Schedule follow-up in 3 days'], -20.8, 13, 'improving'),
  ('550e8400-e29b-41d4-a716-446655440001', 'https://images.pexels.com/photos/4173624/pexels-photo-4173624.jpeg?auto=compress&cs=tinysrgb&w=400', 'https://images.pexels.com/photos/4173624/pexels-photo-4173624.jpeg?auto=compress&cs=tinysrgb&w=400', '2024-01-22T09:00:00Z', 720, 85, 'low', ARRAY['Excellent progress', 'Continue current care routine', 'Wound healing well'], -24.2, 7, 'improving');

INSERT INTO alerts (patient_id, type, message, severity, timestamp) VALUES
  ('550e8400-e29b-41d4-a716-446655440002', 'no_progress', 'No significant healing progress in the last 5 days', 'medium', '2024-01-21T10:30:00Z');
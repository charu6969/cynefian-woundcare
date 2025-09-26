import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    "Missing Supabase environment variables. Please set up Supabase connection."
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database types
export interface Database {
  public: {
    Tables: {
      patients: {
        Row: {
          id: string;
          name: string;
          age: number;
          condition: string;
          date_of_injury: string;
          last_upload: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          age: number;
          condition: string;
          date_of_injury: string;
          last_upload?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          age?: number;
          condition?: string;
          date_of_injury?: string;
          last_upload?: string | null;
          created_at?: string;
        };
      };
      wound_records: {
        Row: {
          id: string;
          patient_id: string;
          image_url: string;
          processed_image_url: string | null;
          timestamp: string;
          wound_area: number;
          healing_score: number;
          redness_level: "low" | "medium" | "high";
          recommendations: string[];
          area_change: number | null;
          score_change: number | null;
          trend: "improving" | "stable" | "concerning" | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          patient_id: string;
          image_url: string;
          processed_image_url?: string | null;
          timestamp?: string;
          wound_area: number;
          healing_score: number;
          redness_level: "low" | "medium" | "high";
          recommendations?: string[];
          area_change?: number | null;
          score_change?: number | null;
          trend?: "improving" | "stable" | "concerning" | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          patient_id?: string;
          image_url?: string;
          processed_image_url?: string | null;
          timestamp?: string;
          wound_area?: number;
          healing_score?: number;
          redness_level?: "low" | "medium" | "high";
          recommendations?: string[];
          area_change?: number | null;
          score_change?: number | null;
          trend?: "improving" | "stable" | "concerning" | null;
          created_at?: string;
        };
      };
      alerts: {
        Row: {
          id: string;
          patient_id: string;
          type: "infection_risk" | "regression" | "no_progress";
          message: string;
          severity: "low" | "medium" | "high";
          timestamp: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          patient_id: string;
          type: "infection_risk" | "regression" | "no_progress";
          message: string;
          severity: "low" | "medium" | "high";
          timestamp?: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          patient_id?: string;
          type?: "infection_risk" | "regression" | "no_progress";
          message?: string;
          severity?: "low" | "medium" | "high";
          timestamp?: string;
          created_at?: string;
        };
      };
    };
  };
}

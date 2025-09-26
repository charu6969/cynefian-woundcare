export interface Patient {
  id: string;
  name: string;
  age: number;
  condition: string;
  dateOfInjury: string;
  lastUpload?: string;
}

export interface WoundRecord {
  id: string;
  patientId: string;
  imageUrl: string;
  processedImageUrl?: string;
  timestamp: string;
  analysis: WoundAnalysis;
}

export interface WoundAnalysis {
  woundArea: number; // in pixels
  healingScore: number; // 0-100
  rednessLevel: "low" | "medium" | "high";
  recommendations: string[];
  changeFromPrevious?: {
    areaChange: number; // percentage
    scoreChange: number;
    trend: "improving" | "stable" | "concerning";
  };
}

export interface AlertType {
  id: string;
  patientId: string;
  type: "infection_risk" | "regression" | "no_progress";
  message: string;
  timestamp: string;
  severity: "low" | "medium" | "high";
}

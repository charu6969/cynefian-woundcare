import { Patient, WoundRecord, AlertType } from "../types";

export const mockPatients: Patient[] = [
  {
    id: "1",
    name: "Sarah Johnson",
    age: 45,
    condition: "Diabetic foot ulcer",
    dateOfInjury: "2024-01-15",
    lastUpload: "2024-01-22",
  },
  {
    id: "2",
    name: "Michael Chen",
    age: 32,
    condition: "Post-surgical wound",
    dateOfInjury: "2024-01-10",
    lastUpload: "2024-01-21",
  },
  {
    id: "3",
    name: "Emma Davis",
    age: 67,
    condition: "Pressure ulcer",
    dateOfInjury: "2024-01-08",
    lastUpload: "2024-01-20",
  },
];

export const mockWoundRecords: WoundRecord[] = [
  {
    id: "1",
    patientId: "1",
    imageUrl:
      "https://images.pexels.com/photos/4386431/pexels-photo-4386431.jpeg?auto=compress&cs=tinysrgb&w=400",
    processedImageUrl:
      "https://images.pexels.com/photos/4386431/pexels-photo-4386431.jpeg?auto=compress&cs=tinysrgb&w=400",
    timestamp: "2024-01-15T09:00:00Z",
    analysis: {
      woundArea: 1200,
      healingScore: 65,
      rednessLevel: "high",
      recommendations: [
        "Apply prescribed antibiotic ointment",
        "Keep wound clean and dry",
        "Monitor for signs of infection",
      ],
    },
  },
  {
    id: "2",
    patientId: "1",
    imageUrl:
      "https://images.pexels.com/photos/4167541/pexels-photo-4167541.jpeg?auto=compress&cs=tinysrgb&w=400",
    processedImageUrl:
      "https://images.pexels.com/photos/4167541/pexels-photo-4167541.jpeg?auto=compress&cs=tinysrgb&w=400",
    timestamp: "2024-01-18T09:00:00Z",
    analysis: {
      woundArea: 950,
      healingScore: 78,
      rednessLevel: "medium",
      recommendations: [
        "Continue current treatment",
        "Wound showing improvement",
        "Schedule follow-up in 3 days",
      ],
      changeFromPrevious: {
        areaChange: -20.8,
        scoreChange: 13,
        trend: "improving",
      },
    },
  },
  {
    id: "3",
    patientId: "1",
    imageUrl:
      "https://images.pexels.com/photos/4173624/pexels-photo-4173624.jpeg?auto=compress&cs=tinysrgb&w=400",
    processedImageUrl:
      "https://images.pexels.com/photos/4173624/pexels-photo-4173624.jpeg?auto=compress&cs=tinysrgb&w=400",
    timestamp: "2024-01-22T09:00:00Z",
    analysis: {
      woundArea: 720,
      healingScore: 85,
      rednessLevel: "low",
      recommendations: [
        "Excellent progress",
        "Continue current care routine",
        "Wound healing well",
      ],
      changeFromPrevious: {
        areaChange: -24.2,
        scoreChange: 7,
        trend: "improving",
      },
    },
  },
];

export const mockAlerts: AlertType[] = [
  {
    id: "1",
    patientId: "2",
    type: "no_progress",
    message: "No significant healing progress in the last 5 days",
    timestamp: "2024-01-21T10:30:00Z",
    severity: "medium",
  },
];

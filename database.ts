import { supabase } from "./supabase";
import { Patient, WoundRecord, AlertType } from "../types";

// Patient operations
export async function getPatients(): Promise<Patient[]> {
  const { data, error } = await supabase
    .from("patients")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching patients:", error);
    throw error;
  }

  return data.map((patient) => ({
    id: patient.id,
    name: patient.name,
    age: patient.age,
    condition: patient.condition,
    dateOfInjury: patient.date_of_injury,
    lastUpload: patient.last_upload,
  }));
}

export async function createPatient(
  patient: Omit<Patient, "id">
): Promise<Patient> {
  const { data, error } = await supabase
    .from("patients")
    .insert({
      name: patient.name,
      age: patient.age,
      condition: patient.condition,
      date_of_injury: patient.dateOfInjury,
      last_upload: patient.lastUpload,
    })
    .select()
    .single();

  if (error) {
    console.error("Error creating patient:", error);
    throw error;
  }

  return {
    id: data.id,
    name: data.name,
    age: data.age,
    condition: data.condition,
    dateOfInjury: data.date_of_injury,
    lastUpload: data.last_upload,
  };
}

export async function updatePatient(
  id: string,
  updates: Partial<Patient>
): Promise<Patient> {
  const { data, error } = await supabase
    .from("patients")
    .update({
      name: updates.name,
      age: updates.age,
      condition: updates.condition,
      date_of_injury: updates.dateOfInjury,
      last_upload: updates.lastUpload,
    })
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error("Error updating patient:", error);
    throw error;
  }

  return {
    id: data.id,
    name: data.name,
    age: data.age,
    condition: data.condition,
    dateOfInjury: data.date_of_injury,
    lastUpload: data.last_upload,
  };
}

// Wound record operations
export async function getWoundRecords(
  patientId?: string
): Promise<WoundRecord[]> {
  let query = supabase
    .from("wound_records")
    .select("*")
    .order("timestamp", { ascending: true });

  if (patientId) {
    query = query.eq("patient_id", patientId);
  }

  const { data, error } = await query;

  if (error) {
    console.error("Error fetching wound records:", error);
    throw error;
  }

  return data.map((record) => ({
    id: record.id,
    patientId: record.patient_id,
    imageUrl: record.image_url,
    processedImageUrl: record.processed_image_url,
    timestamp: record.timestamp,
    analysis: {
      woundArea: record.wound_area,
      healingScore: record.healing_score,
      rednessLevel: record.redness_level,
      recommendations: record.recommendations,
      changeFromPrevious:
        record.area_change !== null
          ? {
              areaChange: record.area_change,
              scoreChange: record.score_change || 0,
              trend: record.trend || "stable",
            }
          : undefined,
    },
  }));
}

export async function createWoundRecord(
  record: Omit<WoundRecord, "id">
): Promise<WoundRecord> {
  const { data, error } = await supabase
    .from("wound_records")
    .insert({
      patient_id: record.patientId,
      image_url: record.imageUrl,
      processed_image_url: record.processedImageUrl,
      timestamp: record.timestamp,
      wound_area: record.analysis.woundArea,
      healing_score: record.analysis.healingScore,
      redness_level: record.analysis.rednessLevel,
      recommendations: record.analysis.recommendations,
      area_change: record.analysis.changeFromPrevious?.areaChange,
      score_change: record.analysis.changeFromPrevious?.scoreChange,
      trend: record.analysis.changeFromPrevious?.trend,
    })
    .select()
    .single();

  if (error) {
    console.error("Error creating wound record:", error);
    throw error;
  }

  // Update patient's last upload
  await supabase
    .from("patients")
    .update({ last_upload: record.timestamp })
    .eq("id", record.patientId);

  return {
    id: data.id,
    patientId: data.patient_id,
    imageUrl: data.image_url,
    processedImageUrl: data.processed_image_url,
    timestamp: data.timestamp,
    analysis: {
      woundArea: data.wound_area,
      healingScore: data.healing_score,
      rednessLevel: data.redness_level,
      recommendations: data.recommendations,
      changeFromPrevious:
        data.area_change !== null
          ? {
              areaChange: data.area_change,
              scoreChange: data.score_change || 0,
              trend: data.trend || "stable",
            }
          : undefined,
    },
  };
}

// Alert operations
export async function getAlerts(): Promise<AlertType[]> {
  const { data, error } = await supabase
    .from("alerts")
    .select("*")
    .order("timestamp", { ascending: false });

  if (error) {
    console.error("Error fetching alerts:", error);
    throw error;
  }

  return data.map((alert) => ({
    id: alert.id,
    patientId: alert.patient_id,
    type: alert.type,
    message: alert.message,
    timestamp: alert.timestamp,
    severity: alert.severity,
  }));
}

export async function createAlert(
  alert: Omit<AlertType, "id">
): Promise<AlertType> {
  const { data, error } = await supabase
    .from("alerts")
    .insert({
      patient_id: alert.patientId,
      type: alert.type,
      message: alert.message,
      severity: alert.severity,
      timestamp: alert.timestamp,
    })
    .select()
    .single();

  if (error) {
    console.error("Error creating alert:", error);
    throw error;
  }

  return {
    id: data.id,
    patientId: data.patient_id,
    type: data.type,
    message: data.message,
    timestamp: data.timestamp,
    severity: data.severity,
  };
}

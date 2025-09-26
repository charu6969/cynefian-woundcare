import React, { useState, useRef, useEffect } from "react";
import { Camera, Upload, Loader2 } from "lucide-react";
import { Button } from "./ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/Card";
import {
  analyzeWoundImage,
  processImageWithOverlay,
} from "../lib/aiAnalysis.ts";
import { WoundAnalysis, Patient } from "../types";
import { supabase } from "../lib/supabaseClient"; // ✅ use Supabase client directly

export function PatientUpload() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<WoundAnalysis | null>(null);
  const [processedImageUrl, setProcessedImageUrl] = useState<string | null>(
    null
  );
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [selectedPatientId, setSelectedPatientId] = useState<string>("");
  const [loading, setLoading] = useState(true);

  // ✅ Load patients from Supabase
  useEffect(() => {
    const loadPatients = async () => {
      try {
        const { data, error } = await supabase.from("patients").select("*");
        if (error) throw error;
        setPatients(data || []);
        if (data && data.length > 0) {
          setSelectedPatientId(data[0].id);
        }
      } catch (error) {
        console.error("Error loading patients:", error);
      } finally {
        setLoading(false);
      }
    };
    loadPatients();
  }, []);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith("image/")) {
      setSelectedFile(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      setAnalysis(null);
      setProcessedImageUrl(null);
    }
  };

  const handleCameraCapture = () => {
    if (fileInputRef.current) {
      fileInputRef.current.setAttribute("capture", "environment");
      fileInputRef.current.click();
    }
  };

  const handleUpload = async () => {
    if (!selectedFile || !selectedPatientId) return;

    setIsAnalyzing(true);
    try {
      // 1. Run AI analysis
      const result = await analyzeWoundImage(selectedFile);
      setAnalysis(result);

      // 2. Process image with overlay
      const processed = await processImageWithOverlay(selectedFile);
      setProcessedImageUrl(processed);

      // 3. Upload photo to Supabase Storage
      const filePath = `${Date.now()}_${selectedFile.name}`;
      const { error: uploadError } = await supabase.storage
        .from("wound-images") // ✅ bucket name in Supabase
        .upload(filePath, selectedFile);

      if (uploadError) throw uploadError;

      // 4. Get public URL
      const {
        data: { publicUrl },
      } = supabase.storage.from("wound-images").getPublicUrl(filePath);

      // 5. Save wound record in Supabase
      const { error: dbError } = await supabase.from("wound_records").insert([
        {
          patient_id: selectedPatientId,
          image_url: publicUrl,
          processed_image_url: processed,
          timestamp: new Date().toISOString(),
          analysis: result,
        },
      ]);

      if (dbError) throw dbError;

      console.log("✅ Wound record saved successfully!");
    } catch (error) {
      console.error("Analysis failed:", error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  const getRednessColor = (level: string) => {
    switch (level) {
      case "low":
        return "bg-green-100 text-green-800";
      case "medium":
        return "bg-yellow-100 text-yellow-800";
      case "high":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading patients...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Wound Progress Tracker
          </h1>
          <p className="text-gray-600">
            Take a photo of your wound for AI-powered healing analysis
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Upload Wound Photo</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {patients.length > 0 && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Patient
                </label>
                <select
                  value={selectedPatientId}
                  onChange={(e) => setSelectedPatientId(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {patients.map((patient) => (
                    <option key={patient.id} value={patient.id}>
                      {patient.name} - {patient.condition}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* File input */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              className="hidden"
            />

            {!previewUrl ? (
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center">
                <div className="space-y-4">
                  <div className="mx-auto w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                    <Camera className="w-6 h-6 text-gray-600" />
                  </div>
                  <div>
                    <p className="text-lg font-medium text-gray-900">
                      Take or upload a photo
                    </p>
                    <p className="text-gray-500">
                      Ensure good lighting and clear visibility of the wound
                    </p>
                  </div>
                  <div className="flex gap-4 justify-center">
                    <Button onClick={handleCameraCapture} size="lg">
                      <Camera className="w-5 h-5 mr-2" />
                      Use Camera
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => fileInputRef.current?.click()}
                      size="lg"
                    >
                      <Upload className="w-5 h-5 mr-2" />
                      Choose File
                    </Button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="relative">
                  <img
                    src={previewUrl}
                    alt="Wound preview"
                    className="w-full h-64 object-cover rounded-lg"
                  />
                </div>

                <div className="flex gap-3">
                  <Button
                    onClick={handleUpload}
                    disabled={isAnalyzing || !selectedPatientId}
                    className="flex-1"
                    size="lg"
                  >
                    {isAnalyzing ? (
                      <>
                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                        Analyzing...
                      </>
                    ) : (
                      "Analyze Wound"
                    )}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setSelectedFile(null);
                      setPreviewUrl(null);
                      setAnalysis(null);
                      setProcessedImageUrl(null);
                    }}
                    size="lg"
                  >
                    Retake
                  </Button>
                </div>
              </div>
            )}

            {/* ✅ Show AI analysis */}
            {analysis && (
              <Card className="bg-blue-50 border-blue-200">
                <CardContent className="p-6">
                  <h3 className="font-semibold text-lg mb-4">
                    Analysis Results
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div className="text-center">
                      <div
                        className={`text-2xl font-bold ${getScoreColor(
                          analysis.healingScore
                        )}`}
                      >
                        {analysis.healingScore}%
                      </div>
                      <div className="text-sm text-gray-600">Healing Score</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-gray-900">
                        {analysis.woundArea}px²
                      </div>
                      <div className="text-sm text-gray-600">Wound Area</div>
                    </div>
                    <div className="text-center">
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getRednessColor(
                          analysis.rednessLevel
                        )}`}
                      >
                        {analysis.rednessLevel} inflammation
                      </span>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium mb-2">Recommendations</h4>
                    <ul className="space-y-1 text-sm text-gray-700">
                      {analysis.recommendations.map((rec, index) => (
                        <li key={index} className="flex items-start">
                          <span className="text-blue-600 mr-2">•</span>
                          {rec}
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>
            )}
          </CardContent>
        </Card>

        <div className="mt-8 text-center text-sm text-gray-500">
          <p>
            Your data is secure and only shared with your healthcare provider
          </p>
          {patients.length === 0 && (
            <p className="mt-2 text-red-500">
              No patients found. Please contact your healthcare provider to set
              up your account.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

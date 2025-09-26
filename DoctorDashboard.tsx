import React, { useState } from "react";
import { useEffect } from "react";
import {
  Users,
  TrendingUp,
  AlertTriangle,
  Calendar,
  Clock,
  Activity,
  Eye,
  ArrowLeft,
} from "lucide-react";
import { Button } from "./ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/Card";
import { Badge } from "./ui/Badge";
import { AddPatientModal } from "./AddPatientModal";
import { AnalyticsModal } from "./AnalyticsModal";
import { Patient, WoundRecord } from "../types";
import { formatDate, calculateDaysSince } from "../lib/utils";
import {
  getPatients,
  getWoundRecords,
  getAlerts,
  createPatient,
} from "../lib/database";
import type { AlertType } from "../types";

export function DoctorDashboard() {
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [selectedRecord, setSelectedRecord] = useState<WoundRecord | null>(
    null
  );
  const [patients, setPatients] = useState<Patient[]>([]);
  const [woundRecords, setWoundRecords] = useState<WoundRecord[]>([]);
  const [alerts, setAlerts] = useState<AlertType[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddPatient, setShowAddPatient] = useState(false);
  const [showAnalytics, setShowAnalytics] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [patientsData, recordsData, alertsData] = await Promise.all([
        getPatients(),
        getWoundRecords(),
        getAlerts(),
      ]);

      setPatients(patientsData);
      setWoundRecords(recordsData);
      setAlerts(alertsData);
    } catch (error) {
      console.error("Error loading data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddPatient = async (patientData: {
    name: string;
    age: number;
    condition: string;
    dateOfInjury: string;
  }) => {
    try {
      await createPatient({
        name: patientData.name,
        age: patientData.age,
        condition: patientData.condition,
        dateOfInjury: patientData.dateOfInjury,
      });
      await loadData(); // Refresh data
    } catch (error) {
      console.error("Error adding patient:", error);
    }
  };

  const getPatientRecords = (patientId: string) => {
    return woundRecords.filter((record) => record.patientId === patientId);
  };

  const getLatestScore = (patientId: string) => {
    const records = getPatientRecords(patientId);
    return records.length > 0
      ? records[records.length - 1].analysis.healingScore
      : 0;
  };

  const getTrendColor = (trend?: string) => {
    switch (trend) {
      case "improving":
        return "text-green-600";
      case "concerning":
        return "text-red-600";
      default:
        return "text-yellow-600";
    }
  };

  const getScoreVariant = (score: number) => {
    if (score >= 80) return "success";
    if (score >= 60) return "warning";
    return "error";
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (selectedRecord) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4">
          <div className="mb-6">
            <Button
              variant="outline"
              onClick={() => setSelectedRecord(null)}
              className="mb-4"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Patient
            </Button>
            <h1 className="text-2xl font-bold text-gray-900">
              Wound Analysis - {selectedPatient?.name}
            </h1>
            <p className="text-gray-600">
              {formatDate(selectedRecord.timestamp)}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Original Image</CardTitle>
              </CardHeader>
              <CardContent>
                <img
                  src={selectedRecord.imageUrl}
                  alt="Wound"
                  className="w-full h-64 object-cover rounded-lg"
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>AI Analysis Overlay</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="relative">
                  <img
                    src={
                      selectedRecord.processedImageUrl ||
                      selectedRecord.imageUrl
                    }
                    alt="Processed wound"
                    className="w-full h-64 object-cover rounded-lg"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-20 rounded-lg flex items-center justify-center">
                    <div className="text-white text-center">
                      <div className="w-32 h-20 border-2 border-green-400 rounded-lg mb-2"></div>
                      <p className="text-sm font-medium">
                        Detected Wound Boundary
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardContent className="p-6 text-center">
                <div className="text-3xl font-bold text-blue-600 mb-2">
                  {selectedRecord.analysis.healingScore}%
                </div>
                <p className="text-gray-600">Healing Score</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 text-center">
                <div className="text-3xl font-bold text-gray-900 mb-2">
                  {selectedRecord.analysis.woundArea}
                </div>
                <p className="text-gray-600">Area (px²)</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 text-center">
                <Badge
                  variant={
                    selectedRecord.analysis.rednessLevel === "low"
                      ? "success"
                      : selectedRecord.analysis.rednessLevel === "medium"
                      ? "warning"
                      : "error"
                  }
                  className="text-lg px-4 py-2"
                >
                  {selectedRecord.analysis.rednessLevel} inflammation
                </Badge>
              </CardContent>
            </Card>
          </div>

          {selectedRecord.analysis.changeFromPrevious && (
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Progress Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Area Change</p>
                    <p
                      className={`text-lg font-semibold ${
                        selectedRecord.analysis.changeFromPrevious.areaChange <
                        0
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      {selectedRecord.analysis.changeFromPrevious.areaChange > 0
                        ? "+"
                        : ""}
                      {selectedRecord.analysis.changeFromPrevious.areaChange}%
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Score Change</p>
                    <p
                      className={`text-lg font-semibold ${
                        selectedRecord.analysis.changeFromPrevious.scoreChange >
                        0
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      {selectedRecord.analysis.changeFromPrevious.scoreChange >
                      0
                        ? "+"
                        : ""}
                      {selectedRecord.analysis.changeFromPrevious.scoreChange}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Overall Trend</p>
                    <p
                      className={`text-lg font-semibold capitalize ${getTrendColor(
                        selectedRecord.analysis.changeFromPrevious.trend
                      )}`}
                    >
                      {selectedRecord.analysis.changeFromPrevious.trend}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          <Card className="mt-6">
            <CardHeader>
              <CardTitle>AI Recommendations</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {selectedRecord.analysis.recommendations.map((rec, index) => (
                  <li key={index} className="flex items-start">
                    <span className="text-blue-600 mr-2 mt-1">•</span>
                    <span>{rec}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (selectedPatient) {
    const records = getPatientRecords(selectedPatient.id);
    const latestScore = getLatestScore(selectedPatient.id);

    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-6xl mx-auto px-4">
          <div className="mb-6">
            <Button
              variant="outline"
              onClick={() => setSelectedPatient(null)}
              className="mb-4"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  {selectedPatient.name}
                </h1>
                <p className="text-gray-600">
                  Age {selectedPatient.age} • {selectedPatient.condition}
                </p>
                <p className="text-sm text-gray-500">
                  Injury date: {formatDate(selectedPatient.dateOfInjury)}(
                  {calculateDaysSince(selectedPatient.dateOfInjury)} days ago)
                </p>
              </div>
              <Badge
                variant={getScoreVariant(latestScore)}
                className="text-lg px-4 py-2"
              >
                Current Score: {latestScore}%
              </Badge>
            </div>
          </div>

          {/* Progress Chart Placeholder */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Healing Progress Timeline</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <TrendingUp className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-500">
                    Interactive healing chart would go here
                  </p>
                  <p className="text-sm text-gray-400">
                    Showing {records.length} data points
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Wound Records */}
          <Card>
            <CardHeader>
              <CardTitle>Wound Photos & Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {records.map((record) => (
                  <div
                    key={record.id}
                    className="border rounded-lg p-4 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-start gap-4">
                      <img
                        src={record.imageUrl}
                        alt="Wound"
                        className="w-20 h-20 object-cover rounded-lg"
                      />
                      <div className="flex-1">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <p className="font-medium">
                              {formatDate(record.timestamp)}
                            </p>
                            <p className="text-sm text-gray-600">
                              Score: {record.analysis.healingScore}% • Area:{" "}
                              {record.analysis.woundArea}px² •
                              {record.analysis.rednessLevel} inflammation
                            </p>
                          </div>
                          {record.analysis.changeFromPrevious && (
                            <Badge
                              variant={
                                record.analysis.changeFromPrevious.trend ===
                                "improving"
                                  ? "success"
                                  : record.analysis.changeFromPrevious.trend ===
                                    "concerning"
                                  ? "error"
                                  : "default"
                              }
                            >
                              {record.analysis.changeFromPrevious.trend}
                            </Badge>
                          )}
                        </div>
                        <div className="flex justify-between items-center">
                          <p className="text-sm text-gray-600">
                            {record.analysis.recommendations[0]}
                          </p>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setSelectedRecord(record)}
                          >
                            <Eye className="w-4 h-4 mr-1" />
                            View Details
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-gray-900">
            Cynefian WoundCare AI
          </h1>
          <p className="text-gray-600">
            AI-Assisted Wound Healing Monitoring Dashboard
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Patients</p>
                  <p className="text-3xl font-bold text-gray-900">
                    {patients.length}
                  </p>
                </div>
                <Users className="w-8 h-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Active Cases</p>
                  <p className="text-3xl font-bold text-gray-900">
                    {patients.filter((p) => p.lastUpload).length}
                  </p>
                </div>
                <Activity className="w-8 h-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Pending Reviews</p>
                  <p className="text-3xl font-bold text-gray-900">2</p>
                </div>
                <Clock className="w-8 h-8 text-yellow-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Alerts</p>
                  <p className="text-3xl font-bold text-gray-900">
                    {alerts.length}
                  </p>
                </div>
                <AlertTriangle className="w-8 h-8 text-red-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Patients List */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Patient Overview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {patients.map((patient) => {
                    const latestScore = getLatestScore(patient.id);
                    const records = getPatientRecords(patient.id);
                    const latestRecord = records[records.length - 1];

                    return (
                      <div
                        key={patient.id}
                        className="border rounded-lg p-4 hover:bg-gray-50 transition-colors cursor-pointer"
                        onClick={() => setSelectedPatient(patient)}
                      >
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h3 className="font-semibold text-gray-900">
                              {patient.name}
                            </h3>
                            <p className="text-sm text-gray-600">
                              Age {patient.age} • {patient.condition}
                            </p>
                          </div>
                          <Badge variant={getScoreVariant(latestScore)}>
                            {latestScore}% healed
                          </Badge>
                        </div>

                        <div className="flex items-center justify-between text-sm text-gray-500">
                          <div className="flex items-center gap-4">
                            <span className="flex items-center">
                              <Calendar className="w-4 h-4 mr-1" />
                              {calculateDaysSince(patient.dateOfInjury)} days
                            </span>
                            {patient.lastUpload && (
                              <span className="flex items-center">
                                <Clock className="w-4 h-4 mr-1" />
                                Last upload: {formatDate(patient.lastUpload)}
                              </span>
                            )}
                          </div>

                          {latestRecord?.analysis.changeFromPrevious && (
                            <span
                              className={getTrendColor(
                                latestRecord.analysis.changeFromPrevious.trend
                              )}
                            >
                              <TrendingUp className="w-4 h-4 inline mr-1" />
                              {latestRecord.analysis.changeFromPrevious.trend}
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Alerts Sidebar */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <AlertTriangle className="w-5 h-5 mr-2 text-red-600" />
                  Recent Alerts
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {alerts.map((alert) => {
                    const patient = patients.find(
                      (p) => p.id === alert.patientId
                    );
                    return (
                      <div
                        key={alert.id}
                        className="border-l-4 border-yellow-500 pl-4 py-2"
                      >
                        <p className="font-medium text-sm">{patient?.name}</p>
                        <p className="text-sm text-gray-600">{alert.message}</p>
                        <p className="text-xs text-gray-500">
                          {formatDate(alert.timestamp)}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button
                  className="w-full justify-start"
                  onClick={() => setShowAddPatient(true)}
                >
                  <Users className="w-4 h-4 mr-2" />
                  Add New Patient
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => setShowAnalytics(true)}
                >
                  <TrendingUp className="w-4 h-4 mr-2" />
                  View Analytics
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Calendar className="w-4 h-4 mr-2" />
                  Schedule Reviews
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <AddPatientModal
        isOpen={showAddPatient}
        onClose={() => setShowAddPatient(false)}
        onSubmit={handleAddPatient}
      />

      <AnalyticsModal
        isOpen={showAnalytics}
        onClose={() => setShowAnalytics(false)}
        patients={patients}
        woundRecords={woundRecords}
        alerts={alerts}
      />
    </div>
  );
}

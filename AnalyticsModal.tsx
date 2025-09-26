import React from "react";
import {
  X,
  TrendingUp,
  Users,
  Activity,
  AlertTriangle,
  Calendar,
  BarChart3,
} from "lucide-react";
import { Button } from "./ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/Card";
import { Badge } from "./ui/Badge";
import { Patient, WoundRecord, AlertType } from "../types";

interface AnalyticsModalProps {
  isOpen: boolean;
  onClose: () => void;
  patients: Patient[];
  woundRecords: WoundRecord[];
  alerts: AlertType[];
}

export function AnalyticsModal({
  isOpen,
  onClose,
  patients,
  woundRecords,
  alerts,
}: AnalyticsModalProps) {
  if (!isOpen) return null;

  // Calculate analytics
  const totalPatients = patients.length;
  const activePatients = patients.filter((p) => p.lastUpload).length;
  const totalRecords = woundRecords.length;
  const averageHealingScore =
    woundRecords.length > 0
      ? Math.round(
          woundRecords.reduce(
            (sum, record) => sum + record.analysis.healingScore,
            0
          ) / woundRecords.length
        )
      : 0;

  // Healing trends
  const improvingPatients = woundRecords.filter(
    (r) => r.analysis.changeFromPrevious?.trend === "improving"
  ).length;
  const stablePatients = woundRecords.filter(
    (r) => r.analysis.changeFromPrevious?.trend === "stable"
  ).length;
  const concerningPatients = woundRecords.filter(
    (r) => r.analysis.changeFromPrevious?.trend === "concerning"
  ).length;

  // Alert statistics
  const highSeverityAlerts = alerts.filter((a) => a.severity === "high").length;
  const mediumSeverityAlerts = alerts.filter(
    (a) => a.severity === "medium"
  ).length;
  const lowSeverityAlerts = alerts.filter((a) => a.severity === "low").length;

  // Recent activity (last 7 days)
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
  const recentRecords = woundRecords.filter(
    (r) => new Date(r.timestamp) >= sevenDaysAgo
  );

  // Condition breakdown
  const conditionCounts = patients.reduce((acc, patient) => {
    acc[patient.condition] = (acc[patient.condition] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between">
          <div className="flex items-center">
            <BarChart3 className="w-6 h-6 mr-2 text-blue-600" />
            <h2 className="text-xl font-bold text-gray-900">
              Analytics Dashboard
            </h2>
          </div>
          <Button variant="outline" size="sm" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </div>

        <div className="p-6 space-y-6">
          {/* Overview Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4 text-center">
                <Users className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-gray-900">
                  {totalPatients}
                </div>
                <div className="text-sm text-gray-600">Total Patients</div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4 text-center">
                <Activity className="w-8 h-8 text-green-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-gray-900">
                  {activePatients}
                </div>
                <div className="text-sm text-gray-600">Active Patients</div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4 text-center">
                <TrendingUp className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-gray-900">
                  {averageHealingScore}%
                </div>
                <div className="text-sm text-gray-600">Avg Healing Score</div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4 text-center">
                <AlertTriangle className="w-8 h-8 text-red-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-gray-900">
                  {alerts.length}
                </div>
                <div className="text-sm text-gray-600">Active Alerts</div>
              </CardContent>
            </Card>
          </div>

          {/* Healing Trends */}
          <Card>
            <CardHeader>
              <CardTitle>Healing Trends</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">
                    {improvingPatients}
                  </div>
                  <div className="text-sm text-gray-600">Improving</div>
                </div>
                <div className="text-center p-4 bg-yellow-50 rounded-lg">
                  <div className="text-2xl font-bold text-yellow-600">
                    {stablePatients}
                  </div>
                  <div className="text-sm text-gray-600">Stable</div>
                </div>
                <div className="text-center p-4 bg-red-50 rounded-lg">
                  <div className="text-2xl font-bold text-red-600">
                    {concerningPatients}
                  </div>
                  <div className="text-sm text-gray-600">Concerning</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Alert Breakdown */}
          <Card>
            <CardHeader>
              <CardTitle>Alert Severity Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">High Severity</span>
                  <Badge variant="error">{highSeverityAlerts} alerts</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Medium Severity</span>
                  <Badge variant="warning">{mediumSeverityAlerts} alerts</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Low Severity</span>
                  <Badge variant="success">{lowSeverityAlerts} alerts</Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Calendar className="w-5 h-5 mr-2" />
                Recent Activity (Last 7 Days)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center p-4">
                <div className="text-3xl font-bold text-blue-600 mb-2">
                  {recentRecords.length}
                </div>
                <div className="text-gray-600">New wound assessments</div>
              </div>
            </CardContent>
          </Card>

          {/* Condition Breakdown */}
          <Card>
            <CardHeader>
              <CardTitle>Patient Conditions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {Object.entries(conditionCounts).map(([condition, count]) => (
                  <div
                    key={condition}
                    className="flex items-center justify-between"
                  >
                    <span className="text-sm text-gray-700">{condition}</span>
                    <Badge variant="default">
                      {count} patient{count !== 1 ? "s" : ""}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Performance Metrics */}
          <Card>
            <CardHeader>
              <CardTitle>System Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <div className="text-sm text-gray-600 mb-1">
                    Total Assessments
                  </div>
                  <div className="text-2xl font-bold text-gray-900">
                    {totalRecords}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-gray-600 mb-1">
                    Average Processing Time
                  </div>
                  <div className="text-2xl font-bold text-gray-900">2.3s</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

import { useState } from "react";
import { Shield, Stethoscope, Camera } from "lucide-react";
import { Button } from "./components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "./components/ui/Card";
import { PatientUpload } from "./components/PatientUpload";
import { DoctorDashboard } from "./components/DoctorDashboard";

type ViewMode = "home" | "patient" | "doctor";

function App() {
  const [currentView, setCurrentView] = useState<ViewMode>("home");

  const renderCurrentView = () => {
    switch (currentView) {
      case "patient":
        return <PatientUpload />;
      case "doctor":
        return <DoctorDashboard />;
      default:
        return <HomePage onNavigate={setCurrentView} />;
    }
  };

  return renderCurrentView();
}

function HomePage({ onNavigate }: { onNavigate: (view: ViewMode) => void }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-teal-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Cynefian WoundCare AI
                </h1>
                <p className="text-sm text-gray-600">
                  AI-Assisted Wound Healing Monitoring
                </p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-6">
            Revolutionary Wound Care Technology
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Advanced AI-powered wound monitoring system that enables precise
            healing tracking, early intervention alerts, and improved patient
            outcomes through intelligent image analysis.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              onClick={() => onNavigate("patient")}
              size="lg"
              className="px-8 py-4 text-lg"
            >
              <Camera className="w-6 h-6 mr-2" />
              Patient Upload
            </Button>
            <Button
              onClick={() => onNavigate("doctor")}
              variant="outline"
              size="lg"
              className="px-8 py-4 text-lg"
            >
              <Stethoscope className="w-6 h-6 mr-2" />
              Doctor Dashboard
            </Button>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <Card className="border-none shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader className="text-center pb-4">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Camera className="w-8 h-8 text-blue-600" />
              </div>
              <CardTitle>Smart Image Analysis</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-gray-600">
                Advanced computer vision algorithms analyze wound photos to
                detect boundaries, measure healing progress, and identify
                potential complications.
              </p>
            </CardContent>
          </Card>

          <Card className="border-none shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader className="text-center pb-4">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-green-600" />
              </div>
              <CardTitle>Explainable AI</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-gray-600">
                Transparent AI decisions with visual overlays and clear
                explanations, helping healthcare providers understand and trust
                the analysis results.
              </p>
            </CardContent>
          </Card>

          <Card className="border-none shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader className="text-center pb-4">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Stethoscope className="w-8 h-8 text-purple-600" />
              </div>
              <CardTitle>Remote Monitoring</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-gray-600">
                Enable continuous patient monitoring from anywhere, with
                automated alerts for healthcare providers when intervention may
                be needed.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Key Benefits */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-16">
          <h3 className="text-3xl font-bold text-center text-gray-900 mb-8">
            Transforming Wound Care Management
          </h3>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div>
              <h4 className="text-xl font-semibold text-gray-900 mb-4">
                For Patients
              </h4>
              <ul className="space-y-3 text-gray-600">
                <li className="flex items-start">
                  <span className="text-blue-600 mr-3 mt-1">✓</span>
                  Easy photo capture with smartphone camera
                </li>
                <li className="flex items-start">
                  <span className="text-blue-600 mr-3 mt-1">✓</span>
                  Instant healing progress feedback
                </li>
                <li className="flex items-start">
                  <span className="text-blue-600 mr-3 mt-1">✓</span>
                  Personalized care recommendations
                </li>
                <li className="flex items-start">
                  <span className="text-blue-600 mr-3 mt-1">✓</span>
                  Reduced clinic visits for routine monitoring
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-xl font-semibold text-gray-900 mb-4">
                For Healthcare Providers
              </h4>
              <ul className="space-y-3 text-gray-600">
                <li className="flex items-start">
                  <span className="text-green-600 mr-3 mt-1">✓</span>
                  Objective wound assessment metrics
                </li>
                <li className="flex items-start">
                  <span className="text-green-600 mr-3 mt-1">✓</span>
                  Early detection of complications
                </li>
                <li className="flex items-start">
                  <span className="text-green-600 mr-3 mt-1">✓</span>
                  Comprehensive patient progress tracking
                </li>
                <li className="flex items-start">
                  <span className="text-green-600 mr-3 mt-1">✓</span>
                  Efficient remote patient management
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center bg-blue-600 text-white rounded-2xl p-12">
          <h3 className="text-3xl font-bold mb-4">
            Ready to Experience the Future of Wound Care?
          </h3>
          <p className="text-xl mb-8 opacity-90">
            Join the revolution in AI-assisted healthcare monitoring
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              onClick={() => onNavigate("patient")}
              variant="secondary"
              size="lg"
              className="px-8 py-4 text-lg bg-white text-blue-600 hover:bg-gray-100"
            >
              Start Patient Journey
            </Button>
            <Button
              onClick={() => onNavigate("doctor")}
              variant="outline"
              size="lg"
              className="px-8 py-4 text-lg border-white text-white hover:bg-white hover:text-blue-600"
            >
              Access Doctor Portal
            </Button>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t mt-16">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="text-center text-gray-600">
            <p className="mb-2">
              © 2024 Cynefian WoundCare AI - Hackathon MVP Demonstration
            </p>
            <p className="text-sm">
              This is a proof-of-concept application showcasing AI-powered wound
              monitoring capabilities.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;

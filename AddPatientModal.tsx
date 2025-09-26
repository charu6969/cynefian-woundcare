import React, { useState } from "react";
import { X, User, Calendar, FileText } from "lucide-react";
import { Button } from "./ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/Card";

interface AddPatientModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (patient: {
    name: string;
    age: number;
    condition: string;
    dateOfInjury: string;
  }) => void;
}

export function AddPatientModal({
  isOpen,
  onClose,
  onSubmit,
}: AddPatientModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    age: "",
    condition: "",
    dateOfInjury: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  if (!isOpen) return null;

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = "Patient name is required";
    }

    if (
      !formData.age ||
      parseInt(formData.age) < 1 ||
      parseInt(formData.age) > 120
    ) {
      newErrors.age = "Please enter a valid age (1-120)";
    }

    if (!formData.condition.trim()) {
      newErrors.condition = "Medical condition is required";
    }

    if (!formData.dateOfInjury) {
      newErrors.dateOfInjury = "Date of injury is required";
    } else {
      const injuryDate = new Date(formData.dateOfInjury);
      const today = new Date();
      if (injuryDate > today) {
        newErrors.dateOfInjury = "Date of injury cannot be in the future";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (validateForm()) {
      onSubmit({
        name: formData.name.trim(),
        age: parseInt(formData.age),
        condition: formData.condition.trim(),
        dateOfInjury: formData.dateOfInjury,
      });

      // Reset form
      setFormData({
        name: "",
        age: "",
        condition: "",
        dateOfInjury: "",
      });
      setErrors({});
      onClose();
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="flex flex-row items-center justify-between pb-4">
          <CardTitle className="flex items-center">
            <User className="w-5 h-5 mr-2 text-blue-600" />
            Add New Patient
          </CardTitle>
          <Button variant="outline" size="sm" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Patient Name *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleChange("name", e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.name ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="Enter patient's full name"
              />
              {errors.name && (
                <p className="text-red-500 text-xs mt-1">{errors.name}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Age *
              </label>
              <input
                type="number"
                value={formData.age}
                onChange={(e) => handleChange("age", e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.age ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="Enter age"
                min="1"
                max="120"
              />
              {errors.age && (
                <p className="text-red-500 text-xs mt-1">{errors.age}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Medical Condition *
              </label>
              <select
                value={formData.condition}
                onChange={(e) => handleChange("condition", e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.condition ? "border-red-500" : "border-gray-300"
                }`}
              >
                <option value="">Select condition</option>
                <option value="Diabetic foot ulcer">Diabetic foot ulcer</option>
                <option value="Post-surgical wound">Post-surgical wound</option>
                <option value="Pressure ulcer">Pressure ulcer</option>
                <option value="Venous leg ulcer">Venous leg ulcer</option>
                <option value="Arterial ulcer">Arterial ulcer</option>
                <option value="Traumatic wound">Traumatic wound</option>
                <option value="Burn wound">Burn wound</option>
                <option value="Other">Other</option>
              </select>
              {errors.condition && (
                <p className="text-red-500 text-xs mt-1">{errors.condition}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Date of Injury *
              </label>
              <input
                type="date"
                value={formData.dateOfInjury}
                onChange={(e) => handleChange("dateOfInjury", e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.dateOfInjury ? "border-red-500" : "border-gray-300"
                }`}
                max={new Date().toISOString().split("T")[0]}
              />
              {errors.dateOfInjury && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.dateOfInjury}
                </p>
              )}
            </div>

            <div className="flex gap-3 pt-4">
              <Button type="submit" className="flex-1">
                <User className="w-4 h-4 mr-2" />
                Add Patient
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                className="flex-1"
              >
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

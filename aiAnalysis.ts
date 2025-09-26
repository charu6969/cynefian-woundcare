import { WoundAnalysis, WoundRecord } from "../types";

// Simulated AI analysis - in production, this would call your ML model
export function analyzeWoundImage(
  imageFile: File,
  previousRecords: WoundRecord[] = []
): Promise<WoundAnalysis> {
  return new Promise((resolve) => {
    // Simulate processing time
    setTimeout(() => {
      // Simulate AI analysis results
      const baseArea = 1000;
      const randomVariation = Math.random() * 0.3 + 0.7; // 0.7 to 1.0
      const woundArea = Math.round(baseArea * randomVariation);

      // Calculate healing score based on area and time
      const daysSinceFirst =
        previousRecords.length > 0
          ? Math.max(
              1,
              (Date.now() - new Date(previousRecords[0].timestamp).getTime()) /
                (1000 * 60 * 60 * 24)
            )
          : 1;

      const expectedHealing = Math.min(95, 50 + daysSinceFirst * 5);
      const healingScore = Math.max(
        20,
        Math.min(100, Math.round(expectedHealing + (Math.random() * 20 - 10)))
      );

      // Determine redness level
      let rednessLevel: "low" | "medium" | "high" = "medium";
      if (healingScore > 80) rednessLevel = "low";
      else if (healingScore < 60) rednessLevel = "high";

      // Generate recommendations
      const recommendations = generateRecommendations(
        healingScore,
        rednessLevel
      );

      // Calculate change from previous
      let changeFromPrevious;
      if (previousRecords.length > 0) {
        const lastRecord = previousRecords[previousRecords.length - 1];
        const areaChange =
          ((woundArea - lastRecord.analysis.woundArea) /
            lastRecord.analysis.woundArea) *
          100;
        const scoreChange = healingScore - lastRecord.analysis.healingScore;

        let trend: "improving" | "stable" | "concerning" = "stable";
        if (scoreChange > 5 && areaChange < -10) trend = "improving";
        else if (scoreChange < -5 || areaChange > 10) trend = "concerning";

        changeFromPrevious = {
          areaChange: Math.round(areaChange * 10) / 10,
          scoreChange,
          trend,
        };
      }

      const analysis: WoundAnalysis = {
        woundArea,
        healingScore,
        rednessLevel,
        recommendations,
        changeFromPrevious,
      };

      resolve(analysis);
    }, 2000); // 2 second processing simulation
  });
}

function generateRecommendations(score: number, redness: string): string[] {
  const recommendations = [];

  if (score < 50) {
    recommendations.push("Consider consulting with wound care specialist");
    recommendations.push("Increase monitoring frequency");
  } else if (score < 70) {
    recommendations.push("Continue current treatment plan");
    recommendations.push("Monitor for signs of infection");
  } else {
    recommendations.push("Excellent healing progress");
    recommendations.push("Continue current care routine");
  }

  if (redness === "high") {
    recommendations.push(
      "High inflammation detected - consider antibiotic consultation"
    );
  } else if (redness === "medium") {
    recommendations.push(
      "Moderate inflammation - continue prescribed medications"
    );
  } else {
    recommendations.push("Low inflammation - wound healing well");
  }

  recommendations.push("Keep wound clean and dry");
  recommendations.push("Follow up as scheduled");

  return recommendations;
}

// Simulated image processing for overlays
export function processImageWithOverlay(imageFile: File): Promise<string> {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      // In a real implementation, this would:
      // 1. Load the image onto a canvas
      // 2. Run wound segmentation
      // 3. Draw boundary overlays
      // 4. Return the processed image as base64

      // For demo, we'll just return the original image
      resolve(e.target?.result as string);
    };
    reader.readAsDataURL(imageFile);
  });
}

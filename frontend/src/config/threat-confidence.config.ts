/**
 * Threat Confidence Configuration
 * Single Responsibility: Manages confidence levels and thresholds
 */

export interface ConfidenceLevel {
  min: number;
  max: number;
  label: string;
  color: string;
  bgColor: string;
  textColor: string;
}

export const confidenceLevels: ConfidenceLevel[] = [
  {
    min: 90,
    max: 100,
    label: "Very High",
    color: "green",
    bgColor: "bg-green-500",
    textColor: "text-green-400",
  },
  {
    min: 70,
    max: 89,
    label: "High",
    color: "cyan",
    bgColor: "bg-cyan-500",
    textColor: "text-cyan-400",
  },
  {
    min: 50,
    max: 69,
    label: "Medium",
    color: "yellow",
    bgColor: "bg-yellow-500",
    textColor: "text-yellow-400",
  },
  {
    min: 30,
    max: 49,
    label: "Low",
    color: "orange",
    bgColor: "bg-orange-500",
    textColor: "text-orange-400",
  },
  {
    min: 0,
    max: 29,
    label: "Very Low",
    color: "red",
    bgColor: "bg-red-500",
    textColor: "text-red-400",
  },
];

/**
 * Get confidence level configuration based on percentage
 */
export const getConfidenceLevel = (confidence: number): ConfidenceLevel => {
  return (
    confidenceLevels.find(
      (level) => confidence >= level.min && confidence <= level.max
    ) || confidenceLevels[confidenceLevels.length - 1]
  );
};

/**
 * Get confidence color for progress bar
 */
export const getConfidenceColor = (confidence: number): string => {
  return getConfidenceLevel(confidence).bgColor;
};

/**
 * Get confidence text color
 */
export const getConfidenceTextColor = (confidence: number): string => {
  return getConfidenceLevel(confidence).textColor;
};

/**
 * Check if confidence is above threshold
 */
export const isHighConfidence = (confidence: number): boolean => {
  return confidence >= 70;
};

/**
 * Format confidence percentage
 */
export const formatConfidence = (confidence: number): string => {
  return `${confidence}%`;
};

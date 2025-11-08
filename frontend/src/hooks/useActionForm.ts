"use client";

import { useState } from "react";

/**
 * Custom hook for managing action execution form state
 * Single Responsibility: Only handles form state and validation
 */
export const useActionForm = () => {
  const [formData, setFormData] = useState<Record<string, string>>({});

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const resetForm = () => {
    setFormData({});
  };

  const getFieldValue = (field: string): string => {
    return formData[field] || "";
  };

  const isFormValid = (requiredFields?: string[]): boolean => {
    if (!requiredFields || requiredFields.length === 0) return true;
    return requiredFields.every((field) => formData[field]?.trim().length > 0);
  };

  return {
    formData,
    handleChange,
    resetForm,
    getFieldValue,
    isFormValid,
  };
};

/**
 * Hook personalizado para gestionar feedback
 */

import { useState } from "react";
import { initialFeedbackData } from "../utils/constants.js";
import { submitInteractionFeedback } from "../utils/api.js";

export const useFeedback = () => {
  const [feedbackData, setFeedbackData] = useState(initialFeedbackData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const updateFeedbackField = (field, value) => {
    setFeedbackData((prevData) => ({
      ...prevData,
      [field]: value,
    }));
  };

  const handleSubmitFeedback = async (event) => {
    event?.preventDefault();
    
    try {
      setIsSubmitting(true);
      setSubmitError(null);
      setSubmitSuccess(false);

      await submitInteractionFeedback(feedbackData);
      
      setSubmitSuccess(true);
      // Reset form after 2 seconds
      setTimeout(() => {
        setFeedbackData(initialFeedbackData);
        setSubmitSuccess(false);
      }, 2000);
    } catch (error) {
      setSubmitError(error.message || "Error al enviar feedback");
      console.error("Error submitting feedback:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    feedbackData,
    updateFeedbackField,
    handleSubmitFeedback,
    isSubmitting,
    submitError,
    submitSuccess,
  };
};

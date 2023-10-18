"use client";
import React, { useState, useEffect } from "react";
import Typography from "@mui/material/Typography";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import FormLabel from "@mui/material/FormLabel";
import functionToIndicesMap from "../CognitiveMapping";

interface CognitiveIndicesStepProps {
  selectedCognitiveFunctions: Record<string, boolean>;
  selectedIndices: Record<string, boolean>;
  handleIndexChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  hasAttemptedNext: boolean;
}

const CognitiveIndicesStep: React.FC<CognitiveIndicesStepProps> = ({
  selectedCognitiveFunctions,
  selectedIndices,
  handleIndexChange,
  hasAttemptedNext,
}) => {
  const [errors, setErrors] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const newErrors: Record<string, boolean> = {};

    Object.entries(selectedCognitiveFunctions).forEach(
      ([functionName, isSelected]) => {
        if (isSelected) {
          newErrors[functionName] = !functionToIndicesMap[functionName].some(
            (index) => selectedIndices[index]
          );
        }
      }
    );

    setErrors(newErrors);
  }, [selectedIndices, selectedCognitiveFunctions]);

  return (
    <div>
      {Object.entries(selectedCognitiveFunctions)
        .filter(([, isSelected]) => isSelected)
        .map(([functionName]) => (
          <div key={functionName}>
            <Typography variant="h6" sx={{ marginTop: 2 }}>
              {functionName}
            </Typography>
            <FormLabel
              component="legend"
              error={hasAttemptedNext && errors[functionName]}
            >
              Sélectionnez au moins un indice *
            </FormLabel>

            <FormGroup>
              {functionToIndicesMap[functionName].map((index) => (
                <FormControlLabel
                  key={index}
                  control={
                    <Checkbox
                      checked={selectedIndices[index] || false}
                      onChange={handleIndexChange}
                      name={index}
                    />
                  }
                  label={index}
                />
              ))}
            </FormGroup>
          </div>
        ))}
    </div>
  );
};

export default CognitiveIndicesStep;

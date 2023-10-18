"use client";
import React, { useEffect, useState } from "react";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import FormLabel from "@mui/material/FormLabel";

interface CognitiveFunctionsStepProps {
  selectedCognitiveFunctions: Record<string, boolean>;
  handleFunctionChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  hasAttemptedNext: boolean;
}

const CognitiveFunctionsStep: React.FC<CognitiveFunctionsStepProps> = ({
  selectedCognitiveFunctions,
  handleFunctionChange,
  hasAttemptedNext,
}) => {
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    const error = !Object.values(selectedCognitiveFunctions).some(Boolean);
    setIsError(error);
  }, [selectedCognitiveFunctions]);

  return (
    <div>
      <FormLabel component="legend" error={hasAttemptedNext && isError}>
        Sélectionnez une fonction ou plus *
      </FormLabel>
      <FormGroup>
        {Object.keys(selectedCognitiveFunctions).map((functionName) => (
          <FormControlLabel
            key={functionName}
            control={
              <Checkbox
                checked={selectedCognitiveFunctions[functionName]}
                onChange={handleFunctionChange}
                name={functionName}
              />
            }
            label={functionName}
          />
        ))}
      </FormGroup>
    </div>
  );
};

export default CognitiveFunctionsStep;

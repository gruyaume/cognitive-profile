"use client";
import React from "react";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import functionToIndicesMap from "../CognitiveMapping";

interface CognitiveResultsStepProps {
  selectedCognitiveFunctions: Record<string, boolean>;
  selectedIndices: Record<string, boolean>;
  results: Record<string, number>;
  handleResultChange: (
    event: React.ChangeEvent<HTMLInputElement>,
    index: string
  ) => void;
}

const CognitiveResultsStep: React.FC<CognitiveResultsStepProps> = ({
  selectedCognitiveFunctions,
  selectedIndices,
  results,
  handleResultChange,
}) => (
  <div>
    {Object.entries(selectedCognitiveFunctions)
      .filter(([, isSelected]) => isSelected)
      .map(([functionName]) => (
        <div key={functionName}>
          <Typography variant="h6" sx={{ marginTop: 2 }}>
            {functionName}
          </Typography>
          <Box sx={{ display: "flex", flexWrap: "wrap" }}>
            {functionToIndicesMap[functionName].map((index) => {
              if (selectedIndices[index]) {
                return (
                  <Box sx={{ m: 1, width: "25ch" }} key={index}>
                    <Typography variant="body1" sx={{ marginBottom: 1 }}>
                      {index}
                    </Typography>
                    <TextField
                      label="Percentile"
                      type="number"
                      value={results[index] || ""}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        handleResultChange(e, index)
                      }
                      inputProps={{ min: 0, max: 100 }}
                      variant="outlined"
                      fullWidth
                      margin="normal"
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">%</InputAdornment>
                        ),
                      }}
                    />
                  </Box>
                );
              }
              return null;
            })}
          </Box>
        </div>
      ))}
  </div>
);

export default CognitiveResultsStep;

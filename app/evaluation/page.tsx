"use client";
import * as React from "react";
import Box from "@mui/material/Box";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import FormControl from "@mui/material/FormControl";

const functionToIndicesMap: Record<string, string[]> = {
  "Fonctionnement Intellectuel Global": ["Index 1", "Index 2"],
  "Fonctions exécutives": ["Index 3", "Index 4"],
  Abstractions: ["Index 5"],
  Attention: ["Index 6", "Index 7"],
  Language: ["Index 8", "Index 9"],
};

export default function HorizontalLinearStepper() {
  const [activeStep, setActiveStep] = React.useState(0);
  const [selectedCognitiveFunctions, setselectedCognitiveFunctions] =
    React.useState<Record<string, boolean>>({
      "Fonctionnement Intellectuel Global": false,
      "Fonctions exécutives": false,
      Abstractions: false,
      Attention: false,
      Language: false,
    });
  const [selectedIndices, setSelectedIndices] = React.useState<
    Record<string, boolean>
  >({});

  const handleFunctionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setselectedCognitiveFunctions((prev) => ({
      ...prev,
      [event.target.name]: event.target.checked,
    }));
  };

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleReset = () => {
    setActiveStep(0);
  };

  const handleIndexChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedIndices((prev) => ({
      ...prev,
      [event.target.name]: event.target.checked,
    }));
  };

  const cognitiveFunctionsContent = (
    <FormGroup>
      {Object.entries(selectedCognitiveFunctions).map(
        ([functionName, isSelected]) => (
          <FormControlLabel
            key={functionName}
            control={
              <Checkbox
                checked={isSelected}
                onChange={handleFunctionChange}
                name={functionName}
              />
            }
            label={functionName}
          />
        )
      )}
    </FormGroup>
  );

  const cognitiveIndicesContent = (
    <div>
      {Object.entries(selectedCognitiveFunctions)
        .filter(([, isSelected]) => isSelected)
        .map(([functionName]) => (
          <div key={functionName}>
            <Typography variant="h6" sx={{ marginTop: 2 }}>
              {functionName}
            </Typography>
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

  const cognitiveResultsContent = (
    <div>
      {Object.entries(selectedIndices)
        .filter(([, isSelected]) => isSelected)
        .map(([index]) => (
          <Box key={index} sx={{ m: 1, width: "25ch" }}>
            <Typography variant="body1" sx={{ marginBottom: 1 }}>
              {index}
            </Typography>
            <TextField
              label="Percentile"
              type="number"
              inputProps={{ min: 0, max: 100 }}
              variant="outlined"
              fullWidth
              margin="normal"
              InputProps={{
                endAdornment: <InputAdornment position="end">%</InputAdornment>,
              }}
            />
          </Box>
        ))}
    </div>
  );

  const steps = [
    {
      label: "Fonctions cognitives",
      getContent: () => cognitiveFunctionsContent,
    },
    {
      label: "Indices cognitifs",
      getContent: () => cognitiveIndicesContent,
    },
    {
      label: "Résultats",
      getContent: () => cognitiveResultsContent,
    },
  ];

  return (
    <Box sx={{ width: "100%" }}>
      <Stepper activeStep={activeStep}>
        {steps.map((step) => (
          <Step key={step.label}>
            <StepLabel>{step.label}</StepLabel>
          </Step>
        ))}
      </Stepper>
      {activeStep < steps.length && (
        <Typography sx={{ mt: 2 }}>{steps[activeStep].getContent()}</Typography>
      )}
      {activeStep === steps.length ? (
        <React.Fragment>
          <Typography sx={{ mt: 2, mb: 1 }}>
            Toutes les étapes sont complétées!
          </Typography>
          <Box sx={{ display: "flex", flexDirection: "row", pt: 2 }}>
            <Box sx={{ flex: "1 1 auto" }} />
            <Button onClick={handleReset}>Recommencer</Button>
          </Box>
        </React.Fragment>
      ) : (
        <React.Fragment>
          <Typography sx={{ mt: 2, mb: 1 }}>Étape {activeStep + 1}</Typography>
          <Box sx={{ display: "flex", flexDirection: "row", pt: 2 }}>
            <Button
              color="inherit"
              disabled={activeStep === 0}
              onClick={handleBack}
              sx={{ mr: 1 }}
            >
              Retour
            </Button>
            <Box sx={{ flex: "1 1 auto" }} />

            <Button onClick={handleNext}>
              {activeStep === steps.length - 1 ? "Terminer" : "Suivant"}
            </Button>
          </Box>
        </React.Fragment>
      )}
    </Box>
  );
}

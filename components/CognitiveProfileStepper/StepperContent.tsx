"use client";
import React, { useState, useCallback, useMemo } from "react";
import Box from "@mui/material/Box";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";

import CognitiveChart from "@/components/CognitiveChart";
import functionToIndicesMap from "@/components/CognitiveMapping";
import IdentificationStep from "@/components/CognitiveProfileStepper/IdentificationStep";
import CognitiveFunctionsStep from "@/components/CognitiveProfileStepper/CognitiveFunctionsStep";
import CognitiveIndicesStep from "@/components/CognitiveProfileStepper/CognitiveIndicesStep";
import CognitiveResultsStep from "@/components/CognitiveProfileStepper/CognitiveResultsStep";

export default function CognitiveProfileStepper() {
  const [activeStep, setActiveStep] = useState(0);
  const [caseNumber, setCaseNumber] = useState("");
  const [age, setAge] = useState<number | null>(null);

  const initialSelectedCognitiveFunctions = Object.keys(
    functionToIndicesMap
  ).reduce((acc, func) => ({ ...acc, [func]: false }), {});

  const [selectedCognitiveFunctions, setselectedCognitiveFunctions] = useState<
    Record<string, boolean>
  >(initialSelectedCognitiveFunctions);

  const [hasAttemptedNext, setHasAttemptedNext] = useState(false);
  const [selectedIndices, setSelectedIndices] = useState<
    Record<string, boolean>
  >({});

  const [results, setResults] = useState<Record<string, number>>({});

  const validateStep = (step: number) => {
    switch (step) {
      case 1:
        if (!Object.values(selectedCognitiveFunctions).some(Boolean)) {
          setHasAttemptedNext(true);
          return false;
        }
        break;
      case 2:
        const selectedFunctions = Object.entries(selectedCognitiveFunctions)
          .filter(([, isSelected]) => isSelected)
          .map(([functionName]) => functionName);

        for (let functionName of selectedFunctions) {
          const indicesForFunction = functionToIndicesMap[functionName];
          const hasSelectedIndices = indicesForFunction.some(
            (index) => selectedIndices[index]
          );
          if (!hasSelectedIndices) {
            setHasAttemptedNext(true);
            return false;
          }
        }
        break;
      case 3:
        for (let index in selectedIndices) {
          if (selectedIndices[index] && !results[index]) {
            setHasAttemptedNext(true);
            return false;
          }
        }
        break;
      default:
        return true;
    }
    return true;
  };

  const handleFunctionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setselectedCognitiveFunctions((prev) => ({
      ...prev,
      [event.target.name]: event.target.checked,
    }));
  };

  const handleResultChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    index: string
  ) => {
    setResults((prev) => ({
      ...prev,
      [index]: Number(event.target.value),
    }));
  };

  const handleNext = () => {
    if (validateStep(activeStep)) {
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
      setHasAttemptedNext(false);
    }
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
    setHasAttemptedNext(false);
  };

  const handleReset = () => {
    setActiveStep(0);
    setCaseNumber("");
    setAge(null);
    setselectedCognitiveFunctions(initialSelectedCognitiveFunctions);
    setHasAttemptedNext(false);
    setSelectedIndices({});
    setResults({});
  };

  const handleIndexChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedIndices((prev) => ({
      ...prev,
      [event.target.name]: event.target.checked,
    }));
  };

  const steps = useMemo(
    () => [
      {
        label: "Identification",
        getContent: () => (
          <IdentificationStep
            caseNumber={caseNumber}
            setCaseNumber={setCaseNumber}
            age={age}
            setAge={setAge}
          />
        ),
      },
      {
        label: "Fonctions cognitives",
        getContent: () => (
          <CognitiveFunctionsStep
            selectedCognitiveFunctions={selectedCognitiveFunctions}
            handleFunctionChange={handleFunctionChange}
            hasAttemptedNext={hasAttemptedNext}
          />
        ),
      },
      {
        label: "Indices cognitifs",
        getContent: () => (
          <CognitiveIndicesStep
            selectedCognitiveFunctions={selectedCognitiveFunctions}
            selectedIndices={selectedIndices}
            handleIndexChange={handleIndexChange}
            hasAttemptedNext={hasAttemptedNext}
          />
        ),
      },
      {
        label: "Résultats",
        getContent: () => (
          <CognitiveResultsStep
            selectedCognitiveFunctions={selectedCognitiveFunctions}
            selectedIndices={selectedIndices}
            results={results}
            handleResultChange={handleResultChange}
            hasAttemptedNext={hasAttemptedNext}
          />
        ),
      },
      {
        label: "Profil Cognitif",
        getContent: () => (
          <CognitiveChart
            data={prepareChartData()}
            caseNumber={caseNumber}
            age={age}
          />
        ),
      },
    ],
    [
      caseNumber,
      age,
      selectedCognitiveFunctions,
      hasAttemptedNext,
      selectedIndices,
      results,
    ]
  );

  const prepareChartData = useCallback(() => {
    const data: Record<string, { [index: string]: number }> = {};

    for (const func in functionToIndicesMap) {
      data[func] = {};

      functionToIndicesMap[func].forEach((index) => {
        if (selectedIndices[index]) {
          data[func][index] = results[index] || 0;
        }
      });
    }

    return data;
  }, [selectedIndices, results]);

  return (
    <Box sx={{ width: "100%" }}>
      <Stepper activeStep={activeStep}>
        {steps.map((step) => (
          <Step key={step.label}>
            <StepLabel>{step.label}</StepLabel>
          </Step>
        ))}
      </Stepper>
      <Typography sx={{ mt: 2 }}>{steps[activeStep].getContent()}</Typography>
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
        {activeStep === steps.length - 1 ? (
          <Button onClick={handleReset}>Recommencer</Button>
        ) : (
          <Button onClick={handleNext}>Suivant</Button>
        )}
      </Box>
    </Box>
  );
}

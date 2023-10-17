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

const functionToIndicesMap: Record<string, string[]> = {
  "Fonctionnement intellectuel global": [
    "QI",
    "GAI",
    "Compréhension verbale",
    "Raisonnement perceptif",
    "Mémoire de travail",
    "Vitesse de traitement",
  ],
  "Fonctions exécutives": [
    "Figure de Rey Rappel Immédiat",
    "Figure de Rey Rappel Différé",
    "Figure de Rey Temps de Copie",
    "Figure de Rey Reconnaissance",
    "Stroop D-Kefs Dénomination de couleur",
    "Stroop D-Kefs Lecture de mots",
    "Stroop D-Kefs Inhibition",
    "Stroop D-Kefs Inhibition/Alternance",
    "Tour D-Kefs Score de réussite total",
    "Tour D-Kefs Temps moyen 1er mouvement",
    "Tour D-Kefs Ratio temps-par-mouvement",
    "Tour D-Kefs Ratio précision de mouvement",
    "Tour D-Kefs Ratio violation de règle par item",
    "Trail-Making Temps trail A",
    "Trail-Making Temps trail B",
    "Wisconsin Nombre d’essais",
    "Wisconsin Nombre de réponse correcte",
    "Wisconsin Nombre d’erreurs",
    "Wisconsin Réponses persévératives",
    "Wisconsin Erreurs persévératives",
    "Wisconsin Erreurs non-persévératives",
    "Wisconsin Niveau de réponses conceptuelles",
    "Wisconsin Nombre de catégories complétées",
    "Wisconsin Nombre d’essais pour compléter la première catégorie",
    "Wisconsin Échec du maintien de catégorie",
    "Wisconsin Apprendre à apprendre",
  ],

  Attention: [
    "CPT-3 Détectabilité",
    "CPT-3 Omissions",
    "CPT-3 Commissions",
    "CPT-3 Persévérations",
    "CPT-3 HRT",
    "CPT-3 Variabilité",
    "CPT-3 HRT Block change",
    "CPT-3 HRT ISI",
  ],
};

export default function HorizontalLinearStepper() {
  const [activeStep, setActiveStep] = React.useState(0);
  const [selectedCognitiveFunctions, setselectedCognitiveFunctions] =
    React.useState<Record<string, boolean>>({
      "Fonctionnement intellectuel global": false,
      "Fonctions exécutives": false,

      Attention: false,
    });
  const [selectedIndices, setSelectedIndices] = React.useState<
    Record<string, boolean>
  >({});

  const [results, setResults] = React.useState<Record<string, number>>({});

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
  const IdentificationContent = (
    <FormGroup>
      <Box sx={{ m: 1, display: "flex", flexWrap: "wrap" }}>
        <TextField
          id="outlined-required"
          label="Numéro de dossier"
          defaultValue="1234"
        />
      </Box>
      <Box sx={{ m: 1, display: "flex", flexWrap: "wrap" }}>
        <TextField
          id="filled-number"
          label="Âge"
          type="number"
          inputProps={{ min: 0, max: 100 }}
        />
      </Box>
    </FormGroup>
  );
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
                        onChange={(e) => handleResultChange(e, index)}
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

  const steps = [
    {
      label: "Identification",
      getContent: () => IdentificationContent,
    },
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
            {Object.entries(results).map(([index, value]) => (
              <div key={index}>
                {index}: {value}%
              </div>
            ))}
          </Typography>
          <Box sx={{ display: "flex", flexDirection: "row", pt: 2 }}>
            <Box sx={{ flex: "1 1 auto" }} />
            <Button onClick={handleReset}>Recommencer</Button>
          </Box>
        </React.Fragment>
      ) : (
        <React.Fragment>
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

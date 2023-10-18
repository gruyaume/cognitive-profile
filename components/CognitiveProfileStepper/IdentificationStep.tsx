import React from "react";
import Box from "@mui/material/Box";
import FormGroup from "@mui/material/FormGroup";
import TextField from "@mui/material/TextField";

type IdentificationStepProps = {
  caseNumber: string;
  setCaseNumber: (value: string) => void;
  age: number | null;
  setAge: (value: number | null) => void;
};

const IdentificationStep: React.FC<IdentificationStepProps> = ({
  caseNumber,
  setCaseNumber,
  age,
  setAge,
}) => {
  return (
    <div>
      <FormGroup>
        <Box sx={{ m: 1, display: "flex", flexWrap: "wrap" }}>
          <TextField
            id="outlined-required"
            label="Numéro de dossier"
            value={caseNumber}
            onChange={(e) => setCaseNumber(e.target.value)}
          />
        </Box>
        <Box sx={{ m: 1, display: "flex", flexWrap: "wrap" }}>
          <TextField
            id="filled-number"
            label="Âge"
            type="number"
            value={age === null ? "" : age}
            onChange={(e) =>
              setAge(e.target.value ? parseInt(e.target.value) : null)
            }
            inputProps={{ min: 0, max: 100 }}
          />
        </Box>
      </FormGroup>
    </div>
  );
};

export default IdentificationStep;

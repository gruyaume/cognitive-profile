"use client";
import * as React from "react";
import Typography from "@mui/material/Typography";
import CognitiveChart from "@/components/CognitiveChart";

export default function HomePage() {
  const mockData = {
    "Fonctionnement intellectuel global": {
      QI: 78,
      GAI: 10,
      "Compréhension verbale": 15,
      "Raisonnement perceptif": 32,
      "Mémoire de travail": 45,
      "Vitesse de traitement": 55,
    },
    "Fonctions exécutives": {
      "Figure de Rey Rappel Immédiat": 25,
      "Figure de Rey Rappel Différé": 55,
      "Figure de Rey Temps de Copie": 85,
      "Figure de Rey Reconnaissance": 90,
    },
    Attention: {
      "CPT-3 Détectabilité": 20,
      "CPT-3 Omissions": 30,
      "CPT-3 Commissions": 95,
      "CPT-3 Persévérations": 80,
      "CPT-3 HRT": 70,
    },
  };

  return (
    <Typography sx={{ mt: 2, mb: 1 }}>
      <CognitiveChart data={mockData} />
    </Typography>
  );
}

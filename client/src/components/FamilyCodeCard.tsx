import React, { useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  TextField,
} from "@mui/material";
import { useNavigate } from "react-router";
import { useTranslation } from "react-i18next";

const FamilyCodeCard = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [familyCode, setFamilyCode] = useState("");

  const handleViewFamily = (e: React.FormEvent) => {
    e.preventDefault();
    if (familyCode) navigate(`/public/`, { state: { code: familyCode } });
  };

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: 2,
      }}
    >
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            {t("getStarted.familyCodeTitle")}
          </Typography>
          <Typography variant="body2" sx={{ mb: 2 }}>
            {t("getStarted.familyCodeDesc")}
          </Typography>
          <Box component="form" onSubmit={handleViewFamily}>
            <TextField
              fullWidth
              variant="outlined"
              placeholder={t("getStarted.familyCodeInput")}
              value={familyCode}
              onChange={(e) => setFamilyCode(e.target.value)}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              {t("getStarted.viewFamilyBtn")}
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default FamilyCodeCard;

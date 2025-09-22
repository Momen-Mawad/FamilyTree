import React, { useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Tabs,
  Tab,
  Button,
  TextField,
} from "@mui/material";
import { useNavigate } from "react-router";
import { useTranslation } from "react-i18next";
import Login from "./Login";
import Register from "./Register";

const GetStarted = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [tab, setTab] = useState(0);
  const [familyCode, setFamilyCode] = useState("");

  const handleTabChange = (_: any, newValue: number) => setTab(newValue);

  const handleViewFamily = (e: React.FormEvent) => {
    e.preventDefault();
    if (familyCode) navigate(`/public/${familyCode}`);
  };

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight="80vh"
      gap={4}
      flexWrap="wrap"
    >
      {/* Login/Register Card */}
      <Card>
        <CardContent>
          <Tabs value={tab} onChange={handleTabChange} centered>
            <Tab label={t("getStarted.loginTab")} />
            <Tab label={t("getStarted.registerTab")} />
          </Tabs>
          <Box mt={2}>{tab === 0 ? <Login /> : <Register />}</Box>
        </CardContent>
      </Card>
      {/* Family Code Card */}
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

export default GetStarted;

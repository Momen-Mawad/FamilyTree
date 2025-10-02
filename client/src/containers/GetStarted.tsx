import { useState } from "react";
import { Box, Card, CardContent, Tabs, Tab } from "@mui/material";
import { useTranslation } from "react-i18next";
import Login from "./Login";
import Register from "./Register";
import FamilyCodeCard from "../components/FamilyCodeCard";

const GetStarted = () => {
  const { t } = useTranslation();
  const [tab, setTab] = useState(0);

  const handleTabChange = (_: any, newValue: number) => setTab(newValue);

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
      <FamilyCodeCard />
    </Box>
  );
};

export default GetStarted;

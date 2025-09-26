import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import axios from "axios";
import { type RawNodeDatum } from "react-d3-tree";
import { Box, Typography, CircularProgress, Alert } from "@mui/material";
import { URL } from "../../config";
import PublicFamilyTree from "./PublicFamilyTree";
import "./TreePage.css";
import { useTranslation } from "react-i18next";

interface FamilyTreeData {
  familyName: string;
  members: RawNodeDatum[];
}

const PublicFamilyPage: React.FC = () => {
  const { code } = useParams<{ code: string }>();
  const [fetchData, setFetchData] = useState<FamilyTreeData | null>(null);
  const [familyName, setFamilyName] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { t } = useTranslation();

  useEffect(() => {
    if (!code) return;
    setLoading(true);
    axios
      .get(`${URL}/public/family/${code}`)
      .then((response) => {
        setFamilyName(response.data.familyName || "Family");
        setFetchData(response.data);
        setError(null);
      })
      .catch(() => setError("Family not found"))
      .finally(() => setLoading(false));
  }, [code]);

  if (loading) return <CircularProgress />;
  if (error)
    return (
      <Alert severity="error">
        <p>{t("treePage.noFamilyAssigned")}</p>
      </Alert>
    );
  if (!fetchData) return null;

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h4" align="center" gutterBottom>
        {t("treePage.familyTreeFor", { familyName: familyName })}
      </Typography>
      <div className="tree_page">
        <PublicFamilyTree treeData={fetchData.members} />
      </div>
    </Box>
  );
};

export default PublicFamilyPage;

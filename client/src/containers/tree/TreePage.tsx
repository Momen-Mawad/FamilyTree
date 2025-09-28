import React, { useState, useEffect } from "react";
import { URL } from "../../config";
import axios from "axios";
import "./TreePage.css";
import FamilyTree from "./FamilyTree";
import type { RawNodeDatum } from "react-d3-tree";
import { useAuth } from "../../context/AuthContext";
import { useNavigation } from "react-router";
import { useTranslation } from "react-i18next";
import {
  IconButton,
  Tooltip,
  Box,
  InputAdornment,
  TextField,
} from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

interface FamilyTreeData {
  familyName: string;
  members: RawNodeDatum[];
  publicCode: string;
}

const TreePage: React.FC = () => {
  const navigation = useNavigation();
  const isLoading = navigation.state === "loading";
  const { t } = useTranslation();
  const [showCode, setShowCode] = useState(false);

  const [fetchData, setFetchData] = useState<FamilyTreeData | null>(null);
  const [selectedNode, setSelectedNode] = useState<any>(null);
  const { user, logout } = useAuth();

  const fetchFamilyTree = async () => {
    try {
      const familyId = user?.familyId; // Use the dynamic ID
      const response = await axios.get(`${URL}/families/${familyId}`);
      if (!response.data) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      setFetchData(response.data);
    } catch (error) {
      console.error("Failed to fetch family tree:", error);
    }
  };

  useEffect(() => {
    fetchFamilyTree();
  }, [user?.familyId]);

  if (isLoading) {
    return <div>{t("treePage.loading")}</div>;
  }

  // Handle case where user is logged in but has no familyId
  if (!user?.familyId) {
    return (
      <div className="tree_page">
        <p>{t("treePage.noFamilyAssigned")}</p>
        <button onClick={logout}>{t("treePage.logout")}</button>
      </div>
    );
  }

  if (!fetchData) return <p>{t("treePage.noDataFound")}</p>;

  return (
    <Box
      sx={{
        textAlign: "center",
        fontFamily: "Arial, sans-serif",
        p: 2,
        backgroundColor: "#f4f7f9",
        minHeight: "100vh",
        gap: 2,
      }}
    >
      <h1>
        {t("treePage.familyTreeFor", { familyName: fetchData?.familyName })}
      </h1>
      <FamilyTree
        treeData={fetchData.members}
        selectedNode={selectedNode}
        setSelectedNode={setSelectedNode}
        fetchFamilyTree={fetchFamilyTree}
      />
      {/* Public Code Reveal Box */}
      <Box
        sx={{
          display: "flex",
          bgcolor: "background.paper",
          borderRadius: 2,
          boxShadow: 2,
          p: 1,
          width: "80vw",
          maxWidth: 200,
          mx: "auto",
          mt: 2,
        }}
      >
        <Tooltip
          title={showCode ? t("treePage.hideCode") : t("treePage.showCode")}
        >
          <IconButton
            onClick={() => setShowCode((prev) => !prev)}
            size="small"
            sx={{ mr: 1 }}
            aria-label={
              showCode ? t("treePage.hideCode") : t("treePage.showCode")
            }
          >
            {showCode ? <VisibilityOff /> : <Visibility />}
          </IconButton>
        </Tooltip>
        <TextField
          label={t("treePage.publicCode")}
          value={
            showCode
              ? fetchData.publicCode
              : "•".repeat(fetchData.publicCode.length)
          }
          size="small"
          variant="outlined"
          sx={{ flex: 1 }}
        />
      </Box>
    </Box>
  );
};

export default TreePage;

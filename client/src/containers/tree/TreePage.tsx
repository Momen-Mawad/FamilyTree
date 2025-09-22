import React, { useState, useEffect } from "react";
import { URL } from "../../config";
import axios from "axios";
import "./TreePage.css";
import FamilyTree from "./FamilyTree";
import type { RawNodeDatum } from "react-d3-tree";
import { useAuth } from "../../context/AuthContext";
import { useNavigation } from "react-router";
import { useTranslation } from "react-i18next";

interface FamilyTreeData {
  familyName: string;
  members: RawNodeDatum[];
}

const TreePage: React.FC = () => {
  const navigation = useNavigation();
  const isLoading = navigation.state === "loading";
  const { t } = useTranslation();

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

  return (
    <div className="tree_page">
      <h1>
        {t("treePage.familyTreeFor", { familyName: fetchData?.familyName })}
      </h1>
      {fetchData && fetchData.members.length > 0 ? (
        <FamilyTree
          treeData={fetchData.members}
          selectedNode={selectedNode}
          setSelectedNode={setSelectedNode}
          fetchFamilyTree={fetchFamilyTree}
        />
      ) : (
        <p>{t("treePage.noDataFound")}</p>
      )}
    </div>
  );
};

export default TreePage;

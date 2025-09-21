// TreePage.tsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { URL } from "../../config.js";
import axios from "axios";
import "./TreePage.css";
import FamilyTree from "./FamilyTree";
import AddChildForm from "./AddChildForm";
import type { RawNodeDatum } from "react-d3-tree";

interface TreePageProps {
  user: { email: string; familyId: string };
  logout: () => void;
}

interface FamilyTreeData {
  familyName: string;
  members: RawNodeDatum[];
}

const TreePage: React.FC<TreePageProps> = (props) => {
  const navigate = useNavigate();
  const nodeSize = { x: 200, y: 200 };

  const [fetchData, setFetchData] = useState<FamilyTreeData | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedNode, setSelectedNode] = useState<any>(null);
  const [newChildName, setNewChildName] = useState("");

  const fetchFamilyTree = async () => {
    try {
      const familyId = props.user.familyId; // Use the dynamic ID
      const response = await axios.get(`${URL}/families/${familyId}`);
      if (!response.data) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      setFetchData(response.data);
    } catch (error) {
      console.error("Failed to fetch family tree:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFamilyTree();
  }, [props.user.familyId]);

  const handleAddChild = async () => {
    if (!selectedNode || !newChildName.trim()) return;

    try {
      await axios.post(`${URL}/persons`, {
        name: newChildName,
        parentId: selectedNode._id,
        familyId: props.user.familyId,
      });

      console.log(selectedNode);

      await fetchFamilyTree();
      setNewChildName("");
      setSelectedNode(null);
    } catch (error) {
      console.error("Error adding child:", error);
    }
  };

  if (loading) {
    return <div>Loading family tree...</div>;
  }

  return (
    <div className="tree_page">
      <h1>Family Tree for {fetchData?.familyName}'s Family</h1>
      {fetchData && fetchData.members.length > 0 ? (
        <FamilyTree
          treeData={fetchData.members}
          selectedNode={selectedNode}
          setSelectedNode={setSelectedNode}
          nodeSize={nodeSize}
          setNewChildName={setNewChildName}
          fetchFamilyTree={fetchFamilyTree}
        />
      ) : (
        <p>No family tree data found.</p>
      )}
      {selectedNode && (
        <AddChildForm
          selectedNode={selectedNode}
          newChildName={newChildName}
          setNewChildName={setNewChildName}
          handleAddChild={handleAddChild}
        />
      )}
      <button
        onClick={() => {
          props.logout();
          navigate("/");
        }}
      >
        Logout
      </button>
    </div>
  );
};

export default TreePage;

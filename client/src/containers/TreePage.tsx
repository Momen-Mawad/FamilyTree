import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import Tree from "react-d3-tree";
import { URL } from "../config.js";
import axios from "axios";
import "./TreePage.css";
import type { RawNodeDatum } from 'react-d3-tree';
import { useCenteredTree } from "./helpers.tsx";

interface TreePageProps {
  user: { email: string; familyId: string };
  logout: () => void;
}

interface FamilyTreeData {
  familyName: string;
  members: RawNodeDatum[];
}

const renderForeignObjectNode = ({
  nodeDatum,
  toggleNode,
  foreignObjectProps,
  setSelectedNode

}) => (
  <g>
    <foreignObject x="-50" y="-30" width="100" height="60">
      <div
        onClick={() => {
          // If the node has children, toggle it.
          if (nodeDatum.children) {
          toggleNode();
          }
          // Always set the selected node when clicked
          setSelectedNode(nodeDatum);
        }}
        style={{
          border: "1px solid black",
          backgroundColor: "#dedede",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          cursor: nodeDatum.children ? "pointer" : "default",
          boxSizing: "border-box",
        }}
      >
        <h3 style={{ margin: 0, padding: "5px", fontSize: "14px", textAlign: "center" }}>
          {nodeDatum.name}
        </h3>
        {nodeDatum.children && (
          <span style={{ fontSize: "12px", color: "#666" }}>
            {nodeDatum.__rd3t.collapsed ? "Expand" : "Collapse"}
          </span>
        )}
      </div>
    </foreignObject>
  </g>
);

const TreePage: React.FC<TreePageProps> = (props) => {
  const navigate = useNavigate();
  const [translate, containerRef] = useCenteredTree();
  const nodeSize = { x: 200, y: 200 };
  const foreignObjectProps = { width: nodeSize.x, height: nodeSize.y, x: 20 };
  
  const [fetchData, setFetchData] = useState<FamilyTreeData | null>(null);
  const [loading, setLoading] = useState(true);

  // State for adding a new child
  const [selectedNode, setSelectedNode] = useState<any>(null);
  const [newChildName, setNewChildName] = useState("");

  useEffect(() => {
    const fetchFamilyTree = async () => {
      try {
        // Fetch data from the new, transformed endpoint
        const familyId = "68ca981a5bbf0f21fb7322e5"; // Replace with a dynamic ID
        const response = await axios.get(`${URL}/families/${familyId}`);

        if (!response.data) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = response.data;
        // The data is now ready to use directly
        setFetchData(data);
      } finally {
        setLoading(false);
      }
    };

    fetchFamilyTree();
  }, []);

  if (loading) {
    return <div>Loading family tree...</div>;
  }

  const handleAddChild = async () => {
    if (!selectedNode || !newChildName.trim()) return;

    try {
      const response = await axios.post(`${URL}/persons`, {
        name: newChildName,
        parentId: selectedNode._id, // Assuming each node has a unique 'id' property
        familyId: props.user.familyId, // Replace with actual family ID
      });

      if (response.data.ok) {
        // Update the local state to reflect the new child
        console.log("New child added:", response.data.person);
      }
    } catch (error) {
      console.error("Error adding child:", error);
    }
  };


  return (
    <div className="tree_page">
      <h1>Family Tree for {fetchData?.familyName}'s Family</h1>

      <div className="tree_container" ref={containerRef}>
        {fetchData ? (
          <Tree
            data={fetchData.members}
            translate={translate}
            nodeSize={nodeSize}
            orientation="vertical"
            pathFunc="step"
            separation={{ siblings: 1 }}
            depthFactor={200}
            renderCustomNodeElement={(rd3tProps) =>
              renderForeignObjectNode({ ...rd3tProps, foreignObjectProps, setSelectedNode  })
            }
          />
        ) : (
          <p>No family tree data found.</p>
        )}
      </div>
      {selectedNode && (
        <div className="add-child-form">
          <h3>Add a new child for {selectedNode.name}</h3>
          <input
            type="text"
            value={newChildName}
            onChange={(e) => setNewChildName(e.target.value)}
            placeholder="Enter child's name"
          />
          <button onClick={handleAddChild}>Add Child</button>
        </div>
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
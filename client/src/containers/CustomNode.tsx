// CustomNode.tsx
import React from "react";
import axios from "axios";
import type { RawNodeDatum } from "react-d3-tree";
import { URL } from "../config.js";

interface CustomNodeProps {
  nodeDatum: RawNodeDatum;
  // toggleNode: () => void;
  setSelectedNode: (node: RawNodeDatum | null) => void;
  fetchFamilyTree: () => Promise<void>;
  setNewChildName: (name: string) => void;
}

const CustomNode: React.FC<CustomNodeProps> = ({
  nodeDatum,
  setSelectedNode,
  fetchFamilyTree,
  setNewChildName,
}) => {
  const handleDeleteChild = async () => {
    try {
      await axios.delete(`${URL}/persons/${nodeDatum._id}`);
    } catch (error) {
      console.error("Error deleting child:", error);
    } finally {
      await fetchFamilyTree();
      setNewChildName("");
      setSelectedNode(null);
    }
  };

  return (
    <g>
      <foreignObject x="-50" y="-30" width="100" height="60">
        <div
          style={{
            border: "1px solid black",
            backgroundColor: "#dedede",
            width: "100%",
            height: "100%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            cursor: "default",
            boxSizing: "border-box",
            position: "relative",
          }}
        >
          <h3
            style={{
              margin: 0,
              padding: "5px",
              fontSize: "14px",
              textAlign: "center",
            }}
          >
            {nodeDatum.name}
          </h3>
          {/* The "add child" button */}
          <button
            onClick={(e) => {
              e.stopPropagation(); // Prevents the click from bubbling up to the div's toggle
              setSelectedNode(nodeDatum);
            }}
            style={{
              position: "absolute",
              top: "-20px", // Adjust position as needed
              left: "-10px", // Adjust position as needed
              width: "20px",
              height: "20px",
              borderRadius: "50%",
              backgroundColor: "green",
              color: "white",
              border: "none",
              cursor: "pointer",
              fontSize: "18px",
            }}
          >
            +
          </button>
          {/* The "delete child" button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              alert(`Delete node: ${nodeDatum.name}`);
              handleDeleteChild();
            }}
            style={{
              position: "absolute",
              top: "-20px", // Adjust position as needed
              right: "-10px", // Adjust position as needed
              width: "20px",
              height: "20px",
              borderRadius: "50%",
              backgroundColor: "red",
              color: "white",
              border: "none",
              cursor: "pointer",
              fontSize: "18px",
              // Hide for root node
              display:
                nodeDatum.parent === null || nodeDatum.children.length > 0
                  ? "none"
                  : "block",
            }}
          >
            -
          </button>
        </div>
      </foreignObject>
    </g>
  );
};

export default CustomNode;

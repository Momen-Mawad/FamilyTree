import React from "react";
import type { RawNodeDatum } from "react-d3-tree";
import { Typography, IconButton, Tooltip, Paper } from "@mui/material";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import RemoveCircleIcon from "@mui/icons-material/RemoveCircle";
import axios from "axios";

interface CustomNodeProps {
  nodeDatum: RawNodeDatum;
  toggleNode: () => void;
  setSelectedNode: (node: RawNodeDatum | null) => void;
  fetchFamilyTree: () => Promise<void>;
  setNewChildName: (name: string) => void;
  nodeSize: { x: number; y: number };
}

const CustomNode: React.FC<CustomNodeProps> = ({
  nodeDatum,
  setSelectedNode,
  setNewChildName,
  toggleNode,
  fetchFamilyTree,
  nodeSize,
}) => {
  const handleAddClick = (event: React.MouseEvent) => {
    event.stopPropagation();
    setSelectedNode(nodeDatum);
  };
  const handleDelete = async () => {
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
  const isRootNode = nodeDatum.parent === null;

  return (
    <foreignObject
      x={-nodeSize.x / 2}
      y={-nodeSize.y / 2}
      width={nodeSize.x}
      height={nodeSize.y}
      style={{ overflow: "visible" }} // Ensure buttons outside the box are visible
    >
      <Paper
        elevation={3}
        sx={{
          width: "100%",
          height: "100%",
          p: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          cursor: "pointer",
          border: "2px solid",
          borderColor: "grey.300",
          transition: "all 0.3s ease-in-out",
          "&:hover": {
            borderColor: "primary.main",
            transform: "scale(1.05)",
            boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
          },
        }}
        onClick={toggleNode}
      >
        <Typography variant="body1" sx={{ fontWeight: "bold" }}>
          {nodeDatum.name}
        </Typography>
        {nodeDatum.attributes?.gender && (
          <Typography variant="body2" sx={{ color: "text.secondary" }}>
            {nodeDatum.attributes.gender}
          </Typography>
        )}
      </Paper>

      {/* Add Child Button */}
      <Tooltip title="Add a new person to the family" arrow>
        <IconButton
          sx={{
            position: "absolute",
            top: 0,
            right: 0,
            color: "green",
            width: 10,
            height: 10,
          }}
          onClick={handleAddClick}
        >
          <AddCircleIcon />
        </IconButton>
      </Tooltip>

      {/* Delete Button - Only show if not the root node */}
      {!isRootNode && (
        <Tooltip title="Delete this person" arrow>
          <IconButton
            sx={{
              position: "absolute",
              top: -10,
              left: 0,
              display: nodeDatum?.children.length === 0 ? "inline" : "none",
              width: 10,
              height: 10,
              color: "red",
            }}
            onClick={handleDelete}
          >
            <RemoveCircleIcon />
          </IconButton>
        </Tooltip>
      )}
    </foreignObject>
  );
};

export default CustomNode;

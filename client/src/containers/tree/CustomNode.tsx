import React from "react";
import type { RawNodeDatum } from "react-d3-tree";
import { Typography, IconButton, Tooltip, Paper, Popover } from "@mui/material";
import axios from "axios";
import AddChildForm from "./AddChildForm";
import { useAuth } from "../../context/AuthContext";
import { URL } from "../../config";

interface CustomNodeProps {
  nodeDatum: RawNodeDatum;
  toggleNode: () => void;
  selectedNode: RawNodeDatum | null;
  setSelectedNode: (node: RawNodeDatum | null) => void;
  fetchFamilyTree: () => Promise<void>;
  setNewChildName: (name: string) => void;
  nodeSize: { x: number; y: number };
}

const CustomNode: React.FC<CustomNodeProps> = ({
  nodeDatum,
  selectedNode,
  setSelectedNode,
  setNewChildName,
  toggleNode,
  fetchFamilyTree,
  nodeSize,
}) => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [localChildName, setLocalChildName] = React.useState("");
  const handleAddClick = (event: React.MouseEvent) => {
    event.stopPropagation();
    setSelectedNode(nodeDatum);
    setAnchorEl(event.currentTarget);
  };
  const { user } = useAuth();

  const handlePopoverClose = () => {
    setAnchorEl(null);
    setLocalChildName("");
  };
  const handleAddChild = async () => {
    if (!selectedNode || !localChildName.trim()) return;

    try {
      const token = localStorage.getItem("token");
      if (token) {
        axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      }

      await axios.post(`${URL}/persons`, {
        name: localChildName,
        parentId: selectedNode._id,
        familyId: user?.familyId,
      });

      // Close the popover first
      setAnchorEl(null);
      setLocalChildName("");
      setNewChildName("");
      setSelectedNode(null);

      // Then refresh the tree
      await fetchFamilyTree();
    } catch (error) {
      console.error("Error adding child:", error);
    }
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
          width: "80%",
          height: "80%",
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
      <Tooltip title="Add a new child to this person" arrow>
        <IconButton
          sx={{
            position: "absolute",
            top: 0,
            right: 0,
            color: "green",
            width: 10,
            height: 10,
            minWidth: 0,
            minHeight: 0,
            border: "2px solid green",
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 20,
            background: "#fff",
            boxShadow: 1,
            transition: "background 0.2s, box-shadow 0.2s",
            "&:hover": {
              background: "#e8f5e9",
              boxShadow: 3,
            },
          }}
          onClick={handleAddClick}
        >
          +
        </IconButton>
      </Tooltip>

      {/* Delete Button - Only show if not the root node */}
      {!isRootNode && (
        <>
          <Tooltip title="Delete this person" arrow>
            <IconButton
              sx={{
                position: "absolute",
                top: 0,
                left: 0,
                display:
                  Array.isArray(nodeDatum.children) &&
                  nodeDatum.children.length === 0
                    ? "flex"
                    : "none",
                width: 10,
                height: 10,
                minWidth: 0,
                minHeight: 0,
                border: "2px solid red",
                borderRadius: "50%",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 20,
                background: "#fff",
                boxShadow: 1,
                color: "red",
                transition: "background 0.2s, box-shadow 0.2s",
                "&:hover": {
                  background: "#ffebee",
                  boxShadow: 3,
                },
              }}
              onClick={handleDelete}
            >
              -
            </IconButton>
          </Tooltip>
          <Popover
            open={Boolean(anchorEl)}
            anchorEl={anchorEl}
            onClose={handlePopoverClose}
            anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
            transformOrigin={{ vertical: "top", horizontal: "right" }}
            disableEnforceFocus
          >
            <AddChildForm
              selectedNode={nodeDatum}
              newChildName={localChildName}
              setNewChildName={setLocalChildName}
              handleAddChild={handleAddChild}
            />
          </Popover>
        </>
      )}
    </foreignObject>
  );
};

export default CustomNode;

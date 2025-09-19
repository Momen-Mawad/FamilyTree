// AddChildForm.tsx
import React from "react";

interface AddChildFormProps {
  selectedNode: { name: string };
  newChildName: string;
  setNewChildName: (name: string) => void;
  handleAddChild: () => void;
}

const AddChildForm: React.FC<AddChildFormProps> = ({
  selectedNode,
  newChildName,
  setNewChildName,
  handleAddChild,
}) => (
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
);

export default AddChildForm;
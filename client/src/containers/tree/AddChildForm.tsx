import React from "react";
import { useTranslation } from "react-i18next";

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
}) => {
  const { t } = useTranslation();

  return (
    <div className="add-child-form">
      <h3>{t("addChildForm.title", { parentName: selectedNode.name })}</h3>
      <input
        type="text"
        value={newChildName}
        onChange={(e) => setNewChildName(e.target.value)}
        placeholder={t("addChildForm.placeholder")}
      />
      <button onClick={handleAddChild}>{t("addChildForm.addButton")}</button>
    </div>
  );
};

export default AddChildForm;

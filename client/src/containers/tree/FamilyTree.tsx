// FamilyTree.tsx
import React from "react";
import Tree from "react-d3-tree";
import type { RawNodeDatum } from "react-d3-tree";

import { useCenteredTree } from "../helpers.tsx";
import CustomNode from "./CustomNode";

interface FamilyTreeProps {
  treeData: RawNodeDatum[];
  selectedNode: RawNodeDatum | null;
  setSelectedNode: (node: RawNodeDatum | null) => void;
  setNewChildName: (name: string) => void;
  fetchFamilyTree: () => Promise<void>;
}

const FamilyTree: React.FC<FamilyTreeProps> = ({
  treeData,
  selectedNode,
  setSelectedNode,
  setNewChildName,
  fetchFamilyTree,
}) => {
  const [translate, containerRef] = useCenteredTree();
  const nodeSize = { x: 100, y: 100 };

  return (
    <div className="tree_container" ref={containerRef}>
      <Tree
        data={treeData}
        translate={translate}
        nodeSize={nodeSize}
        orientation="vertical"
        pathFunc="step"
        separation={{ siblings: 1.5, nonSiblings: 1.5 }}
        depthFactor={200}
        initialDepth={2}
        renderCustomNodeElement={(rd3tProps) => (
          <CustomNode
            {...rd3tProps}
            selectedNode={selectedNode}
            setSelectedNode={setSelectedNode}
            setNewChildName={setNewChildName}
            fetchFamilyTree={fetchFamilyTree}
            nodeSize={nodeSize}
          />
        )}
      />
    </div>
  );
};

export default FamilyTree;

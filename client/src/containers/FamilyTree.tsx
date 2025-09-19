// FamilyTree.tsx
import React from "react";
import Tree from "react-d3-tree";
import type { RawNodeDatum } from "react-d3-tree";

import { useCenteredTree } from "./helpers.tsx";
import CustomNode from "./CustomNode";

interface FamilyTreeProps {
  treeData: RawNodeDatum[];
  setSelectedNode: (node: any) => void;
  nodeSize: { x: number; y: number };
  setNewChildName: (name: string) => void;
  fetchFamilyTree: () => Promise<void>;
}

const FamilyTree: React.FC<FamilyTreeProps> = ({
  treeData,
  setSelectedNode,
  nodeSize,
  setNewChildName,
  fetchFamilyTree,
}) => {
  const [translate, containerRef] = useCenteredTree();

  return (
    <div className="tree_container" ref={containerRef}>
      <Tree
        data={treeData}
        translate={translate}
        nodeSize={nodeSize}
        orientation="vertical"
        pathFunc="step"
        separation={{ siblings: 1 }}
        depthFactor={200}
        renderCustomNodeElement={(rd3tProps) => (
          <CustomNode
            {...rd3tProps}
            setSelectedNode={setSelectedNode}
            setNewChildName={setNewChildName}
            fetchFamilyTree={fetchFamilyTree}
          />
        )}
      />
    </div>
  );
};

export default FamilyTree;

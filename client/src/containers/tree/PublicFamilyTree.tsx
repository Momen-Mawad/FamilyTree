// FamilyTree.tsx
import React from "react";
import Tree from "react-d3-tree";
import type { RawNodeDatum } from "react-d3-tree";

import { useCenteredTree } from "../helpers.tsx";
import CustomNode from "./CustomNode";

interface FamilyTreeProps {
  treeData: RawNodeDatum[];
}

const PublicFamilyTree: React.FC<FamilyTreeProps> = ({ treeData }) => {
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
            selectedNode={null}
            setSelectedNode={() => {}}
            fetchFamilyTree={async () => {}}
            nodeSize={nodeSize}
            publicNode={true}
          />
        )}
      />
    </div>
  );
};

export default PublicFamilyTree;

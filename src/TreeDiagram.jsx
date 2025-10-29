import { useMemo, useState } from "react";
import ReactFlow, {
  Background,
  Controls,
  ReactFlowProvider,
  useReactFlow,
} from "reactflow";

import { generateTreeData, TREE_CONFIG } from "./utils";

import "reactflow/dist/style.css";

export const TreeDiagramProvider = ReactFlowProvider;

export default function TreeDiagram({ json }) {
  const { fitView } = useReactFlow();

  const [search, setSearch] = useState("");
  const { nodes, edges } = useMemo(() => {
    const { nodes, edges } = generateTreeData({ json });

    const matchingNodeIndex = nodes.findIndex(
      (node) => node.data.path === search
    );

    if (matchingNodeIndex !== -1) {
      nodes[matchingNodeIndex].style = {
        ...nodes[matchingNodeIndex].style,
        ...TREE_CONFIG.selected,
      };
      fitView({ nodes: [{ id: nodes[matchingNodeIndex].id }], duration: 500 });
    }

    return { nodes, edges };
  }, [search, json, fitView]);

  return (
    <>
      <input
        style={{
          position: "fixed",
          top: "4vh",
          left: "50vw",
          transform: "traslateX(-50%)",
          zIndex: "999999",
          borderRadius: "0.5rem",
          border: "none",
          color: "#fff",
          fontSize: "2rem",
          padding: "0.75rem 1.5rem",
        }}
        value={search}
        onChange={(e) => {
          setSearch(e.target.value);
        }}
      />
      <ReactFlow nodes={nodes} edges={edges} fitView>
        <Controls />
        <Background />
      </ReactFlow>
    </>
  );
}

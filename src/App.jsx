import { useEffect, useMemo, useState } from "react";
import ReactFlow, { Background, Controls } from "reactflow";
import "reactflow/dist/style.css";
import { generateTreeData, TREE_CONFIG } from "./utils";

const json = {
  user: {
    name: "ayush",
    id: 1,
    address: {
      city: "new york",
      country: "usa",
    },
    items: [
      {
        name: "item1",
        location: {
          city: "new york",
          country: "usa",
        },
      },
      { name: "item2" },
    ],
  },
};

export default function JsonTreeVisualizer() {
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
    }

    return { nodes, edges };
  }, [search]);

  return (
    <div style={{ width: "100vw", height: "100vh" }}>
      <input
        style={{
          position: "fixed",
          top: "4vh",
          left: "50vw",
          transform: "traslateX(-50%)",
          zIndex: "999999",
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
    </div>
  );
}

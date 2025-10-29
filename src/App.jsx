import React, { useEffect, useState } from "react";
import ReactFlow, { Background, Controls } from "reactflow";
import "reactflow/dist/style.css";
import FlowTree from "./FlowTree";
import { generateTreeData } from "./utils";

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
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);

  useEffect(() => {
    const { nodes, edges } = FlowTree(json);
    setNodes(nodes);
    console.log(nodes);
    setEdges();

    const { nodes: treeNodes, edges: treeEdges } = generateTreeData({ json });
    setNodes(treeNodes);
    setEdges(treeEdges);

    console.log("DEBUG", {
      nodes,
      edges,
      treeNodes,
      treeEdges,
    });
  }, []);

  return (
    <div style={{ width: "100vw", height: "100vh" }}>
      <ReactFlow nodes={nodes} edges={edges} fitView>
        <Controls />
        <Background />
      </ReactFlow>
    </div>
  );
}

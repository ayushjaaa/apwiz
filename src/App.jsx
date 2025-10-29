import TreeDiagram, { TreeDiagramProvider } from "./TreeDiagram";

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
  return (
    <div style={{ width: "100vw", height: "100vh" }}>
      <TreeDiagramProvider>
        <TreeDiagram json={json} />
      </TreeDiagramProvider>
    </div>
  );
}

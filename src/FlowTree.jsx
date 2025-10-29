// FlowTree.js
const FlowTree = (json, parentId = "root", depth = 0, yOffset = 0,path = "$") => {
  let nodes = [];
  let edges = [];
  let y = yOffset;


  for (let key in json) {
    const value = json[key];
    const nodeId = `${parentId}-${key}`;
    const currentPath =`${path}.${key}`
  console.log(currentPath)
// console.log(value)
// console.log("arry",Array.isArray(value))
// console.log('object',typeof value === "object" &&  value !== null && !Array.isArray(value))
if(Array.isArray(value)){

  nodes.push({
    id: nodeId,
    data: { label: key ,path:currentPath},
    position: { x: depth * 250, y },
    style: {
      backgroundColor: 'black',
      color: "white",
      borderRadius: "10px",
      padding: "8px",
    },
  });
}
else if(typeof value === "object" &&  value !== null && !Array.isArray(value)){
  nodes.push({
    id: nodeId,
    data: { label: key ,path:currentPath},
    position: { x: depth * 250, y },
      style: {
        backgroundColor: 'yellow',
        color: "black",
        borderRadius: "10px",
        padding: "8px",
      },


    });
  }
  else{
    nodes.push({
      id: nodeId,
      data: { label: key,path:`${currentPath}` },
      position: { x: depth * 250, y },
      style: {
        backgroundColor: 'red',
        color: "black",
        borderRadius: "10px",
        padding: "8px",
      },


    });
  }

    if (parentId !== "root") {
      edges.push({
        id: `e-${parentId}-${nodeId}`,
        source: parentId,
        target: nodeId,
        style: {
          backgroundColor: 'red',
          color: "black",
          borderRadius: "10px",
          padding: "8px",
        },


      });
    }
 

    // Case 1: Object
    if (typeof value === "object" && !Array.isArray(value) && value !== null) {
      const { nodes: childNodes, edges: childEdges, height } = FlowTree(
        value,
        nodeId,
        depth + 1,
        y,
        currentPath
      );
      nodes.push(...childNodes);
      edges.push(...childEdges);
      y += height;
    }

    // Case 2: Array
    else if (Array.isArray(value)) {
  
      let arrayY = y;
      value.forEach((item, i) => {
        console.log("tiemvalue",item)
        const itemId = `${nodeId}-item-${i}`;
const itempath = `${currentPath}[${i}]`   
 if(Array.isArray(item) && item.length > 0){
  console.log("valuearr",value)
  nodes.push({
    id: itemId,
    data: { label: `${key}[${i}]`,path: itempath},
    position: { x: (depth + 1) * 250, y: arrayY },
    style: {
      backgroundColor: 'black',
      color: "white",
      borderRadius: "10px",
      padding: "8px",
    },
  });
 }
 else if(typeof item === "object" &&  item !== null && !Array.isArray(item)){
  nodes.push({
    id: itemId,
    data: { label: `${key}[${i}]` ,path: itempath},
    position: { x: (depth + 1) * 250, y: arrayY },
    style: {
      backgroundColor: 'yellow',
      color: "black",
      borderRadius: "10px",
      padding: "8px",
    },
  });
}
else{
  nodes.push({
    id: itemId,
    data: { label: `${key}[${i}]`,path: itempath },
    position: { x: (depth + 1) * 250, y: arrayY },
    style: {
      backgroundColor: 'red',
      color: "black",
      borderRadius: "10px",
      padding: "8px",
    },
  });
}
        edges.push({
          id: `e-${nodeId}-${itemId}`,
          source: nodeId,
          target: itemId,
        });
        // console.log("item",item)
        if (Array.isArray(item)) {
          
          const { nodes: childNodes, edges: childEdges, height } = FlowTree(
            item,
            itemId,
            depth + 2,
            arrayY,
            itempath
          );
          nodes.push(...childNodes);
          edges.push(...childEdges);
          arrayY += height;
        }
        
       else if ( item &&  typeof item === "object" && !Array.isArray(item)) {

          const { nodes: childNodes, edges: childEdges, height } = FlowTree(
            item,
            itemId,
            depth + 2,
            arrayY,
            itempath
          );
          nodes.push(...childNodes);
          edges.push(...childEdges);
          arrayY += height;
        } 
        else {
          const valId = `${itemId}-val`;
          nodes.push({
            id: valId,
            data: { label: String(item),path:itempath },
            position: { x: (depth + 2) * 250, y: arrayY },
            style: {
                backgroundColor: 'red',
                color: "black",
                borderRadius: "10px",
                padding: "8px",
              },
          });
          edges.push({
            id: `e-${itemId}-${valId}`,
            source: itemId,
            target: valId,
          });
          arrayY += 80;
        }
      });
      y = arrayY;
    }

    // Case 3: Primitive
    else {
      const valId = `${nodeId}-val`;
      nodes.push({
        id: valId,
        data: { label: `${key}: ${String(value)}`,path: currentPath,},
        position: { x: (depth + 1) * 250, y },
        style: {
            backgroundColor: 'red',
            color: "white",
            borderRadius: "10px",
            padding: "8px",
          
          },
      });
      edges.push({
        id: `e-${nodeId}-${valId}`,
        source: nodeId,
        target: valId,
      });
      y += 100;
    }
  }

  return { nodes, edges, height: y - yOffset + 100 };
};

export default FlowTree;

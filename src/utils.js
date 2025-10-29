import isString from "lodash/isString";
import isNumber from "lodash/isNumber";
import isArray from "lodash/isArray";
import isObject from "lodash/isObject";

export function generateTreeData({ json }) {
  const nodes = [];
  const edges = [];

  function addNode({
    parentId,
    key,
    value,
    currentPath,
    depth,
    customKey,
    isArrayNode,
  }) {
    let edge = null;
    const nodeId = customKey || `${parentId}-${key}`;

    if (parentId !== "root") {
      edge = {
        id: `e-${parentId}-${nodeId}`,
        source: parentId,
        target: nodeId,
        // style: {
        //   backgroundColor: 'red',
        //   color: "black",
        //   borderRadius: "10px",
        //   padding: "8px",
        // },
      };
      edges.push(edge);
    }

    const node = {
      id: nodeId,
      data: {
        label: `${key} : ${
          isArray(value) ? "[...]" : isObject(value) ? "{...}" : value
        }`,
        path: `${currentPath}${isArrayNode ? "" : "."}${key}`,
      },
      position: { x: depth * 250, y: nodes.length * 75 },
      // style: {
      //   backgroundColor: 'black',
      //   color: "white",
      //   borderRadius: "10px",
      //   padding: "8px",
      // },
      meta_data: {
        parentId,
        key,
        value,
        currentPath,
        type: typeof value,
        edge,
        depth,
      },
    };
    nodes.push(node);

    return { node, edge };
  }

  function traverse({ parentId, obj, currentPath, depth, customKey }) {
    Object.entries(obj).forEach(([key, value]) => {
      if (isString(value) || isNumber(value)) {
        addNode({
          parentId,
          key,
          value,
          currentPath,
          depth,
          customKey,
        });

        return;
      }

      if (isArray(value)) {
        const { node: grandParent } = addNode({
          parentId,
          key,
          value,
          currentPath,
          depth,
        });

        value.forEach((item, index) => {
          const { node: parent } = addNode({
            parentId: grandParent.id,
            key: `[${index}]`,
            value,
            currentPath: grandParent.data.path,
            depth: depth + 1,
            isArrayNode: true,
          });

          traverse({
            parentId: parent.id,
            obj: item,
            currentPath: parent.data.path,
            depth: depth + 2,
          });
        });

        return;
      }

      if (isObject(value)) {
        const { node: parentNode } = addNode({
          parentId,
          key,
          value,
          currentPath,
          depth,
        });

        traverse({
          parentId: parentNode.id,
          obj: value,
          currentPath: parentNode.data.path,
          depth: depth + 1,
        });

        return;
      }
    });
  }

  traverse({ parentId: "root", obj: json, currentPath: "$", depth: 0 });

  return { nodes, edges };
}

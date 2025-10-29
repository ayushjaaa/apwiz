import isString from "lodash/isString";
import isNumber from "lodash/isNumber";
import isArray from "lodash/isArray";
import isObject from "lodash/isObject";

export const TREE_CONFIG = {
  default: { borderRadius: "10px", padding: "8px" },
  selected: {
    backgroundColor: "purple",
    color: "black",
  },
  object: {
    backgroundColor: "red",
    color: "black",
  },
  string: {
    backgroundColor: "pink",
    color: "black",
  },
  number: {
    backgroundColor: "green",
    color: "black",
  },
  array: {
    backgroundColor: "blue",
    color: "white",
  },
};

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

    const nodeDataType = typeof value;
    const style = {
      ...TREE_CONFIG.default,
      ...(TREE_CONFIG[nodeDataType] || {}),
    };

    if (parentId !== "root") {
      edge = {
        id: `e-${parentId}-${nodeId}`,
        source: parentId,
        target: nodeId,
        style,
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
      style,
      meta_data: {
        parentId,
        key,
        value,
        currentPath,
        type: typeof value,
        edge,
        depth,
        nodeDataType,
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

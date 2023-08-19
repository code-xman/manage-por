// 拍平数组数据 把children数据拍出来
export const flattenTreeData = (treeData) => {
  const flatNodes = [];

  const dig = (treeData) =>
    treeData.forEach((treeNode) => {
      flatNodes.push(treeNode);

      dig(treeNode.children || []);
    });

  dig(treeData);

  return flatNodes;
};

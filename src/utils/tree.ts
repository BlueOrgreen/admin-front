import { chain } from 'ramda';

/**
 * Flatten an array containing a tree structure
 * @param {T[]} trees - An array containing a tree structure
 * @returns {T[]} - Flattened array
 */
export function flattenTrees<T extends { children?: T[] }>(trees: T[] = []): T[] {
    return chain((node) => {
        const children = node.children || [];
        return [node, ...flattenTrees(children)];
    }, trees);
}

/**
 * 
 * 这个函数在处理树形结构数据（如菜单、目录、组织架构等）时非常有用，可以方便地将层级数据转换为扁平列表
 Ramda 的 chain 函数:
 类似于数组的 flatMap
 先对每个元素应用函数，然后将结果连接起来

 递归调用:
 对每个节点的 children 递归调用 flattenTrees
 将当前节点和递归处理子节点的结果合并
 */

//  如果不使用 Ramda 的 chain，用原生 JavaScript 可以这样写
function flattenTrees1<T extends { children?: T[] }>(trees: T[] = []): T[] {
    return trees.flatMap((node) => [node, ...flattenTrees1(node.children || [])]);
}

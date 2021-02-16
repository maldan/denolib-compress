import { BitArray } from "../../deps.ts";

class NodeData {
    value: number | null = null;
    priority = 0;

    constructor(value: number, priority: number) {
        this.value = value;
        this.priority = priority;
    }
}

class Node {
    left?: Node;
    right?: Node;
    priority = 0;
    value: number | null = null;

    constructor(left: unknown = null, right: unknown = null) {
        if (left instanceof NodeData) {
            const l = new Node();
            l.value = left.value;
            l.priority = left.priority;
            this.left = l;
            this.priority += left.priority;
        } else if (left instanceof Node) {
            this.left = left;
            this.priority += left.priority;
        }

        if (right instanceof NodeData) {
            const r = new Node();
            r.value = right.value;
            r.priority = right.priority;
            this.right = r;
            this.priority += right.priority;
        } else if (right instanceof Node) {
            this.right = right;
            this.priority += right.priority;
        }
    }
}

// deno-lint-ignore camelcase
type Type_HuffmanObjectTree = { [x: string]: [x: string] | number };

// deno-lint-ignore camelcase
type Type_HuffmanEncodeResult = {
    codeTable: number[][];
    bitArray: BitArray;
    tree: Type_HuffmanObjectTree;
};

/**
 * Huffman compression/decompression algorithm. It build code tables, tree and bitarray.
 * Can encode data and decode. But it don't store tree and other stuff in uint8array.
 * It even doesn't return uint8array because it will be using for other algorithms.
 * In other words it's middleware.
 */
export class Huffman {
    /**
     * Encode data in Uint8Array. Returns HuffmanEncodeResult. The result contains
     * codeTable, tree and bitArray.
     * @param {Uint8Array} data
     */
    static encode(data: Uint8Array): Type_HuffmanEncodeResult {
        // Bytes table each index is byte
        const table = new Array(255).fill(0);

        // Fill byte table with frequency
        data.forEach((x) => {
            table[x] += 1;
        });

        // Get priority queue, remove 0 frequency bytes
        let priorityQueue: NodeData[] = table
            .map((x, i) => [i, x])
            .filter((x) => x[1] > 0)
            .sort((a, b) => a[1] - b[1])
            .map((x) => {
                return new NodeData(x[0], x[1]);
            });

        // Build tree from queue
        while (true) {
            priorityQueue[0] = new Node(priorityQueue[0], priorityQueue[1]);
            priorityQueue.splice(1, 1);
            priorityQueue = priorityQueue.sort((a, b) => a.priority - b.priority);
            if (priorityQueue.length <= 1) {
                break;
            }
        }

        // Generate code table
        const codeTable = this.buildCodeTable(priorityQueue[0]);

        // Bit array
        const bitArray = new BitArray();
        for (let i = 0; i < data.length; i++) {
            bitArray.write.bits(...codeTable[data[i]]);
        }
        bitArray.position = 0;

        return {
            codeTable,
            bitArray,
            tree: this.buildCodeTree(codeTable),
        };
    }

    /**
     * Same as encode but for text.
     * @param {string} data
     */
    static encodeText(data: string): Type_HuffmanEncodeResult {
        return this.encode(new TextEncoder().encode(data));
    }

    /**
     * Decode data and return Uint8Array. Function need tree and bitArray.
     * @param {Type_HuffmanObjectTree} tree
     * @param {BitArray} bitArray
     */
    static decode(tree: Type_HuffmanObjectTree, bitArray: BitArray) {
        const out: number[] = [];
        // deno-lint-ignore no-explicit-any
        let branch: any = tree;
        for (let i = 0; i < bitArray.length; i++) {
            branch = branch[bitArray.buffer[i]];
            if (typeof branch === "number") {
                out.push(branch);
                branch = tree;
            }
        }

        return new Uint8Array(out);
    }

    /**
     * Same as decode but returns text.
     * @param {Type_HuffmanObjectTree} tree
     * @param {BitArray} bitArray
     */
    static decodeText(tree: Type_HuffmanObjectTree, bitArray: BitArray) {
        return new TextDecoder().decode(Huffman.decode(tree, bitArray));
    }

    /**
     * Build table from tree where each byte represents bit code. For example
     * [0] -> [0, 1]
     * [32] -> [1, 0, 1]
     * ...
     * @param {Node} tree
     * @param {number[]} codes
     * @param {number[][]} table
     */
    private static buildCodeTable(
        tree: Node,
        codes: number[] = [],
        codeTable: number[][] = []
    ): number[][] {
        if (tree.left) {
            this.buildCodeTable(tree.left, [...codes, 0], codeTable);
        }
        if (tree.right) {
            this.buildCodeTable(tree.right, [...codes, 1], codeTable);
        }

        if (!tree.left && !tree.right && typeof tree.value === "number") {
            codeTable[tree.value] = codes;
        }

        return codeTable;
    }

    /**
     * Convert code table to object tree. For example
     * [1] -> [0, 0]
     * goes to
     * { "0": { "0": 1 } }
     * @param {number[][]} codeTable
     */
    private static buildCodeTree(codeTable: number[][]) {
        const tree: Type_HuffmanObjectTree = {};

        for (let i = 0; i < codeTable.length; i++) {
            if (!codeTable[i]) {
                continue;
            }

            // deno-lint-ignore no-explicit-any
            let branch: any = tree;
            for (let j = 0; j < codeTable[i].length; j++) {
                const id = codeTable[i][j];
                if (!branch[id]) {
                    branch[id] = {};
                }

                if (j === codeTable[i].length - 1) {
                    branch[id] = i;
                }
                branch = branch[id];
            }
        }

        return tree;
    }
}

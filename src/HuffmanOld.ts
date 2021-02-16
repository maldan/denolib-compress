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

export class HuffmanOld {
    static encode(data: Uint8Array) {
        const table = new Array(255).fill(0);
        let freqList: NodeData[] = [];

        for (let i = 0; i < data.length; i++) {
            table[data[i]] += 1;
        }

        // Frequency list
        freqList = table
            .map((x, i) => [i, x])
            .filter((x) => x[1] > 0)
            .sort((a, b) => a[1] - b[1])
            .map((x) => {
                return new NodeData(x[0], x[1]);
            });

        // Build tree
        while (freqList.length > 1) {
            freqList[0] = new Node(freqList[0], freqList[1]);
            freqList.splice(1, 1);
            freqList = freqList.sort((a, b) => a.priority - b.priority);
        }

        // Build table
        const codeTable = this.buildTable(freqList[0] as Node, [], []);

        const bitArray = [];
        for (let i = 0; i < data.length; i++) {
            bitArray.push(...codeTable[data[i]]);
        }

        // deno-lint-ignore no-explicit-any
        const binaryTree: any = []; // tree length
        binaryTree.push(...this.binToBit(codeTable.filter(Boolean).length));

        // Write code lengths

        // Write value & code
        for (let i = 0; i < codeTable.length; i++) {
            if (codeTable[i]) {
                binaryTree.push(...this.binToBit(i));
                binaryTree.push(...this.binToBit(codeTable[i].length));
                binaryTree.push(...codeTable[i]);
            }
        }

        console.log("data", this.bitToBin(binaryTree));

        return new Uint8Array([...this.bitToBin(binaryTree), ...this.bitToBin(bitArray)]);
    }

    static decode(data: Uint8Array) {
        /*const data4 = data3.slice(1);
        const len = data3[0];
        const table: number[][] = [];
        const tree: { [x: string]: unknown } = {};

        const codes = data4.slice(0, len * 3);

        for (let i = 0; i < codes.length; i += 3) {
            const codeLength = codes[i + 1];
            const code = this.binToBit(new Uint8Array([])).slice(0, codeLength);
            table[codes[i]] = code;
            console.log("code", code);
        }

        let dataX = this.binToBit(data4.slice(len * 3));*/

        const treeLen = data[0];
        const table: number[][] = [];
        const tree: { [x: string]: unknown } = {};
        let bitArray = this.binToBit(data.slice(1));

        for (let i = 0; i < treeLen; i++) {
            const char = this.bitToBin(bitArray.slice(0, 8))[0];
            const len = this.bitToBin(bitArray.slice(8, 8 + 8))[0];
            const code = bitArray.slice(8 + 8, 8 + 8 + len);
            bitArray = bitArray.slice(8 + 8 + len);
            table[char] = code;
        }

        console.log(this.bitToBin(bitArray));

        for (let i = 0; i < table.length; i++) {
            if (!table[i]) {
                continue;
            }

            // deno-lint-ignore no-explicit-any
            let branch: any = tree;
            for (let j = 0; j < table[i].length; j++) {
                const id = table[i][j];
                if (!branch[id]) {
                    branch[id] = {};
                }

                if (j === table[i].length - 1) {
                    branch[id] = i;
                }
                branch = branch[id];
            }
        }

        const out: number[] = [];
        // deno-lint-ignore no-explicit-any
        let branch: any = tree;
        for (let i = 0; i < bitArray.length; i++) {
            branch = branch[bitArray[i]];
            if (typeof branch === "number") {
                out.push(branch);
                branch = tree;
            }
        }

        return new Uint8Array(out);
    }

    static bitToBin(bitArray: number[]): number[] {
        const byteArray = [];
        for (let i = 0; i < bitArray.length; i += 8) {
            byteArray.push(
                (bitArray[i + 0] ?? 0) * 1 +
                    (bitArray[i + 1] ?? 0) * 2 +
                    (bitArray[i + 2] ?? 0) * 4 +
                    (bitArray[i + 3] ?? 0) * 8 +
                    (bitArray[i + 4] ?? 0) * 16 +
                    (bitArray[i + 5] ?? 0) * 32 +
                    (bitArray[i + 6] ?? 0) * 64 +
                    (bitArray[i + 7] ?? 0) * 128
            );
        }
        return byteArray;
    }

    static binToBit(byteArray: Uint8Array | number) {
        if (typeof byteArray === "number") {
            return [
                byteArray & 1,
                (byteArray & 2) >> 1,
                (byteArray & 4) >> 2,
                (byteArray & 8) >> 3,
                (byteArray & 16) >> 4,
                (byteArray & 32) >> 5,
                (byteArray & 64) >> 6,
                (byteArray & 128) >> 7,
            ];
        } else {
            const bitArray = [];
            for (let i = 0; i < byteArray.length; i++) {
                bitArray.push(
                    byteArray[i] & 1,
                    (byteArray[i] & 2) >> 1,
                    (byteArray[i] & 4) >> 2,
                    (byteArray[i] & 8) >> 3,
                    (byteArray[i] & 16) >> 4,
                    (byteArray[i] & 32) >> 5,
                    (byteArray[i] & 64) >> 6,
                    (byteArray[i] & 128) >> 7
                );
            }
            return bitArray;
        }
    }

    static buildTable(tree: Node, codes: number[] = [], table: number[][]) {
        if (tree.left) {
            this.buildTable(tree.left, [...codes, 0], table);
        }
        if (tree.right) {
            this.buildTable(tree.right, [...codes, 1], table);
        }

        if (!tree.left && !tree.right && typeof tree.value === "number") {
            table[tree.value] = codes;
        }

        return table;
    }
}

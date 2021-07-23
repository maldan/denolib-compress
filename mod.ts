import { BitArray } from "./deps.ts";

// deno-lint-ignore camelcase
export type Type_HuffmanObjectTree = { [x: string]: [x: string] | number };

// deno-lint-ignore camelcase
export type Type_HuffmanEncodeResult = {
    codeTable: number[][];
    bitArray: BitArray;
    tree: Type_HuffmanObjectTree;
};

export { Huffman } from "./src/huffman/Huffman.ts";

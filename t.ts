import { Huffman } from "./src/huffman/Huffman.ts";

/*const jj = Huffman.encode(
    //new Uint8Array(new Array(255).fill(0).map((x, i) => i))
    new TextEncoder().encode(`c`)
);
console.log(jj);
console.log(new TextDecoder().decode(Huffman.decode(jj.tree, jj.bitArray)));*/

Huffman.buildCodeTableFromLength([3, 2], [1, 2]);
Huffman.buildCodeTableFromLength([1, 0, 12, 2, 11, 31, 21], [1, 3, 3, 4, 4, 4, 5]);
Huffman.buildCodeTableFromLength([0, 1], [1, 2]);
console.log(Huffman.buildCodeTableFromLength([11, 0, 1], [1, 2, 3]));

/*console.log("binary data", jj);

const ii = HuffmanOld.decode(jj);
console.log("original", ii);
console.log("original", new TextDecoder().decode(ii));

console.log("compressed", (((1 - jj.length / ii.length) * 100) | 0) + "%");*/

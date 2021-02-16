import { Huffman } from "./src/huffman/Huffman.ts";

const jj = Huffman.encode(
    //new Uint8Array(new Array(255).fill(0).map((x, i) => i))
    new TextEncoder().encode(`c`)
);
console.log(jj);
console.log(new TextDecoder().decode(Huffman.decode(jj.tree, jj.bitArray)));

/*console.log("binary data", jj);

const ii = HuffmanOld.decode(jj);
console.log("original", ii);
console.log("original", new TextDecoder().decode(ii));

console.log("compressed", (((1 - jj.length / ii.length) * 100) | 0) + "%");*/

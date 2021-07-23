import { assertEquals, assertThrows } from "https://deno.land/std@0.86.0/testing/asserts.ts";
import { Huffman } from "../mod.ts";

Deno.test("little english text", () => {
    ["", "c", "123", "beep boop beer!", "1234567890-=qwedsfsfgsrgsdnvlbnsdkfj"].forEach((x) => {
        const r = Huffman.encodeText(x);
        assertEquals(Huffman.decodeText(r.tree, r.bitArray), x);
    });
});

Deno.test("little utf text", () => {
    ["", "пример", "каждый лист", "дерево "].forEach((x) => {
        const r = Huffman.encodeText(x);
        assertEquals(Huffman.decodeText(r.tree, r.bitArray), x);
    });
});

Deno.test("bit english text", () => {
    [
        "The most essential aspect of a column is accessing the property holding the data for that column on each object in the data array. If that member is at the top level, Column can simply be a property accessor, which is either a string (if it's a plain object) or a number (if it's an array).",
    ].forEach((x) => {
        const r = Huffman.encodeText(x);
        assertEquals(Huffman.decodeText(r.tree, r.bitArray), x);
    });
});

Deno.test("bit utf text", () => {
    [
        `Для этого алгоритма вам потребуется минимальное понимание устройства бинарного дерева и очереди с приоритетами. В исходном коде я использовал код очереди с приоритетами из моей предыдущей статьи.

        Предположим, у нас есть строка «beep boop beer!», для которой, в её текущем виде, на каждый знак тратится по одному байту. Это означает, что вся строка целиком занимает 15*8 = 120 бит памяти. После кодирования строка займёт 40 бит (на практике, в нашей программе мы выведем на консоль последовательность из 40 нулей и единиц, представляющих собой биты кодированного текста. Чтобы получить из них настоящую строку размером 40 бит, нужно применять битовую арифметику, поэтому мы сегодня не будем этого делать).`,
        "Чтобы лучше понять пример, мы для начала сделаем всё вручную. Строка «beep boop beer!» для этого очень хорошо подойдёт. Чтобы получить код для каждого символа на основе его частотности, нам надо построить бинарное дерево, такое, что каждый лист этого дерева будет содержать символ (печатный знак из строки). Дерево будет строиться от листьев к корню, в том смысле, что символы с меньшей частотой будут дальше от корня, чем символы с большей. Скоро вы увидите, для чего это нужно.",
    ].forEach((x) => {
        const r = Huffman.encodeText(x);
        assertEquals(Huffman.decodeText(r.tree, r.bitArray), x);
    });
});

Deno.test("build codes from length", () => {
    let t1 = Huffman.buildCodeTableFromLength([3, 2], [1, 2]);
    assertEquals(t1[3], [0]);
    assertEquals(t1[2], [1, 0]);

    t1 = Huffman.buildCodeTableFromLength([1, 0, 12, 2, 11, 31, 21], [1, 3, 3, 4, 4, 4, 5]);
    assertEquals(t1[1], [0]);
    assertEquals(t1[0], [1, 0, 0]);
    assertEquals(t1[12], [1, 0, 1]);
    assertEquals(t1[2], [1, 1, 0, 0]);
    assertEquals(t1[11], [1, 1, 0, 1]);
    assertEquals(t1[31], [1, 1, 1, 0]);
    assertEquals(t1[21], [1, 1, 1, 1, 0]);

    t1 = Huffman.buildCodeTableFromLength([0, 1], [1, 2]);
    assertEquals(t1[0], [0]);
    assertEquals(t1[1], [1, 0]);

    t1 = Huffman.buildCodeTableFromLength([11, 0, 1], [1, 2, 3]);
    assertEquals(t1[11], [0]);
    assertEquals(t1[0], [1, 0]);
    assertEquals(t1[1], [1, 1, 0]);
});

const { disassembleHangul } = require("@toss/hangul");

class Utils {
  static removeAllSpace(str) {
    return str.replace(/\s+/g, "");
  }

  static extractChosungs(hangulGroups) {
    return hangulGroups
      .map((subGroup) => subGroup[0])
      .filter((char) => jaeum.has(char))
      .join("");
  }

  /*
  0. str이 영어인가? 한글인가?
  1. 한글이면 그냥 (자음/모음, 초성, 알파벳) 분해으로
  2. 영어이면 한글로 바꿔서 (자음/모음, 초성, 알파벳) 분해
  3. 한글과 영어가 섞여 있으면 한글/영어 둘 다 만들어서 -> 1, 2로
  */

  static convertToChosung(str) {
    return str
      .split("")
      .map((char) => hangulAndAlphabetToChosungMap[char] || "")
      .join("");
  }

  static convertToHangul(str) {
    return this.convertTo(str, alphabetToHangulMap);
  }

  static convertToAlphabet(str) {
    return this.convertTo(str, hangulToAlphabetMap);
  }

  static convertTo(str, map) {
    return str
      .split("")
      .map((char) => map[char] || char)
      .join("");
  }
}

const alphabetToHangulMap = {
  q: "ㅂ",
  w: "ㅈ",
  e: "ㄷ",
  r: "ㄱ",
  t: "ㅅ",
  y: "ㅛ",
  u: "ㅕ",
  i: "ㅑ",
  o: "ㅐ",
  p: "ㅔ",
  a: "ㅁ",
  s: "ㄴ",
  d: "ㅇ",
  f: "ㄹ",
  g: "ㅎ",
  h: "ㅗ",
  j: "ㅓ",
  k: "ㅏ",
  l: "ㅣ",
  z: "ㅋ",
  x: "ㅌ",
  c: "ㅊ",
  v: "ㅍ",
  b: "ㅠ",
  n: "ㅜ",
  m: "ㅡ",
  Q: "ㅃ",
  W: "ㅉ",
  E: "ㄸ",
  R: "ㄲ",
  T: "ㅆ",
  O: "ㅒ",
  P: "ㅖ",
};

const hangulToAlphabetMap = {
  ㅂ: "q",
  ㄱ: "r",
  ㅈ: "w",
  ㄷ: "e",
  ㅅ: "t",
  ㅛ: "y",
  ㅕ: "u",
  ㅑ: "i",
  ㅐ: "o",
  ㅔ: "p",
  ㅁ: "a",
  ㄴ: "s",
  ㅇ: "d",
  ㄹ: "f",
  ㅎ: "g",
  ㅗ: "h",
  ㅓ: "j",
  ㅏ: "k",
  ㅣ: "l",
  ㅋ: "z",
  ㅌ: "x",
  ㅊ: "c",
  ㅍ: "v",
  ㅠ: "b",
  ㅜ: "n",
  ㅡ: "m",
  ㅃ: "Q",
  ㅉ: "W",
  ㄸ: "E",
  ㄲ: "R",
  ㅆ: "T",
  ㅒ: "O",
  ㅖ: "P",
};

const hangulAndAlphabetToChosungMap = {
  ㄱ: "ㄱ",
  ㄲ: "ㄲ",
  ㄴ: "ㄴ",
  ㄷ: "ㄷ",
  ㄸ: "ㄸ",
  ㄹ: "ㄹ",
  ㅁ: "ㅁ",
  ㅂ: "ㅂ",
  ㅃ: "ㅃ",
  ㅅ: "ㅅ",
  ㅆ: "ㅆ",
  ㅇ: "ㅇ",
  ㅈ: "ㅈ",
  ㅉ: "ㅉ",
  ㅊ: "ㅊ",
  ㅋ: "ㅋ",
  ㅌ: "ㅌ",
  ㅍ: "ㅍ",
  ㅎ: "ㅎ",
  r: "ㄱ", // ㄱ key
  R: "ㄲ", // ㄲ key
  s: "ㄴ", // ㄴ key
  e: "ㄷ", // ㄷ key
  E: "ㄸ", // ㄸ key
  f: "ㄹ", // ㄹ key
  a: "ㅁ", // ㅁ key
  q: "ㅂ", // ㅂ key
  Q: "ㅃ", // ㅃ key
  t: "ㅅ", // ㅅ key
  T: "ㅆ", // ㅆ key
  d: "ㅇ", // ㅇ key
  w: "ㅈ", // ㅈ key
  W: "ㅉ", // ㅉ key
  c: "ㅊ", // ㅊ key
  z: "ㅋ", // ㅋ key
  x: "ㅌ", // ㅌ key
  v: "ㅍ", // ㅍ key
  g: "ㅎ", // ㅎ key
};

const jaeum = new Set([
  "ㄱ",
  "ㄲ",
  "ㄴ",
  "ㄷ",
  "ㄸ",
  "ㄹ",
  "ㅁ",
  "ㅂ",
  "ㅃ",
  "ㅅ",
  "ㅆ",
  "ㅇ",
  "ㅈ",
  "ㅉ",
  "ㅊ",
  "ㅋ",
  "ㅌ",
  "ㅍ",
  "ㅎ",
]);

module.exports = Utils;

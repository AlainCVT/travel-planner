const isPlural = (count: number): boolean => Math.abs(count) !== 1;
const simplePlural = <T extends string>(word: T): `${T}s` => `${word}s`;

const pluralize = <T extends string>(
  count: number,
  word: T,
  plural: (word: T) => string = simplePlural,
): T | `${T}s` | string => (isPlural(count) ? plural(word) : word);

pluralize.withCount = <T extends string>(
  count: number,
  word: T,
  plural: (word: T) => string = simplePlural,
): `${number} ${T}` | `${number} ${T}s` | `${number} ${string}` =>
  `${count} ${pluralize(count, word, plural)}`;

export { pluralize };

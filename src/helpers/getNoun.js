/**
 * Clones nouns depending on the numeral on which they depend.
 * @param { number } number
 * @param { string } singular The singular noun.
 * @param { string } plural The plural noun.
 */
export const getNounEn = (number, singular, plural) => {
  const num = Math.abs(number);

  return num === 1 ? singular : plural;
};

/**
 * Clones Russian nouns depending on the numeral on which they depend.
 * @param { number } number
 * @param { string } one Данное существительное при числе 1.
 * @param { string } two Данное существительное при числе от 2 до 4.
 * @param { string } five Данное существительное при числе 0 и от 5 до 10.
 */
export default (number, one, two, five) => {
  let num = Math.abs(number);

  num %= 100;

  if (num >= 5 && num <= 20) {
    return five;
  }

  num %= 10;

  if (num === 1) {
    return one;
  }

  if (num >= 2 && num <= 4) {
    return two;
  }

  return five;
};

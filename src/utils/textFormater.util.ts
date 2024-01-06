export const formatVowelSoundLabel = (label?: string): string => {
  if (!label) return '';

  const wordsStartWithVowelSound = ['a', 'e', 'i', 'o', 'u'];
  const specialCases = ['hour', 'honest', 'honor', 'heir', 'university', 'one'];
  const firstLetter = label[0].toLowerCase();
  const word = label.toLowerCase();

  if (specialCases.includes(word)) {
    return `an ${label}`;
  }

  return wordsStartWithVowelSound.includes(firstLetter)
    ? `an ${label}`
    : `a ${label}`;
};

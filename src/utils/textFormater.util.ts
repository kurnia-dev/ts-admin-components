export const formatUserName = (name: string) => {
  if (name.length > 8) {
    const splitted = name.split(' ');
    if (splitted.length > 1) {
      let firstWord;
      const lastWord = splitted[splitted.length - 1];
      const firstToRestWord = splitted.slice(0, -1).join(' ');
      if (firstToRestWord.length > 8) {
        firstWord = `${firstToRestWord.slice(0, 8)}..`;
      } else {
        firstWord = firstToRestWord;
      }
      return `${firstWord} ${lastWord.slice(0, 1)}`;
    } else {
      const word = splitted[0];
      return word.length > 8 ? `${word.slice(0, 8)}..` : word;
    }
  } else {
    return name;
  }
};

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

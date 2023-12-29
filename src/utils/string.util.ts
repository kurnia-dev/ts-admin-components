const formatUserName = (name: string) => {
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

const StringUtils = { formatUserName };

export default StringUtils;

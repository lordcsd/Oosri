export function MakeFirstLettersCapital(text: string): string {
  let newText = '';
  const words = text.split(' ');
  for (const i in words) {
    for (const characterIndex in words[i].split('')) {
      newText +=
        +characterIndex == 0
          ? words[i][characterIndex].toUpperCase()
          : words[i][characterIndex].toLowerCase();
    }
    if (+i + 1 < words.length) {
      newText += ' ';
    }
  }
  return newText;
}

export const shuffleArray = <T>(array: Array<T>): Array<T> => {
  const shuffled = JSON.parse(JSON.stringify(array)) as Array<T>;

  // Fisher-Yates shuffle
  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(Math.random() * (index + 1));
    const current = shuffled[index]!;
    shuffled[index] = shuffled[randomIndex]!;
    shuffled[randomIndex] = current;
  }

  return shuffled;
};

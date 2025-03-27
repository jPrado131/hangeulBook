// Function to shuffle an array
export const shuffleArray = <T,>(array: T[]): T[] => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};

// Function to generate random numbers excluding a specific number
export const getRandomNumber = (
  exclude: number,
  max: number,
  dataLength: number
): number[] => {
  const randomNumbers = [exclude];
  while (randomNumbers.length < max + 1) {
    const randomNumber = Math.floor(Math.random() * dataLength);
    if (!randomNumbers.includes(randomNumber) && randomNumber !== exclude) {
      randomNumbers.push(randomNumber);
    }
  }
  return shuffleArray(randomNumbers);
};

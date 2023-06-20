export const rearrangeArray = (array, sorting) => {
  const rearrangedArray = [];

  for (let i = 0; i < sorting.length; i++) {
    const index = sorting[i];
    rearrangedArray.push(array[index]);
  }

  return rearrangedArray;
}
export function getUniqueStringArr(arr: string[]): string[] {
  return [...new Set(arr)];
}

export function getUniqueObjectArr(arr: any[], key: string): any[] {
  const keyExistMap = {};
  const uniqueArr = [];
  for (let i = 0; i < arr.length; i++) {
    const item = arr[i];
    if (!keyExistMap[item[key]]) {
      keyExistMap[item[key]] = true;
      uniqueArr.push(item);
    }
  }
  return uniqueArr;
}

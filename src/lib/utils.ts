const byteToMb = (sizeByte: number) => sizeByte / 1024 / 1024;

const ratioToPercent = (ratio: number) =>
  Number(((1 - ratio) * 100).toFixed(2));

export { byteToMb, ratioToPercent };

const byteToMb = (sizeByte: number) => sizeByte / 1024 / 1024;

const ratioToPercent = (ratio: number) => (1 - ratio) * 100;

export { byteToMb, ratioToPercent };

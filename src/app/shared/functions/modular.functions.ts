import { KeyValue } from "@angular/common";
import { polygonColors } from "../models";

export function downloadFile(data: any, fileName: string) {
  var blob = new Blob([data], { type: 'application/octet-stream;charset=utf-8;' });
  var url = URL.createObjectURL(blob);
  var a = document.createElement('a');
  a.href = url;
  a.download = `${fileName}.csv`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export const originalOrder = (a: KeyValue<string, string>, b: KeyValue<string, string>): number => {
  return 0;
}

/**
 * Method that convert number into a string with 2 decimal points and currency icon
 * @param num 
 * @returns 
 */
export const formatNum = (num: number) => {
  const obj = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  })
  return obj.format(num);
}

/**
 * Method that picks random value from polygonColors Array
 */
export function pickRandomPolygonColor() {
  return polygonColors[Math.floor(Math.random() * polygonColors.length)];
}
export const toISTString = (unixtime: number): string => {
  const dateObject = new Date(unixtime);
  const humanDateFormat = dateObject.toString();
  return humanDateFormat.substring(0, humanDateFormat.indexOf(':') - 3);
};

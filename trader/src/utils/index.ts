export const fromDateToString = (date: Date) => {
  return date.toISOString().split('T')[0];
};

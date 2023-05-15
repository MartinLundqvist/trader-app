export const getDaysDifference = (date1: Date, date2: Date) => {
  // Get the difference in milliseconds
  const diffInMilliseconds = Math.abs(date2.getTime() - date1.getTime());

  // Convert milliseconds to days (1 day = 24 hours * 60 minutes * 60 seconds * 1000 milliseconds)
  const diffInDays = Math.floor(diffInMilliseconds / (1000 * 60 * 60 * 24));

  return diffInDays;
};

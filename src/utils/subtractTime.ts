export function subtractTime(time1: string, time2: string): string {
  // Split the time strings into hours, minutes, and seconds
  const [h1, m1, s1] = time1.split(":").map(Number);
  const [h2, m2, s2] = time2.split(":").map(Number);

  // Convert the times to total seconds
  const totalSeconds1 = h1 * 3600 + m1 * 60 + s1;
  const totalSeconds2 = h2 * 3600 + m2 * 60 + s2;

  // Calculate the difference in seconds
  const difference = totalSeconds1 - totalSeconds2;

  // Handle negative differences
  const sign = difference < 0 ? "-" : "";
  const absDifference = Math.abs(difference);

  // Convert the difference back to hours, minutes, and seconds
  const hours = Math.floor(absDifference / 3600);
  const minutes = Math.floor((absDifference % 3600) / 60);
  const seconds = absDifference % 60;

  // Format the result as "XX:XX:XX" and return
  return `${sign}${hours.toString().padStart(2, "0")}:${minutes
    .toString()
    .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
}

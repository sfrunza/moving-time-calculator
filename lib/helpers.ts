export function convertMinutesToHoursAndMinutes(minutes: number | null) {
  if (!minutes) return "";
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  const formattedHours = hours > 0 ? `${hours}h` : "";
  const formattedMinutes = remainingMinutes > 0 ? `${remainingMinutes}min` : "";
  return `${formattedHours} ${formattedMinutes}`.trim();
}


export function roundToNearestQuarter(minutes: number) {
  const roundedMinutes = Math.ceil(minutes / 15) * 15;
  return roundedMinutes === 60 ? 0 : roundedMinutes; //Reset to 0 if it reaches 60
}

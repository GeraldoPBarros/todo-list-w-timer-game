interface RewardsArray {
  data: {
    time: string;
    date: string;
  };
}

export const levels = [
  [0, 89.9999999999],
  [90, 179.9999999999],
  [180, 359.9999999999],
  [360, 719.9999999999],
  [720, 1000000.9999999999],
];

export function calculateParticipantLevel(timeArray: RewardsArray[]) {
  let lvlIndex = 0;
  let lvlIndexFlag = false;
  const totalSeconds = timeArray.reduce((accumulator, item) => {
    const [hours, minutes, seconds] = item.data.time.split(":").map(Number);
    return accumulator + hours * 3600 + minutes * 60 + seconds;
  }, 0);

  const totalMinutes = totalSeconds / 60;
  let percentValue = 0;

  while (lvlIndexFlag === false) {
    if (
      totalMinutes >= levels[lvlIndex][0] &&
      totalMinutes < levels[lvlIndex][1]
    ) {
      percentValue =
        (totalMinutes - levels[lvlIndex][0]) /
        (levels[lvlIndex][1] - levels[lvlIndex][0]);
      lvlIndexFlag = true;
    } else {
      lvlIndex += 1;
    }
  }

  return [lvlIndex == 0 ? 1 : lvlIndex, percentValue * 100];
}

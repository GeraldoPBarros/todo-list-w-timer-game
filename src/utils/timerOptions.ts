export const time_to_select_lv1 = [
  "10 min",
  "15 min",
  "20 min",
  "25 min",
  "30 min",
];

export const time_on_timer_lv1 = [
  "00:10:00",
  "00:15:00",
  "00:20:00",
  "00:25:00",
  "00:30:00",
];

export function getLastRewardInfo(time: string) {
  let index = 0;
  for (let x = 0; x < time_on_timer_lv1.length; x++) {
    if (time_on_timer_lv1[x] === time){
      index = x;
      break;
    }
  }
  return time_to_select_lv1[index];
}

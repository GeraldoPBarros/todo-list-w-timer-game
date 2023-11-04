type HistorySelector = "7 days" | "15 days" | "30 days" | "60 days"; // | "All";

export const history_options: HistorySelector[] = [
  "7 days",
  "15 days",
  "30 days",
  "60 days",
];

export function getHistoryTags(tags: string[]) {
  let formatedTags = "";

  for (let x = 0; x < tags.length; x++) {
    if (x < tags.length - 1) {
      formatedTags += `${tags[x]}, `;
    } else {
      formatedTags += tags[x];
    }
  }
  return formatedTags;
}

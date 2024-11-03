import { DateTime } from "luxon";

export async function convertDateText(
  messageContent: string,
  userTimeZone: string
) {
  const timeRegex = /\b\d{1,2}(:\d{2})?\s?(AM|PM|am|pm)?\b/;
  const textContainsTime = timeRegex.test(messageContent);

  if (textContainsTime) {
    const match = messageContent.match(timeRegex);
    if (match) {
      const [hour, modifier] = match[0].toLowerCase().includes("pm")
        ? [parseInt(match[0]), "PM"]
        : [parseInt(match[0]), "AM"];

      const localTime = DateTime.now().set({
        hour: modifier === "PM" ? hour + 12 : hour,
        minute: 0,
        second: 0,
      });

      const currentZoneTime = localTime.setZone(userTimeZone);

      messageContent = messageContent.replace(
        match[0],
        `${currentZoneTime.toFormat("hh:mma ccc")} ${userTimeZone}`
      );

      return messageContent;
    }
  }
}

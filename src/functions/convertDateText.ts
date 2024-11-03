import { DateTime } from "luxon";

export async function convertDateText(
  messageContent: string,
  userTimeZone: string
) {
  console.log(messageContent);
  const timeRegex = /\b\d{1,2}(:\d{2})?\s?(AM|PM|am|pm)?\b/;
  const textContainsTime = timeRegex.test(messageContent);

  if (textContainsTime) {
    const match = messageContent.match(timeRegex);
    if (match) {
      console.log("Time Found in text: ", match[0]);

      const [hour, modifier] = match[0].toLowerCase().includes("pm")
        ? [parseInt(match[0]), "PM"]
        : [parseInt(match[0]), "AM"];

      const localTime = DateTime.now().set({
        hour: modifier === "PM" ? hour + 12 : hour,
        minute: 0,
        second: 0,
      });
      console.log("Local extracted time:", localTime.toString());

      // Convert this time to the Asia/Tokyo time zone
      const currentZoneTime = localTime.setZone(userTimeZone);
      console.log(
        `Time in ${userTimeZone} time:`,
        currentZoneTime.toFormat("hh mm a ccc")
      );

      // Replace the time in the original text with the converted Tokyo time
      messageContent = messageContent.replace(
        match[0],
        `${currentZoneTime.toFormat("hh mm a ccc")} ${userTimeZone}`
      );

      return messageContent;
    }
  }
}

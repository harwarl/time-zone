import moment from "moment-timezone";

export function convertDateText(
  messageContent: string,
  fromTimeZone: string,
  toTimeZone: string
): string {
  const timeRegex = /\b\d{1,2}(:\d{2})?\s?(AM|PM|am|pm)\b/;
  const dateRegex = /\b(\d{1,2})\/(\d{1,2})\/(\d{4})\b/;

  const timeMatch = messageContent.match(timeRegex);
  const dateMatch = messageContent.match(dateRegex);

  let momentTime;

  if (timeMatch && dateMatch) {
    const inputTime = timeMatch[0];
    const inputDate = dateMatch[0];

    const [day, month, year] = inputDate.split("/").map(Number);
    const formattedDate = `${year}-${String(month).padStart(2, "0")}-${String(
      day
    ).padStart(2, "0")}`;

    const dateTimeString = `${formattedDate} ${inputTime}`;
    momentTime = moment.tz(dateTimeString, "YYYY-MM-DD h:mm A", fromTimeZone);
  } else if (dateMatch) {
    const inputDate = dateMatch[0];
    const [day, month, year] = inputDate.split("/").map(Number);
    const formattedDate = `${year}-${String(month).padStart(2, "0")}-${String(
      day
    ).padStart(2, "0")}`;

    momentTime = moment.tz(formattedDate, "YYYY-MM-DD", fromTimeZone);
  } else if (timeMatch) {
    const inputTime = timeMatch[0];
    const currentDate = moment().format("YYYY-MM-DD");
    const dateTimeString = `${currentDate} ${inputTime}`;
    momentTime = moment.tz(dateTimeString, "YYYY-MM-DD h:mm A", fromTimeZone);
  }

  if (momentTime) {
    const convertedTime = momentTime.clone().tz(toTimeZone);

    if (timeMatch) {
      messageContent = messageContent.replace(
        timeMatch[0],
        convertedTime.format("HH:mm")
      );
    }
    if (dateMatch) {
      messageContent = messageContent.replace(
        dateMatch[0],
        convertedTime.format("YYYY-MM-DD")
      );
    }
  }

  return messageContent;
}

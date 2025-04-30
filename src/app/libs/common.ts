export const getDateFormat = (date: Date) => {
  const newDate = new Date(date);
  const formattedDate = newDate.toLocaleDateString("en-US", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    weekday: "short",
  });
  return formattedDate;
};

export const splitName = (name: string) => {
  let firstName = "";
  let lastName = "";
  if (name) {
    var words = name.split(" ");
    firstName = words[0];
    lastName = words.slice(1).join(" ");
  }
  return {
    firstName,
    lastName,
  };
};

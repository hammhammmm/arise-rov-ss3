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

const EARTH_RADIUS_KM = 6_371.0088; // WGS-84 mean radius

const toRad = (deg: number): number => deg * (Math.PI / 180);

export const haversineDistance = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number => {
  const φ1 = toRad(lat1);
  const φ2 = toRad(lat2);
  const Δφ = toRad(lat2 - lat1);
  const Δλ = toRad(lon2 - lon1);

  const a =
    Math.sin(Δφ / 2) ** 2 +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) ** 2;

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return EARTH_RADIUS_KM * c;
};
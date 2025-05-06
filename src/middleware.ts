import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { toZonedTime } from "date-fns-tz";

const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

export async function middleware(request: NextRequest) {
  let previousURL = "";
  const cspHeader = `
    default-src 'self' data:;
    connect-src 'self' https://login.microsoftonline.com ${baseUrl};
    script-src 'self' 'unsafe-inline' 'unsafe-eval';
    style-src 'self' 'unsafe-inline' https://fonts.googleapis.com/css2?family=Monoton&display=swap;
`;

  const contentSecurityPolicyHeaderValue = cspHeader
    .replace(/\s{2,}/g, " ")
    .trim();

  const requestHeaders = new Headers(request.headers);

  requestHeaders.set(
    "Content-Security-Policy",
    contentSecurityPolicyHeaderValue
  );

  const Redirect = () => {
    return NextResponse.redirect(new URL("/", request.url));
  };

  const { pathname }: { pathname: string } = request.nextUrl;

  // Convert the ISO strings to Date objects.
  const workingHoursEnv = process.env.WORKING_HOURS;
  const workingHours = workingHoursEnv ? JSON.parse(workingHoursEnv) : null;
  const [startStr, endStr] = workingHours;
  const startTime = new Date(startStr);
  const endTime = new Date(endStr);

  // Define the time zone for Asia/Bangkok.
  const timeZone = "Asia/Bangkok";
  const now = new Date();

  // Convert the current UTC time to the Bangkok time zone.
  const nowInBangkok = toZonedTime(now, timeZone);

  if (pathname != "/closed") {
    // Check if the current time falls outside the defined working hours.
    if (nowInBangkok < startTime || nowInBangkok > endTime) {
      return NextResponse.redirect(new URL("/closed", request.url));
    }
  }

  const cookie = request.cookies.get("token");
  const authRoutes = ["/redeem"];

  console.log(cookie);

  if (pathname == "/login") {
    return NextResponse.next();
  }

  if (!cookie) {
    console.log("no cookie");
    return NextResponse.redirect(new URL("/login", request.url));
  }

  const token = cookie.value;

  const redirectToLogout = (url: string) =>
    NextResponse.redirect(new URL("/logout", url));

  // Check if token is missing
  if (!token) {
    console.log("no token");
    return redirectToLogout(request.url);
  }

  if (!token && pathname == "/") {
    return Redirect();
  }

  const response = NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
  response.headers.set(
    "Content-Security-Policy",
    contentSecurityPolicyHeaderValue
  );

  return response;
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: ["/", "/redeem/:path*", "/login/:path*"],
};

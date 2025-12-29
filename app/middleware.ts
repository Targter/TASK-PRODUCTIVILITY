import { withAuth } from "next-auth/middleware";

export default withAuth({
  pages: {
    signIn: "/login",
  },
});

export const config = {
  // Protect these routes.
  // The matcher syntax ensures it catches sub-paths like /notes/123
  matcher: [
    "/",
    "/tasks/:path*",
    "/notes/:path*",
    "/reminders/:path*",
    "/analytics/:path*",
  ],
};
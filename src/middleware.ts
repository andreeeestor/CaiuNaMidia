export { default } from "next-auth/middleware";

export const config = {
  matcher: ["/dashboard/:path*", "/api/upload/:path*", "/api/images/:path*"],
};
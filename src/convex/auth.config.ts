export default {
  providers: [
    {
      domain: process.env.CONVEX_SITE_URL!,
      applicationID: "convex",
    },
    {
      domain: process.env.AUTH_GOOGLE_DOMAIN!,
      applicationID: process.env.AUTH_GOOGLE_CLIENT_ID!,
      applicationSecret: process.env.AUTH_GOOGLE_CLIENT_SECRET!,
    }
  ],
};
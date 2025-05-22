import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "firebasestorage.googleapis.com",
        port: "", // port is optional, empty string is fine if not needed
        // This pathname should match the structure of your Firebase Storage URLs
        // The `**` at the end is a wildcard to match any path after `/o/`
        pathname: "/v0/b/my-wedding-79433.firebasestorage.app/o/**",
      },
      {
        //https://lh3.googleusercontent.com/a/ACg8ocI2OLHX0TN6Ox8tZFpInit2nuHcl5ncY6WoLgWjs0f2QqzOVMqVtg=s96-c
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
        pathname: "/**",
      },
      // The second entry for "console.firebase.google.com" was incorrect and has been removed.
    ],
  },
};

export default nextConfig;

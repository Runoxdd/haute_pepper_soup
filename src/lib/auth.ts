import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import Facebook from "next-auth/providers/facebook";
// TODO: Add Apple provider once Apple Developer account is set up
// import Apple from "next-auth/providers/apple";

/**
 * Only load the MongoDBAdapter when MONGODB_URI is configured.
 * Without this guard, Auth.js crashes at module-load time in mock mode
 * (no DB) because clientPromise throws immediately when MONGODB_URI is missing.
 */
async function buildAdapter() {
  if (!process.env.MONGODB_URI) return undefined;
  const { MongoDBAdapter } = await import("@auth/mongodb-adapter");
  const { clientPromise } = await import("@/lib/mongodb");
  return MongoDBAdapter(clientPromise);
}

export const { auth, handlers, signIn, signOut } = NextAuth(async () => ({
  adapter: await buildAdapter(),
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
    }),
    Facebook({
      clientId: process.env.AUTH_FACEBOOK_ID,
      clientSecret: process.env.AUTH_FACEBOOK_SECRET,
    }),
    // TODO: Apple provider — requires Apple Developer Program membership
    // Apple({
    //   clientId: process.env.AUTH_APPLE_ID,
    //   clientSecret: process.env.AUTH_APPLE_SECRET,
    // }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 604800, // 7 days in seconds
  },
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async jwt({ token, user }) {
      // Persist the user id from the adapter into the JWT on first sign-in
      if (user?.id) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      // Expose user id on the client-side session object
      if (session.user && token.id) {
        session.user.id = token.id as string;
      }
      return session;
    },
  },
}));

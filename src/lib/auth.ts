import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import Facebook from "next-auth/providers/facebook";
// TODO: Add Apple provider once Apple Developer account is set up
// import Apple from "next-auth/providers/apple";
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import { clientPromise } from "@/lib/mongodb";

// clientPromise is now a lazy-reject promise — safe to import when MONGODB_URI
// is missing (mock mode). The adapter will simply never be called in that case
// because no DB session writes are attempted.
export const { auth, handlers, signIn, signOut } = NextAuth({
  adapter: MongoDBAdapter(clientPromise),
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
    async jwt({ token, user, account }) {
      if (account) {
        console.log(`[Auth] Sign-in attempt: ${user?.email} via ${account.provider}`);
      }
      // Persist the user id and email from the adapter into the JWT
      if (user?.id) {
        token.id = user.id;
      }
      if (user?.email) {
        token.email = user.email;
      }
      return token;
    },
    async session({ session, token }) {
      // Expose user id on the client-side session object
      if (session.user && token.id) {
        session.user.id = token.id as string;
      }
      if (session.user) {
        // console.log(`[Auth] Session active for: ${session.user.email}`);
      }
      return session;
    },
  },
  // Ensure we trust the host (important for Vercel/proxies)
  trustHost: true,
});

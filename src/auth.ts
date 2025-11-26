import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import connectDB from "./lib/dbConnect";
import { User } from "./models/user.model";
import bcrypt from "bcryptjs";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    // step-----> 1 authorize
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, request) {
        await connectDB();
        const email = credentials.email;
        const password = credentials.password as string;
        const user = await User.findOne({ email });

        if (!user) {
          throw new Error("user does't exist");
        }
        const passwordMatch = await bcrypt.compare(password, user?.password);
        if (!passwordMatch) {
          throw new Error("Password is incorrect");
        }

        return {
          id: user?._id.toString(),
          email: user?.email,
          name: user?.name,
          role: user?.role,
          password: user?.password,
        };
      },
    }),
  ],
  // step----->2 callBack st token-->user
  callbacks: {
    // toke data to set user
    jwt({ token, user }) {
      if (user) {
        token.id = user?.id;
        token.name = user?.name;
        token.email = user?.email;
        token.role = user?.role;
      }
      return token;
    },
    // step---->3 token data set in session
    session({ session, token }) {
      if (session.user) {
        session.user.id = token?.id as string;
        session.user.name = token?.name as string;
        session.user.email = token?.email as string;
        session.user.role = token?.role as string;
      }
      return session;
    },
  },
  // step---->4 pages set
  pages: {
    signIn: "/login",
    error: "/login",
  },
  // step-->5 session declare
  session: {
    strategy: "jwt",
    maxAge: 10 * 24 * 60 * 60 * 1000, //token expire 10days
  },
  // step-------6 secret declare
  secret: process.env.AUTH_SECRET,
});

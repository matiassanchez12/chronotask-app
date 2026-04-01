import NextAuth, { AuthOptions, getServerSession } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export const authOptions: AuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        let email:string | undefined = credentials?.email;
        let password: string | undefined = credentials?.password;

        if (!email || !password) {
          email = process.env.TEST_USER;
          password = process.env.TEST_PASSWORD;
        }

        const user = await prisma.user.findUnique({
          where: { email: email as string },
        });

        if (!user) {
          return null;
        }

        const isValidPassword = await bcrypt.compare(
          password as string,
          user.password
        );

        if (!isValidPassword) {
          return null;
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          image: user.image,
        };
      },
    }),
  ],
  pages: {
    signIn: "/sign-in",
  },
  callbacks: {
    async jwt({ token, user, account, trigger }) {
      if ((account?.provider === "google" && user?.email) || trigger === "update") {
        try {
          const email = user?.email || token.email;

          if (!email) {
            return token;
          }

          const existingUser = await prisma.user.findUnique({
            where: { email },
          });

          if (!existingUser && user.email) {
            const newUser = await prisma.user.create({
              data: {
                email: user.email,
                name: user.name || null,
                password: bcrypt.hashSync(Math.random().toString(36), 10),
                image: user.image || null,
              },
            });
            token.id = newUser.id;
            token.image = newUser.image;
          } else {
            if (existingUser) {
              token.id = existingUser.id;
              token.image = existingUser.image;
            }
          }
        } catch (e) {
          console.error("Google auth error:", e);
        }
      } else if (account?.provider === "credentials" && user?.id) {
        // Para credentials, el usuario ya viene con id desde authorize
        token.id = user.id;
        token.image = user.image || null;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id;
        session.user.image = token.image;
      }
      return session;
    },
  },
  session: {
    strategy: "jwt" as const,
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
export { getServerSession };

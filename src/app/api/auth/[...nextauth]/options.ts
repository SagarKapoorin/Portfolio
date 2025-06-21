import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GitHubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
        name: { label: "Name", type: "text" },
      },
      async authorize(credentials) {
        if (!credentials) {
          throw new Error('Credentials are missing');
        }
        const saltRounds = parseInt(process.env.BCRYPT_SALT_ROUNDS || '10', 10);
        let user = await prisma.user.findUnique({ where: { email: credentials.email } });
        if (!user) {
          const hashed = await bcrypt.hash(credentials.password, saltRounds);
          user = await prisma.user.create({
            data: {
              email: credentials.email,
              password: hashed,
              name: credentials.name,
              loginType: 'PASSWORD',
            },
          });
        } else {
          const isPasswordCorrect = await bcrypt.compare(credentials.password, user.password || '');
          if (!isPasswordCorrect) {
            throw new Error('Incorrect password');
          }
        }
        return user;
      },
    }),
    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
      authorization: { params: { scope: 'read:user user:email' } },
      async profile(profile) {
        let user = await prisma.user.findUnique({
          where: { email: profile.email },
        });

        if (!user) {
          user = await prisma.user.create({
            data: {
              email: profile.email,
              name: profile.name,
              loginType: 'GITHUB',
            },
          });
        }

        return user;
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: { params: { scope: 'openid email profile' } },
      async profile(profile) {
        let user = await prisma.user.findUnique({
          where: { email: profile.email },
        });

        if (!user) {
          user = await prisma.user.create({
            data: {
              email: profile.email,
              name: profile.name,
              loginType: 'GOOGLE',
            },
          });
        }

        return user;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id; 
        token.email = user.email; 
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id; 
        session.user.email = token.email; 
      }
      return session;
    },
    async redirect({ url, baseUrl }) {
      return baseUrl;
    },
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/signin",
  },
};


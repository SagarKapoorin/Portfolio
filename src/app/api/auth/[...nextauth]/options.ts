import type { NextAuthOptions } from "next-auth";
import type { JWT } from "next-auth/jwt";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import CredentialsProvider from "next-auth/providers/credentials";
import GitHubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import SpotifyProvider from "next-auth/providers/spotify";
import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';

async function refreshAccessToken(token: JWT): Promise<JWT> {
  try {
    const url = 'https://accounts.spotify.com/api/token';
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: `Basic ${Buffer.from(
          `${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`
        ).toString('base64')}`,
      },
      body: new URLSearchParams({
        grant_type: 'refresh_token',
        refresh_token: token.refreshToken as string,
      }),
    });
    const refreshed = await response.json();
    if (!response.ok) {
      throw refreshed;
    }
    return {
      ...token,
      accessToken: refreshed.access_token,
      accessTokenExpires: Date.now() + refreshed.expires_in * 1000,
      // Fall back to old refresh token
      refreshToken: refreshed.refresh_token ?? token.refreshToken,
    };
  } catch (error) {
    console.error('Error refreshing Spotify access token', error);
    return { ...token, error: 'RefreshAccessTokenError' };
  }
}

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
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
    SpotifyProvider({
      clientId: process.env.SPOTIFY_CLIENT_ID!,
      clientSecret: process.env.SPOTIFY_CLIENT_SECRET!,
      authorization: {
        params: {
          scope:
            'user-read-email user-top-read user-read-playback-state user-modify-playback-state user-read-currently-playing'
        }
      },
      async profile(profile) {
        let user = await prisma.user.findUnique({ where: { email: profile.email! } });
        if (!user) {
          user = await prisma.user.create({
            data: {
              email: profile.email!,
              name: profile.display_name || profile.email!,
              loginType: 'SPOTIFY',
            },
          });
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
    async jwt({ token, user, account }) {
      if (account && user && account.provider === 'spotify') {
        token.id = user.id;
        token.email = user.email;
        token.accessToken = account.access_token;
        token.refreshToken = account.refresh_token;
        token.accessTokenExpires = Date.now() + (account.expires_in as number) * 1000;
      }
      if (token.accessTokenExpires && Date.now() < token.accessTokenExpires) {
        return token;
      }
      if (token.refreshToken) {
        return await refreshAccessToken(token as JWT);
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user._id = token.id;
        session.user.email = token.email as string;
        session.user.accessToken = token.accessToken as string;
        session.user.refreshToken = token.refreshToken as string;
        session.user.accessTokenExpires = token.accessTokenExpires as number;
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


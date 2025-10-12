import { DefaultSession } from 'next-auth';
import 'next-auth';

declare module 'next-auth' {
  interface Session {
    user: {
      _id?: string;
      username?: string;
      accessToken?: string;
      refreshToken?: string;
      accessTokenExpires?: number;
    } & DefaultSession['user'];
  }

  interface User {
    _id?: string;
    username?: string;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    _id?: string;
    username?: string;
    accessToken?: string;
    refreshToken?: string;
    accessTokenExpires?: number;
  }
}
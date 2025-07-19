import { getServerSession } from 'next-auth/next';
import { authOptions } from '../api/auth/[...nextauth]/options';
import { redirect } from 'next/navigation';
import React from 'react';

interface Props {
  children: React.ReactNode;
}


export default async function HireLayout({ children }: Props) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    redirect('/signin');
  }
  return <>{children}</>;
}
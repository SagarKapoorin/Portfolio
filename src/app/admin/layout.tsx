import { ReactNode } from 'react';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../api/auth/[...nextauth]/options';
import { redirect } from 'next/navigation';

interface Props {
  children: ReactNode;
}

/**
 * Server-side layout to protect all /admin routes.
 */
export default async function AdminLayout({ children }: Props) {
  const session = await getServerSession(authOptions);
  // If not signed in or not the admin email, redirect to signin
  if (!session?.user?.email || session.user.email !== process.env.NEXT_PUBLIC_ADMIN_EMAIL) {
    redirect('/signin');
  }
  return <>{children}</>;
}
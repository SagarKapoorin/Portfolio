"use client";
import React, { useState } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { toast } from 'react-toastify';
import { LogOut, Download, LogIn, Menu, X, Home, User, Coffee, Briefcase, CreditCard } from 'lucide-react';
import styled from 'styled-components';
import { usePathname } from 'next/navigation';
import { useRouter } from 'next/navigation'; 

const Header = () => {
  const router = useRouter();
  const pathname = usePathname();
  const { data: session, status } = useSession();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [closing, setClosing] = useState(false);
  // Resume URL from environment variable
  const resumeUrl = process.env.NEXT_PUBLIC_RESUME_URL || '';

  const handleClose = () => {
    setClosing(true);
    setTimeout(() => {
      setSidebarOpen(false);
      setClosing(false);
    }, 300);
  };

  return (
    <StyledWrapper className="relative z-[2000]">
      {/* Mobile navigation toggle */}
      {!sidebarOpen && (
        <button
          className="sm:hidden absolute left-4 top-4 z-20 p-1"
          onClick={() => setSidebarOpen(true)}
        >
          <Menu className="w-6 h-6 text-white" />
        </button>
      )}
      {/* Mobile sidebar menu */}
      {(sidebarOpen || closing) && (
        <div className="fixed inset-0 z-[2100] flex">
          <div className="fixed inset-0 bg-black/50" onClick={handleClose} />
          <div className={`relative w-64 max-w-full h-full flex flex-col justify-between bg-black bg-opacity-60 backdrop-blur-md rounded-tr-2xl rounded-br-2xl p-6 border border-white/10 shadow-lg ${closing ? 'animate-slideOut' : 'animate-slideIn'}`}>
            <div className="space-y-4">
              <button className="mb-4 p-1 rounded-md" onClick={handleClose}>
              <X className="w-6 h-6 text-white" />
            </button>
            <nav className="flex flex-col space-y-2">
              <button className="flex items-center space-x-2 py-2 text-white hover:text-indigo-400 transition-colors duration-200" onClick={() => { setSidebarOpen(false); router.push('/'); }}>
                <Home className="w-5 h-5" />
                <span>Home</span>
              </button>
              <button className="flex items-center space-x-2 py-2 text-white hover:text-indigo-400 transition-colors duration-200" onClick={() => { setSidebarOpen(false); router.push('/aboutme'); }}>
                <User className="w-5 h-5" />
                <span>About Me</span>
              </button>
              <button className="flex items-center space-x-2 py-2 text-white hover:text-indigo-400 transition-colors duration-200" onClick={() => { setSidebarOpen(false); router.push('/buy-coffee'); }}>
                <Coffee className="w-5 h-5" />
                <span>Buy Coffee</span>
              </button>
              <button className="flex items-center space-x-2 py-2 text-white hover:text-indigo-400 transition-colors duration-200" onClick={() => { setSidebarOpen(false); router.push('/hire'); }}>
                <Briefcase className="w-5 h-5" />
                <span>Hire</span>
              </button>
              <button className="flex items-center space-x-2 py-2 text-white hover:text-indigo-400 transition-colors duration-200" onClick={() => { setSidebarOpen(false); router.push('/payments'); }}>
                <CreditCard className="w-5 h-5" />
                <span>Payments</span>
              </button>
            </nav>
            </div>
            {/* Sidebar bottom actions */}
            <div className="border-t border-white/20 pt-4 flex flex-col space-y-2">
              <button
                onClick={() => window.open(resumeUrl, '_blank')}
                className="flex items-center space-x-2 text-white hover:text-indigo-400 transition-colors duration-200"
              >
                <Download className="w-5 h-5" />
                <span>Resume</span>
              </button>
              {status === 'authenticated' ? (
                <button
                  onClick={async () => {
                    toast.success('Signed out');
                    await signOut({ redirect: false });
                    setSidebarOpen(false);
                    router.push('/');
                  }}
                  className="flex items-center space-x-2 text-white hover:text-indigo-400 transition-colors duration-200"
                >
                  <LogOut className="w-5 h-5" />
                  <span>Sign Out</span>
                </button>
              ) : (
                <button
                  onClick={() => {
                    setSidebarOpen(false);
                    router.push('/signin');
                  }}
                  className="flex items-center space-x-2 text-white hover:text-indigo-400 transition-colors duration-200"
                >
                  <LogIn className="w-5 h-5" />
                  <span>Sign In</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}
      <div className="hidden sm:block absolute left-4 top-4 z-20">
        <a
          href={resumeUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center space-x-2 bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white font-semibold rounded-lg px-4 py-2.5 shadow-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors duration-200"
        >
          <Download className="w-5 h-5" />
          <span className="font-medium">Download Resume</span>
        </a>
      </div>
      <div className="hidden sm:flex w-full justify-center items-center z-10 container mx-auto px-4 sm:px-6 lg:px-8">
        <section>
          <label title="home" htmlFor="home" className="label" onClick={() => router.push('/') }>
            <input
              id="home"
              name="page"
              type="radio"
              checked={pathname === '/'}
              onChange={() => {}}
            />
            <Home />
          </label>
          <label title="aboutme" htmlFor="aboutme" className="label" onClick={() => router.push('/aboutme') }>
            <input
              id="aboutme"
              name="page"
              type="radio"
              checked={pathname === '/aboutme'}
              onChange={() => {}}
            />
            <User />
          </label>
          <label title="buy-coffee" htmlFor="buy-coffee" className="label" onClick={() => router.push('/buy-coffee') }>
            <input
              id="buy-coffee"
              name="page"
              type="radio"
              checked={pathname === '/buy-coffee'}
              onChange={() => {}}
            />
            <Coffee />
          </label>
          <label title="hire" htmlFor="hire" className="label" onClick={() => router.push('/hire') }>
            <input
              id="hire"
              name="page"
              type="radio"
              checked={pathname === '/hire'}
              onChange={() => {}}
            />
            <Briefcase />
          </label>
          <label title="payments" htmlFor="payments" className="label" onClick={() => router.push('/payments') }>
            <input
              id="payments"
              name="page"
              type="radio"
              checked={pathname === '/payments'}
              onChange={() => {}}
            />
            <CreditCard />
          </label>
        </section>
      </div>
      {status === 'authenticated' && session?.user && (
        <div className="hidden sm:flex absolute right-4 top-4 flex items-center space-x-2 z-10 bg-gray-800 bg-opacity-50 backdrop-blur-md p-2 rounded-full">
          {session.user.image && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={session.user.image}
              alt="Profile"
              className="w-8 h-8 rounded-full"
            />
          )}
          <span className="text-white text-sm font-medium">
            {session.user.name || session.user.email}
          </span>
          <button
            onClick={async () => {
              toast.success('Successfully signed out');
              await signOut({ redirect: false });
              router.push('/');
            }}
            className="flex items-center space-x-2 bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white text-sm font-medium rounded-lg px-3 py-1.5 shadow-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors duration-200"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      )}
      {/* Desktop sign-in button for unauthenticated users */}
      {status === 'unauthenticated' && pathname !== '/signin' && (
        <div className="hidden sm:flex absolute right-4 top-4 z-10">
          <button
            onClick={() => router.push('/signin')}
            className="flex items-center space-x-2 bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white text-sm font-medium rounded-lg px-3 py-1.5 shadow-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors duration-200"
          >
            <LogIn className="w-4 h-4" />
            <span>Sign In</span>
          </button>
        </div>
      )}
    </StyledWrapper>
  );
}

const StyledWrapper = styled.div`
  section {
    --col-orange: white;
    --col-dark: transparent;
    --col-darkGray: #52555a;
    --col-gray: #aeaeae;

    width: fit-content;
    display: flex;
    align-items: center;
    justify-content: space-evenly;
    background-color: var(--col-dark);
    border-radius: 30px;
  }
  .label {
    padding: 8px 18px;
    transition: all 200ms;
    display: inline-block;
    cursor: pointer;
  }

  .label input[type="radio"] {
    display: none;
  }
  .label > svg {
    transition: all 200ms;
    color: var(--col-gray);
    width: 18px;
  }
  .label:hover:not(:has(input:checked)) > svg {
    color: white;
    opacity: 0.6;
  }
  .label::before {
    content: "";
    display: block;
    width: 0%;
    height: 2px;
    border-radius: 5px;
    position: relative;
    left: 50%;
    top: 20px;
    background: var(--col-orange);
    transition: all 200ms;
  }
  .label > svg {
    transition: 300ms;
    color: var(--col-darkGray);
    margin-top: 0;
  }
  .label:has(input:checked) > svg {
    color: var(--col-orange);
    scale: 1.2;
    margin-top: -5px;
  }

  .label:has(input:checked)::before {
    width: 100%;
    left: 0;
    top: 25px;
  }`;

export default Header;
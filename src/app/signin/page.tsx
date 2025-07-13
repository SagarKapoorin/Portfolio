"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import google from '@/assets/google.webp';
import Image from "next/image";
import { Github, LockKeyhole, Sparkles } from "lucide-react";
import { AnimatedBackground } from "@/components/AnimatedBackground";
import { toast } from 'react-toastify';

const loginSchema = z.object({
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  password: z.string().min(8, {
    message: "Password must be at least 8 characters long.",
  }),
});

const registerSchema = loginSchema.extend({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters long.",
  }),
});

export default function Page() {
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');
  // toast on successful login or registration
  const handleSuccess = (message: string, url?: string) => {
    toast.success(message);
    if (url) {
      setTimeout(() => router.push(url), 1000);
    }
  };

  const loginForm = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const registerForm = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  const router = useRouter();
  const onLoginSubmit = async (values: z.infer<typeof loginSchema>) => {
    setIsLoading(true);
    const res = await signIn('credentials', {
      email: values.email,
      password: values.password,
      redirect: false,
      callbackUrl: '/',
    });
    setIsLoading(false);
    if (res?.error) {
      toast.error('Login failed: ' + res.error);
    } else {
      handleSuccess('Successfully signed in!', res?.url || '/');
    }
  };
  const onRegisterSubmit = async (values: z.infer<typeof registerSchema>) => {
    setIsLoading(true);
    const res = await signIn('credentials', {
      name: values.name,
      email: values.email,
      password: values.password,
      redirect: false,
      callbackUrl: '/',
    });
    setIsLoading(false);
    if (res?.error) {
      toast.error('Registration failed: ' + res.error);
    } else {
      handleSuccess('Account created successfully!', res?.url || '/');
    }
  };

  return (
    <>
    <AnimatedBackground/>
    <div className="min-h-screen  flex items-center justify-center p-4">
    <div className="w-full max-w-md relative z-20">
        <div className="bg-black-700 rounded-2xl shadow-2xl border-2 border-gray-700 overflow-hidden backdrop-blur-sm">
        <div className="absolute -top-2 left-1/2 -translate-x-1/2 transform">
          <div className="w-16 h-16 bg-black-900 rounded-2xl flex items-center justify-center shadow-xl">
            <LockKeyhole className="w-8 h-8 text-indigo-600" />
          </div>
        </div>
          <div className="px-8 pt-12 pb-8">
            <div className="text-center space-y-2">
              <h1 className="text-3xl font-bold tracking-tight text-white whitespace-nowrap">
                Authentication
                <Sparkles className="w-5 h-5 inline-block ml-2 text-yellow-500" />
              </h1>
              <p className="text-sm text-gray-400">
                Secure access to your account
              </p>
            </div>
          </div>
          <div className="px-8 pb-8 space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <button 
                type="button"
                onClick={() => signIn('github')}
                className="flex items-center justify-center px-4 py-2.5 border border-gray-600 rounded-lg text-sm font-medium text-gray-200 hover:bg-gray-700/50 transition-colors duration-200"
              >
                <Github className="mr-2 h-4 w-4" />
                GitHub
              </button>
              <button 
                type="button"
                onClick={() => signIn('google')}
                className="flex items-center justify-center px-4 py-2.5 border border-gray-600 rounded-lg text-sm font-medium text-gray-200 hover:bg-gray-700/50 transition-colors duration-200"
              >
                <Image src={google} alt="google" className="mr-2 h-4 w-4 mt-0.5" />
                Google
              </button>
            </div>
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-gray-600" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-gray-800 px-4 py-2 text-gray-400 rounded-lg">
                  Or continue with email
                </span>
              </div>
            </div>
            <div className="flex items-center justify-center space-x-1 p-1 bg-gray-700/50 rounded-lg">
              <button
                onClick={() => setActiveTab('login')}
                className={`flex-1 px-8  py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                  activeTab === 'login'
                    ? 'bg-indigo-600 text-white shadow-lg'
                    : 'hover:hover:bg-gray-700 text-gray-300'
                }`}
              >
                Sign In
              </button>
              <button
                onClick={() => setActiveTab('register')}
                className={`flex-1 px-8 py-2.5 rounded-md text-sm font-medium transition-all duration-200 ${
                  activeTab === 'register'
                    ? 'bg-indigo-600 text-white shadow-lg'
                    : 'hover:hover:bg-gray-700 text-gray-300'
                }`}
              >
                New Account
              </button>
            </div>
            <div className="space-y-4">
            {activeTab === 'login' ? (
                <form onSubmit={loginForm.handleSubmit(onLoginSubmit)} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-200 mb-1.5">
                      Email
                    </label>
                    <input
                      type="email"
                      placeholder="you@example.com"
                      {...loginForm.register("email")}
                      className="w-full px-3 py-2 border border-gray-600 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-gray-700 text-white placeholder-gray-400"
                    />
                    {loginForm.formState.errors.email && (
                      <p className="mt-1 text-sm text-red-400">
                        {loginForm.formState.errors.email.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-200 mb-1.5">
                      Password
                    </label>
                    <input
                      type="password"
                      placeholder="••••••••"
                      {...loginForm.register("password")}
                      className="w-full px-3 py-2 border border-gray-600 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-gray-700 text-white placeholder-gray-400"
                    />
                    {loginForm.formState.errors.password && (
                      <p className="mt-1 text-sm text-red-400">
                        {loginForm.formState.errors.password.message}
                      </p>
                    )}
                  </div>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-2.5 px-4 bg-gradient-to-r from-indigo-600 to-indigo-500 text-white rounded-lg font-medium hover:from-indigo-500 hover:to-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                  >
                    {isLoading ? "Authenticating..." : "Sign in"}
                  </button>
                </form>
            ) : (
                <form onSubmit={registerForm.handleSubmit(onRegisterSubmit)} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-200 mb-1.5">
                      Full Name
                    </label>
                    <input
                      type="text"
                      placeholder="John Doe"
                      {...registerForm.register("name")}
                      className="w-full px-3 py-2 border border-gray-600 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-gray-700 text-white placeholder-gray-400"
                    />
                    {registerForm.formState.errors.name && (
                      <p className="mt-1 text-sm text-red-600 text-red-400">
                        {registerForm.formState.errors.name.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 text-gray-200 mb-1.5">
                      Email
                    </label>
                    <input
                      type="email"
                      placeholder="you@example.com"
                      {...registerForm.register("email")}
                      className="w-full px-3 py-2 border border-gray-300 border-gray-600 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-gray-700 text-white placeholder-gray-400"
                    />
                    {registerForm.formState.errors.email && (
                      <p className="mt-1 text-sm text-red-600 text-red-400">
                        {registerForm.formState.errors.email.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-200 mb-1.5">
                      Password
                    </label>
                    <input
                      type="password"
                      placeholder="••••••••"
                      {...registerForm.register("password")}
                      className="w-full px-3 py-2 border border-gray-600 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-gray-700 text-white placeholder-gray-400"
                    />
                    {registerForm.formState.errors.password && (
                      <p className="mt-1 text-sm text-red-400">
                        {registerForm.formState.errors.password.message}
                      </p>
                    )}
                  </div>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-2.5 px-4 bg-gradient-to-r from-indigo-600 to-indigo-500 text-white rounded-lg font-medium hover:from-indigo-500 hover:to-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                  >
                    {isLoading ? "Creating account..." : "Create account"}
                  </button>
                </form>
              )}
            </div>
          </div>
         
        </div>
      </div>
    </div>
    </>
  );
}
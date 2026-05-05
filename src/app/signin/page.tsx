"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import google from "@/assets/google.webp";
import Image from "next/image";
import { Github, LockKeyhole } from "lucide-react";
import { toast } from "react-toastify";

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
  const [activeTab, setActiveTab] = useState<"login" | "register">("login");
  const router = useRouter();

  const loginForm = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const registerForm = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
    defaultValues: { name: "", email: "", password: "" },
  });

  const handleSuccess = (message: string, url?: string) => {
    toast.success(message);
    if (url) {
      setTimeout(() => router.push(url), 1000);
    }
  };

  const onLoginSubmit = async (values: z.infer<typeof loginSchema>) => {
    setIsLoading(true);
    const res = await signIn("credentials", {
      email: values.email,
      password: values.password,
      redirect: false,
      callbackUrl: "/",
    });
    setIsLoading(false);
    if (res?.error) {
      toast.error("Login failed: " + res.error);
    } else {
      handleSuccess("Successfully signed in!", res?.url || "/");
    }
  };

  const onRegisterSubmit = async (values: z.infer<typeof registerSchema>) => {
    setIsLoading(true);
    const res = await signIn("credentials", {
      name: values.name,
      email: values.email,
      password: values.password,
      redirect: false,
      callbackUrl: "/",
    });
    setIsLoading(false);
    if (res?.error) {
      toast.error("Registration failed: " + res.error);
    } else {
      handleSuccess("Account created successfully!", res?.url || "/");
    }
  };

  const inputClass =
    "w-full rounded-lg border border-[#23252a] bg-[#141516] px-3 py-3 text-white outline-none transition-colors placeholder:text-[#62666d] focus:border-[#5e6ad2]";

  return (
    <div className="portfolio-shell flex min-h-[calc(100vh-64px)] items-center justify-center py-16">
      <div className="portfolio-panel w-full max-w-md overflow-hidden">
        <div className="border-b border-[#23252a] p-8 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl border border-[#34343a] bg-[#141516]">
            <LockKeyhole className="h-6 w-6 text-[#5e6ad2]" />
          </div>
          <h1 className="mt-5 text-3xl font-semibold text-[#f7f8f8]">Authentication</h1>
          <p className="mt-2 text-sm text-[#8a8f98]">Secure access to your account</p>
        </div>

        <div className="space-y-6 p-8">
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => signIn("github")}
              className="portfolio-button-secondary"
            >
              <Github className="h-4 w-4" />
              GitHub
            </button>
            <button
              type="button"
              onClick={() => signIn("google")}
              className="portfolio-button-secondary"
            >
              <Image src={google} alt="Google" className="h-4 w-4" />
              Google
            </button>
          </div>

          <div className="grid grid-cols-2 gap-1 rounded-lg border border-[#23252a] bg-[#141516] p-1">
            <button
              type="button"
              onClick={() => setActiveTab("login")}
              className={`rounded-md px-4 py-2 text-sm font-medium transition-colors ${
                activeTab === "login" ? "bg-[#5e6ad2] text-white" : "text-[#8a8f98] hover:text-white"
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("register")}
              className={`rounded-md px-4 py-2 text-sm font-medium transition-colors ${
                activeTab === "register" ? "bg-[#5e6ad2] text-white" : "text-[#8a8f98] hover:text-white"
              }`}
            >
              New Account
            </button>
          </div>

          {activeTab === "login" ? (
            <form onSubmit={loginForm.handleSubmit(onLoginSubmit)} className="space-y-4">
              <div>
                <label className="mb-2 block text-sm font-medium text-[#d0d6e0]">Email</label>
                <input type="email" placeholder="you@example.com" {...loginForm.register("email")} className={inputClass} />
                {loginForm.formState.errors.email && (
                  <p className="mt-1 text-sm text-red-400">{loginForm.formState.errors.email.message}</p>
                )}
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-[#d0d6e0]">Password</label>
                <input type="password" placeholder="••••••••" {...loginForm.register("password")} className={inputClass} />
                {loginForm.formState.errors.password && (
                  <p className="mt-1 text-sm text-red-400">{loginForm.formState.errors.password.message}</p>
                )}
              </div>
              <button type="submit" disabled={isLoading} className="portfolio-button-primary w-full disabled:cursor-not-allowed disabled:opacity-60">
                {isLoading ? "Authenticating..." : "Sign in"}
              </button>
            </form>
          ) : (
            <form onSubmit={registerForm.handleSubmit(onRegisterSubmit)} className="space-y-4">
              <div>
                <label className="mb-2 block text-sm font-medium text-[#d0d6e0]">Full Name</label>
                <input type="text" placeholder="John Doe" {...registerForm.register("name")} className={inputClass} />
                {registerForm.formState.errors.name && (
                  <p className="mt-1 text-sm text-red-400">{registerForm.formState.errors.name.message}</p>
                )}
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-[#d0d6e0]">Email</label>
                <input type="email" placeholder="you@example.com" {...registerForm.register("email")} className={inputClass} />
                {registerForm.formState.errors.email && (
                  <p className="mt-1 text-sm text-red-400">{registerForm.formState.errors.email.message}</p>
                )}
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-[#d0d6e0]">Password</label>
                <input type="password" placeholder="••••••••" {...registerForm.register("password")} className={inputClass} />
                {registerForm.formState.errors.password && (
                  <p className="mt-1 text-sm text-red-400">{registerForm.formState.errors.password.message}</p>
                )}
              </div>
              <button type="submit" disabled={isLoading} className="portfolio-button-primary w-full disabled:cursor-not-allowed disabled:opacity-60">
                {isLoading ? "Creating account..." : "Create account"}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

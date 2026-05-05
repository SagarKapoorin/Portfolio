"use client"
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Send, User, Mail, MessageSquare } from 'lucide-react';
import { contactFormSchema } from '@/lib/Form';
import type { z } from 'zod';

type ContactFormData = z.infer<typeof contactFormSchema>;

function Form() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactFormSchema),
  });

  const onSubmit = async (data: ContactFormData) => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    reset();
  };

  return (
    <div className="relative z-10 p-0">
      <div className="mx-auto max-w-xl overflow-hidden rounded-xl border border-[#23252a] bg-[#0f1011]">
        <div className="p-8">
          <h2 className="mb-8 text-2xl font-semibold text-[#f7f8f8]">
            Direct message
          </h2>
          
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <label className="mb-2 block text-sm font-medium text-[#d0d6e0]">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-[#5e6ad2]" />
                  <span>Name</span>
                </div>
              </label>
              <input
                {...register('name')}
                className="w-full rounded-lg border border-[#23252a] bg-[#141516] px-4 py-3 text-white outline-none transition-colors placeholder:text-[#62666d] focus:border-[#5e6ad2]"
                placeholder="John Doe"
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-400">{errors.name.message}</p>
              )}
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-[#d0d6e0]">
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-[#5e6ad2]" />
                  <span>Email</span>
                </div>
              </label>
              <input
                {...register('email')}
                type="email"
                className="w-full rounded-lg border border-[#23252a] bg-[#141516] px-4 py-3 text-white outline-none transition-colors placeholder:text-[#62666d] focus:border-[#5e6ad2]"
                placeholder="john@example.com"
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-400">{errors.email.message}</p>
              )}
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-[#d0d6e0]">
                <div className="flex items-center gap-2">
                  <MessageSquare className="h-4 w-4 text-[#5e6ad2]" />
                  <span>Message</span>
                </div>
              </label>
              <textarea
                {...register('message')}
                rows={4}
                className="w-full resize-none rounded-lg border border-[#23252a] bg-[#141516] px-4 py-3 text-white outline-none transition-colors placeholder:text-[#62666d] focus:border-[#5e6ad2]"
                placeholder="Your message here..."
              />
              {errors.message && (
                <p className="mt-1 text-sm text-red-400">{errors.message.message}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="portfolio-button-primary w-full disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isSubmitting ? (
                'Sending...'
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>Send Message</span>
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Form;

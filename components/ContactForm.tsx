'use client';

import { useState, FormEvent } from 'react';
import { motion } from 'framer-motion';

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
};

export default function ContactForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus('loading');
    setErrorMessage('');

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Une erreur est survenue');
      }

      setStatus('success');
      setFormData({ name: '', email: '', subject: '', message: '' });
      
      setTimeout(() => {
        setStatus('idle');
      }, 5000);
    } catch (error) {
      setStatus('error');
      setErrorMessage(error instanceof Error ? error.message : 'Une erreur est survenue');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <motion.form
      variants={fadeInUp}
      onSubmit={handleSubmit}
      className="mx-auto max-w-2xl space-y-6"
    >
      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <label htmlFor="name" className="mb-2 block text-sm font-medium text-[#f5f3f0]">
            Nom
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full rounded-lg border border-[#3d4d43]/30 bg-[#0a0f0d]/50 px-4 py-3 text-[#f5f3f0] placeholder-[#f5f3f0]/30 transition-all focus:border-[#6b8e6f] focus:outline-none focus:ring-2 focus:ring-[#6b8e6f]/20"
            placeholder="Votre nom"
          />
        </div>
        <div>
          <label htmlFor="email" className="mb-2 block text-sm font-medium text-[#f5f3f0]">
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full rounded-lg border border-[#3d4d43]/30 bg-[#0a0f0d]/50 px-4 py-3 text-[#f5f3f0] placeholder-[#f5f3f0]/30 transition-all focus:border-[#6b8e6f] focus:outline-none focus:ring-2 focus:ring-[#6b8e6f]/20"
            placeholder="votre@email.com"
          />
        </div>
      </div>

      <div>
        <label htmlFor="subject" className="mb-2 block text-sm font-medium text-[#f5f3f0]">
          Sujet
        </label>
        <input
          type="text"
          id="subject"
          name="subject"
          value={formData.subject}
          onChange={handleChange}
          required
          className="w-full rounded-lg border border-[#3d4d43]/30 bg-[#0a0f0d]/50 px-4 py-3 text-[#f5f3f0] placeholder-[#f5f3f0]/30 transition-all focus:border-[#6b8e6f] focus:outline-none focus:ring-2 focus:ring-[#6b8e6f]/20"
          placeholder="Sujet de votre message"
        />
      </div>

      <div>
        <label htmlFor="message" className="mb-2 block text-sm font-medium text-[#f5f3f0]">
          Message
        </label>
        <textarea
          id="message"
          name="message"
          value={formData.message}
          onChange={handleChange}
          required
          rows={6}
          className="w-full rounded-lg border border-[#3d4d43]/30 bg-[#0a0f0d]/50 px-4 py-3 text-[#f5f3f0] placeholder-[#f5f3f0]/30 transition-all focus:border-[#6b8e6f] focus:outline-none focus:ring-2 focus:ring-[#6b8e6f]/20"
          placeholder="Votre message..."
        />
      </div>

      {status === 'success' && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-lg bg-[#6b8e6f]/20 border border-[#6b8e6f]/30 px-4 py-3 text-[#6b8e6f]"
        >
          ✓ Votre message a été envoyé avec succès !
        </motion.div>
      )}

      {status === 'error' && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-lg bg-red-500/20 border border-red-500/30 px-4 py-3 text-red-400"
        >
          ✕ {errorMessage}
        </motion.div>
      )}

      <button
        type="submit"
        disabled={status === 'loading'}
        className="group flex w-full items-center justify-center gap-3 rounded-full bg-[#6b8e6f] px-8 py-4 font-medium text-[#0a0f0d] transition-all hover:bg-[#7a9d7e] hover:shadow-[0_0_40px_-10px_rgba(107,142,111,0.6)] disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {status === 'loading' ? (
          <>
            <svg className="h-5 w-5 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            Envoi en cours...
          </>
        ) : (
          <>
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            Envoyer le message
          </>
        )}
      </button>
    </motion.form>
  );
}

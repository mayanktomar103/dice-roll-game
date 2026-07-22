import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';
import { UserIcon, EnvelopeIcon, LockClosedIcon, GiftIcon } from '@heroicons/react/24/outline';

const registerSchema = z.object({
  username: z.string().min(3, 'Username must be at least 3 characters').max(20, 'Max 20 chars'),
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters')
});

const Register = () => {
  const { register: registerAuth } = useAuth();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm({
    resolver: zodResolver(registerSchema)
  });

  const onSubmit = async (data) => {
    try {
      const res = await registerAuth(data);
      if (res.success) {
        toast.success('Registration successful! You claimed 1,000 Free Coins 🎁');
        navigate('/dashboard');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed.');
    }
  };

  return (
    <div className="max-w-md mx-auto py-12 px-4">
      <div className="glass-card rounded-3xl p-8 border border-purple-500/20 shadow-2xl space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-purple-600 to-pink-500 flex items-center justify-center mx-auto text-2xl shadow-lg">
            🎲
          </div>
          <h2 className="text-3xl font-black text-white">Create Account</h2>
          <p className="text-sm text-slate-400">Join DiceRoll & get 1,000 free starting coins</p>
        </div>

        {/* Free bonus indicator */}
        <div className="bg-amber-500/10 border border-amber-500/30 p-3 rounded-2xl flex items-center space-x-3 text-amber-300 text-xs font-semibold">
          <GiftIcon className="w-5 h-5 text-amber-400 flex-shrink-0 animate-bounce" />
          <span>Instant 1,000 Coins added to your balance upon sign-up!</span>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Username */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-300 uppercase">Username</label>
            <div className="relative">
              <UserIcon className="w-5 h-5 text-slate-400 absolute left-3.5 top-3.5" />
              <input
                type="text"
                placeholder="HighRoller99"
                {...register('username')}
                className="w-full bg-slate-900/90 border border-slate-700 rounded-xl pl-11 pr-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 transition"
              />
            </div>
            {errors.username && (
              <p className="text-xs text-rose-400">{errors.username.message}</p>
            )}
          </div>

          {/* Email */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-300 uppercase">Email Address</label>
            <div className="relative">
              <EnvelopeIcon className="w-5 h-5 text-slate-400 absolute left-3.5 top-3.5" />
              <input
                type="email"
                placeholder="name@example.com"
                {...register('email')}
                className="w-full bg-slate-900/90 border border-slate-700 rounded-xl pl-11 pr-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 transition"
              />
            </div>
            {errors.email && (
              <p className="text-xs text-rose-400">{errors.email.message}</p>
            )}
          </div>

          {/* Password */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-300 uppercase">Password</label>
            <div className="relative">
              <LockClosedIcon className="w-5 h-5 text-slate-400 absolute left-3.5 top-3.5" />
              <input
                type="password"
                placeholder="••••••••"
                {...register('password')}
                className="w-full bg-slate-900/90 border border-slate-700 rounded-xl pl-11 pr-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 transition"
              />
            </div>
            {errors.password && (
              <p className="text-xs text-rose-400">{errors.password.message}</p>
            )}
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full glow-btn-purple text-white py-3.5 rounded-xl font-bold text-base transition disabled:opacity-50 mt-2"
          >
            {isSubmitting ? 'Creating Account...' : 'Register & Claim Coins'}
          </button>
        </form>

        {/* Footer */}
        <div className="text-center text-sm text-slate-400 pt-2 border-t border-slate-800">
          Already registered?{' '}
          <Link to="/login" className="text-purple-400 font-bold hover:underline">
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;

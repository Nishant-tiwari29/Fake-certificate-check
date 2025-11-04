import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Shield } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

import { toast } from 'sonner';
import { useAuth } from '../contexts/AuthContext';

export default function RegisterPage() {
  const navigate = useNavigate();
  const { register, user } = useAuth();

  useEffect(() => {
    // If already authenticated, redirect away from register
    if (user) {
      if (user.role === 'institute') navigate('/dashboard');
      else navigate('/verify');
    }
  }, [user, navigate]);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'student', // Default role
    instituteName: '',
    instituteId: '',
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    try {
      // Check if email already exists
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      if (users.some(user => user.email === formData.email)) {
        toast.error('Email already registered');
        return;
      }

      // Remove confirmPassword before registration
      const { confirmPassword, ...registrationData } = formData;
      await register(registrationData);
      
      toast.success('Registration successful!');
      
      // Redirect based on role
      if (formData.role === 'institute') {
        navigate('/dashboard');
      } else {
        navigate('/verify');
      }
    } catch (error) {
      toast.error('Registration failed: ' + error.message);
    }
  };

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-8">
          <motion.div 
            className="w-16 h-16 bg-gradient-to-br from-teal-500 to-cyan-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Shield className="w-8 h-8 text-white" />
          </motion.div>
          <h1 className="text-2xl font-bold text-slate-900">Create Account</h1>
          <p className="text-slate-600 mt-2">Join our certificate verification system</p>
        </div>

        <Card className="p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <p htmlFor="name">Full Name</p>
              <Input
                id="name"
                name="name"
                required
                placeholder="Enter your full name"
                value={formData.name}
                onChange={handleChange}
                className="mt-1"
              />
            </div>

            <div>
              <p htmlFor="email">Email</p>
              <Input
                id="email"
                name="email"
                type="email"
                required
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
                className="mt-1"
              />
            </div>

            <div>
              <p htmlFor="role">Register as</p>
              <select
                id="role"
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="mt-1 block w-full h-10 rounded-md border border-slate-200 bg-white px-3 py-2 text-sm ring-offset-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-950 focus:ring-offset-2"
                required
              >
                <option value="student">Student</option>
                <option value="institute">Institute</option>
              </select>
            </div>

            {formData.role === 'institute' && (
              <>
                <div>
                  <p htmlFor="instituteName">Institute Name</p>
                  <Input
                    id="instituteName"
                    name="instituteName"
                    required
                    placeholder="Enter institute name"
                    value={formData.instituteName}
                    onChange={handleChange}
                    className="mt-1"
                  />
                </div>

                <div>
                  <p htmlFor="instituteId">Institute ID/Registration Number</p>
                  <Input
                    id="instituteId"
                    name="instituteId"
                    required
                    placeholder="Enter institute registration number"
                    value={formData.instituteId}
                    onChange={handleChange}
                    className="mt-1"
                  />
                </div>
              </>
            )}

            <div>
              <p htmlFor="password">Password</p>
              <Input
                id="password"
                name="password"
                type="password"
                required
                placeholder="Create a password"
                value={formData.password}
                onChange={handleChange}
                className="mt-1"
              />
            </div>

            <div>
              <p htmlFor="confirmPassword">Confirm Password</p>
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                required
                placeholder="Confirm your password"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="mt-1"
              />
            </div>

            <Button type="submit" className="w-full">
              Create Account
            </Button>
          </form>

          <div className="mt-4 text-center text-sm text-slate-600">
            Already have an account?{' '}
            <Link to="/login" className="text-teal-600 hover:text-teal-700 font-medium">
              Sign in
            </Link>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}
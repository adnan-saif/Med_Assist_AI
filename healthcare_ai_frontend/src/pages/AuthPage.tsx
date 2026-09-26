import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import { Activity, Mail, Lock, User, ArrowRight } from 'lucide-react';

const AuthPage = () => {
  const location = useLocation();
  const [isLogin, setIsLogin] = useState(location.state?.mode !== 'register');
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    try {
      const endpoint = isLogin ? '/auth/login' : '/auth/register';
      const body = isLogin 
        ? { username, password }
        : { username, email, password, full_name: username };
        
      const res = await fetch(`http://localhost:8000${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });
      
      const data = await res.json();
      
      if (res.ok) {
        if (isLogin) {
          localStorage.setItem('token', data.access_token);
          navigate('/dashboard');
        } else {
          // Auto login after register
          const loginRes = await fetch('http://localhost:8000/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
          });
          const loginData = await loginRes.json();
          if (loginRes.ok) {
            localStorage.setItem('token', loginData.access_token);
            navigate('/dashboard');
          }
        }
      } else {
        setError(data.detail || 'Authentication failed');
      }
    } catch (err) {
      setError('Failed to connect to server');
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col md:flex-row overflow-hidden relative text-white">
      {/* Left side - Visuals */}
      <div className="hidden lg:flex w-1/2 relative bg-secondary border-r border-white/5 items-center justify-center p-12 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-primary-blue/10 rounded-full blur-[100px]" />
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-primary-purple/10 rounded-full blur-[100px]" />
        
        <div className="relative z-10 max-w-lg">
          <div className="flex items-center gap-2 mb-8">
            <Activity className="text-primary-blue w-8 h-8" />
            <span className="font-bold text-2xl tracking-tight text-white">Health Sentinel<span className="text-primary-blue">.ai</span></span>
          </div>
          
          <h1 className="text-4xl font-bold text-white mb-6 leading-tight">
            The Future of <br/> <span className="text-gradient">Personal Healthcare</span>
          </h1>
          <p className="text-muted text-lg leading-relaxed mb-10">
            Join thousands of users who have transformed their health journey with our intelligent AI ecosystem.
          </p>
          
          {/* Floating UI Element */}
          <motion.div 
            animate={{ y: [-10, 10, -10] }}
            transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
            className="glass-panel p-6 rounded-2xl border border-white/10 flex items-center gap-4 max-w-sm"
          >
             <div className="w-12 h-12 rounded-full bg-success/20 flex items-center justify-center shrink-0">
               <Activity className="text-success w-6 h-6" />
             </div>
             <div>
               <div className="text-sm font-medium text-white">Health Score Optimal</div>
               <div className="text-xs text-muted">AI Analysis completed just now</div>
             </div>
          </motion.div>
        </div>
      </div>
      
      {/* Right side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12 relative">
        <div className="w-full max-w-md">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-10 text-center lg:text-left"
          >
            <h2 className="text-3xl font-bold text-white mb-2">{isLogin ? 'Welcome Back' : 'Create Account'}</h2>
            <p className="text-muted">{isLogin ? 'Enter your credentials to access your dashboard' : 'Start your AI healthcare journey today'}</p>
          </motion.div>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="space-y-4"
            >
              {(
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Username</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                    <input 
                      type="text" 
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      required
                      className="w-full bg-secondary border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white focus:outline-none focus:border-primary-blue focus:ring-1 focus:ring-primary-blue transition"
                      placeholder="johndoe"
                    />
                  </div>
                </div>
              )}

              {!isLogin && (
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                    <input 
                    type="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-secondary border border-white/10 rounded-xl py-3 px-11 text-white placeholder:text-gray-500 focus:outline-none focus:border-primary-blue focus:ring-1 focus:ring-primary-blue transition shadow-[inset_0_2px_4px_rgba(0,0,0,0.2)]"
                    placeholder="Enter your email"
                  />
                  </div>
                </div>
              )}
              
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-sm font-medium text-gray-300">Password</label>
                  {isLogin && <a href="#" className="text-xs text-primary-blue hover:text-primary-blue/80">Forgot Password?</a>}
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                  <input 
                    type="password" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full bg-secondary border border-white/10 rounded-xl py-3 px-11 text-white placeholder:text-gray-500 focus:outline-none focus:border-primary-blue focus:ring-1 focus:ring-primary-blue transition shadow-[inset_0_2px_4px_rgba(0,0,0,0.2)]"
                    placeholder="Enter your password"
                  />
                </div>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              {error && <div className="mb-4 text-danger text-sm text-center bg-danger/10 py-2 rounded-lg">{error}</div>}
              <button 
                type="submit"
                className="w-full bg-white text-black font-medium py-3 rounded-xl hover:bg-white/90 transition flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(255,255,255,0.15)]"
              >
                {isLogin ? 'Sign In' : 'Create Account'} <ArrowRight className="w-4 h-4" />
              </button>
            </motion.div>
          </form>
          
          <div className="mt-8 text-center text-sm text-muted">
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <button 
              onClick={() => setIsLogin(!isLogin)}
              className="text-primary-blue font-medium hover:text-primary-blue/80 transition"
            >
              {isLogin ? 'Sign Up' : 'Sign In'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;

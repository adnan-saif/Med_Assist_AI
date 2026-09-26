import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Activity, BrainCircuit, HeartPulse, Stethoscope, ArrowRight } from 'lucide-react';

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background overflow-x-hidden text-white relative">
      {/* Navbar */}
      <nav className="fixed top-0 w-full z-50 glass-panel border-b border-white/5 py-4 px-6 md:px-12 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Activity className="text-primary-blue w-6 h-6" />
          <span className="font-bold text-xl tracking-tight">Health Sentinel<span className="text-primary-blue">.ai</span></span>
        </div>
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-muted">
          <a href="#features" className="hover:text-white transition">Features</a>
          <a href="#modules" className="hover:text-white transition">Modules</a>
          <a href="#intelligence" className="hover:text-white transition">Intelligence</a>
          <a href="#about" className="hover:text-white transition">About</a>
          <a href="#contact" className="hover:text-white transition">Contact</a>
        </div>
        <div className="flex items-center gap-4">
          <button onClick={() => navigate('/auth', { state: { mode: 'login' } })} className="text-sm font-medium hover:text-white transition text-muted">Login</button>
          <button onClick={() => navigate('/auth', { state: { mode: 'register' } })} className="bg-white/90 backdrop-blur-md text-black px-5 py-2.5 rounded-full text-sm font-semibold hover:bg-white transition shadow-[0_0_20px_rgba(255,255,255,0.4)]">Get Started</button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 px-6 md:px-12 max-w-7xl mx-auto flex flex-col md:flex-row items-center min-h-screen">
        {/* Background Gradients */}
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-primary-blue/20 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-primary-purple/20 rounded-full blur-[120px] pointer-events-none" />
        
        <div className="md:w-1/2 z-10 flex flex-col items-start text-left">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="inline-block px-3 py-1 rounded-full border border-white/10 glass-panel text-xs font-medium text-primary-blue mb-6 shadow-[0_0_15px_rgba(59,130,246,0.2)]"
          >
            Introducing Health Sentinel OS 1.0 - The World's Best Health App
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1, ease: "easeOut" }}
            className="text-5xl md:text-7xl font-bold tracking-tight leading-[1.1] mb-6"
          >
            Your Ultimate <br/> <span className="text-gradient">AI Healthcare</span> Sentinel
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            className="text-lg md:text-xl text-muted mb-10 max-w-lg leading-relaxed"
          >
            The most advanced, comprehensive healthcare ecosystem ever built. Powered by autonomous AI agents for medical guidance, nutrition, fitness, and predictive preventive care.
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
            className="flex flex-wrap gap-4"
          >
            <button onClick={() => navigate('/auth', { state: { mode: 'register' } })} className="bg-white/90 backdrop-blur-md text-black px-8 py-4 rounded-full font-semibold hover:bg-white transition flex items-center gap-2 shadow-[0_0_25px_rgba(255,255,255,0.3)]">
              Start Your Health Journey <ArrowRight className="w-4 h-4" />
            </button>
            <button className="glass-panel px-8 py-4 rounded-full font-medium hover:bg-white/5 transition flex items-center gap-2">
              Watch Demo
            </button>
          </motion.div>
        </div>
        
        {/* Right side floating graphics */}
        <div className="md:w-1/2 w-full mt-16 md:mt-0 relative z-10 flex justify-center items-center h-[500px]">
           <motion.div 
             animate={{ y: [-10, 10, -10] }}
             transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
             className="relative w-full max-w-md aspect-square glass-panel rounded-[2rem] border border-white/10 p-6 flex flex-col shadow-2xl overflow-hidden"
           >
              {/* Inner content simulating dashboard */}
              <div className="flex items-center justify-between mb-8">
                <div className="flex gap-2">
                  <div className="w-3 h-3 rounded-full bg-danger"></div>
                  <div className="w-3 h-3 rounded-full bg-warning"></div>
                  <div className="w-3 h-3 rounded-full bg-success"></div>
                </div>
                <div className="text-xs text-muted">AI Health Monitor</div>
              </div>
              
              <div className="flex-1 flex flex-col gap-4">
                <div className="h-24 bg-gradient-to-r from-primary-blue/20 to-primary-purple/20 rounded-xl border border-white/5 flex items-center p-4 gap-4">
                   <div className="w-12 h-12 rounded-full bg-primary-blue/20 flex items-center justify-center">
                     <HeartPulse className="text-primary-blue w-6 h-6" />
                   </div>
                   <div>
                     <div className="text-sm text-muted">Heart Rate</div>
                     <div className="text-2xl font-bold">72 <span className="text-sm font-normal text-muted">bpm</span></div>
                   </div>
                </div>
                
                <div className="flex gap-4">
                  <div className="flex-1 h-32 glass-panel rounded-xl p-4 flex flex-col justify-between">
                    <BrainCircuit className="text-primary-purple w-5 h-5" />
                    <div>
                      <div className="text-sm text-muted">AI Status</div>
                      <div className="text-lg font-semibold text-success">Optimal</div>
                    </div>
                  </div>
                  <div className="flex-1 h-32 glass-panel rounded-xl p-4 flex flex-col justify-between">
                    <Stethoscope className="text-primary-blue w-5 h-5" />
                    <div>
                      <div className="text-sm text-muted">Health Score</div>
                      <div className="text-lg font-semibold">94/100</div>
                    </div>
                  </div>
                </div>
              </div>
           </motion.div>
           
           {/* Decorative elements */}
           <motion.div 
             animate={{ y: [15, -15, 15], rotate: [0, 5, 0] }}
             transition={{ repeat: Infinity, duration: 5, ease: "easeInOut", delay: 1 }}
             className="absolute -right-4 top-20 glass-panel px-4 py-3 rounded-2xl flex items-center gap-3 border border-white/10 shadow-xl"
           >
             <div className="w-8 h-8 rounded-full bg-success/20 flex items-center justify-center">
                <Activity className="text-success w-4 h-4" />
             </div>
             <div className="text-sm font-medium">Vitals Stable</div>
           </motion.div>
           
        </div>
      </section>
      
      {/* Demo Section */}
      <section id="features" className="py-32 px-6 md:px-12 max-w-7xl mx-auto border-t border-white/5 relative">
         <div className="text-center max-w-3xl mx-auto mb-20">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">Talk to Your AI Health Assistant</h2>
            <p className="text-lg text-muted">Symptom understanding, medical explanations, and personalized healthcare guidance with an intelligent system that remembers you.</p>
         </div>
         
         <div className="glass-panel border border-white/10 rounded-3xl overflow-hidden shadow-2xl h-[500px] flex flex-col max-w-4xl mx-auto">
            <div className="bg-secondary border-b border-white/5 p-4 flex items-center justify-between">
               <div className="flex items-center gap-3">
                 <div className="w-10 h-10 rounded-full bg-primary-blue/20 flex items-center justify-center">
                    <BrainCircuit className="text-primary-blue" />
                 </div>
                 <div>
                   <div className="font-medium text-sm">Medical AI Copilot</div>
                   <div className="text-xs text-success flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-success inline-block"></span> Online</div>
                 </div>
               </div>
            </div>
            <div className="flex-1 p-6 flex flex-col gap-6 overflow-hidden">
               <div className="flex items-start gap-4 max-w-[80%]">
                 <div className="w-8 h-8 rounded-full bg-primary-blue/20 flex items-center justify-center shrink-0">
                    <BrainCircuit className="text-primary-blue w-4 h-4" />
                 </div>
                 <div className="bg-white/5 p-4 rounded-2xl rounded-tl-sm text-sm text-gray-200">
                   Hello! I'm your Health Sentinel AI. I've analyzed your latest sleep data and noticed a slight decrease in deep sleep. How are you feeling today?
                 </div>
               </div>
               <div className="flex items-start gap-4 max-w-[80%] ml-auto flex-row-reverse">
                 <div className="w-8 h-8 rounded-full bg-primary-purple/20 flex items-center justify-center shrink-0">
                    <div className="w-4 h-4 rounded-full bg-primary-purple" />
                 </div>
                 <div className="bg-primary-blue/20 p-4 rounded-2xl rounded-tr-sm text-sm text-white">
                   I've been feeling a bit tired and having mild headaches in the afternoon.
                 </div>
               </div>
               <div className="flex items-start gap-4 max-w-[80%]">
                 <div className="w-8 h-8 rounded-full bg-primary-blue/20 flex items-center justify-center shrink-0">
                    <BrainCircuit className="text-primary-blue w-4 h-4" />
                 </div>
                 <div className="bg-white/5 p-4 rounded-2xl rounded-tl-sm text-sm text-gray-200">
                   <div className="flex items-center gap-2 mb-2">
                     <span className="w-2 h-2 rounded-full bg-primary-purple animate-pulse"></span>
                     <span className="text-xs text-primary-purple font-medium">Analyzing symptoms...</span>
                   </div>
                   Based on your recent hydration logs and these symptoms, it's possible you're experiencing mild dehydration. Let's look at your water intake over the last 48 hours.
                 </div>
               </div>
            </div>
         </div>
      </section>

      {/* Modules Section */}
      <section id="modules" className="py-32 px-6 md:px-12 max-w-7xl mx-auto border-t border-white/5 relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary-purple/10 rounded-full blur-[150px] pointer-events-none" />
        <div className="text-center max-w-3xl mx-auto mb-16 relative z-10">
          <motion.h2 
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-bold mb-6"
          >
            A Module For Every Need
          </motion.h2>
          <p className="text-lg text-muted">A fully integrated suite of specialized AI agents working together.</p>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 relative z-10">
          {[
            { name: 'Medical AI', icon: BrainCircuit, color: 'text-primary-blue', bg: 'bg-primary-blue/10' },
            { name: 'Drug Info', icon: BrainCircuit, color: 'text-primary-purple', bg: 'bg-primary-purple/10' },
            { name: 'Diet & Nutrition', icon: HeartPulse, color: 'text-success', bg: 'bg-success/10' },
            { name: 'Fitness Coach', icon: Activity, color: 'text-warning', bg: 'bg-warning/10' },
          ].map((mod, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              whileHover={{ scale: 1.05 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="glass-panel p-6 rounded-2xl border border-white/10 flex flex-col items-center justify-center text-center gap-4 cursor-pointer hover:bg-white/5 transition"
            >
              <div className={`w-14 h-14 ${mod.bg} rounded-full flex items-center justify-center`}>
                <mod.icon className={`w-7 h-7 ${mod.color}`} />
              </div>
              <div className="font-semibold">{mod.name}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Intelligence Section */}
      <section id="intelligence" className="py-32 px-6 md:px-12 max-w-7xl mx-auto border-t border-white/5 relative">
        <div className="flex flex-col md:flex-row items-center gap-12">
          <div className="md:w-1/2">
            <motion.div 
               animate={{ rotate: 360 }}
               transition={{ repeat: Infinity, duration: 40, ease: "linear" }}
               className="w-full max-w-md aspect-square rounded-full border border-white/10 border-dashed flex items-center justify-center relative mx-auto"
            >
              <motion.div 
                 animate={{ rotate: -360 }}
                 transition={{ repeat: Infinity, duration: 20, ease: "linear" }}
                 className="w-3/4 h-3/4 rounded-full border border-primary-blue/30 border-dotted flex items-center justify-center relative"
              >
                <div className="w-1/2 h-1/2 bg-gradient-to-tr from-primary-blue to-primary-purple rounded-full blur-[20px] animate-pulse"></div>
                <BrainCircuit className="absolute w-12 h-12 text-white z-10" />
              </motion.div>
            </motion.div>
          </div>
          <div className="md:w-1/2 text-left">
            <motion.h2 
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="text-4xl md:text-5xl font-bold mb-6"
            >
              Unrivaled AI Intelligence
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-lg text-muted mb-8"
            >
              Health Sentinel uses a state-of-the-art multi-agent architecture. Reasoning agents, retrieval systems, and contextual memory networks work in unison to provide you with the most accurate, context-aware health advice available anywhere.
            </motion.p>
            <motion.ul 
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="space-y-4"
            >
              <li className="flex items-center gap-3"><Activity className="text-primary-blue w-5 h-5" /> Persistent Conversational Memory</li>
              <li className="flex items-center gap-3"><Activity className="text-primary-purple w-5 h-5" /> Medical Retrieval-Augmented Generation</li>
              <li className="flex items-center gap-3"><Activity className="text-success w-5 h-5" /> Real-time Anomaly Detection</li>
            </motion.ul>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-32 px-6 md:px-12 max-w-7xl mx-auto border-t border-white/5 relative">
         <motion.div 
           initial={{ opacity: 0, y: 30 }}
           whileInView={{ opacity: 1, y: 0 }}
           viewport={{ once: true }}
           transition={{ duration: 0.8 }}
           className="text-center max-w-3xl mx-auto mb-16"
         >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">About Health Sentinel</h2>
            <p className="text-lg text-muted">We believe healthcare should be proactive, personalized, and accessible. Health Sentinel combines cutting-edge AI with medical knowledge to empower you to make informed decisions about your well-being, standing guard over your health 24/7.</p>
         </motion.div>
         <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div 
              whileHover={{ y: -10 }}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="glass-panel p-8 rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl hover:bg-white/10 transition shadow-[0_10px_30px_rgba(0,0,0,0.5)]"
            >
               <div className="w-12 h-12 bg-primary-blue/20 rounded-xl flex items-center justify-center mb-6">
                 <BrainCircuit className="text-primary-blue w-6 h-6" />
               </div>
               <h3 className="text-xl font-semibold mb-3">Intelligent Analysis</h3>
               <p className="text-muted text-sm leading-relaxed">Our AI continuously learns from your data to provide highly personalized health insights, early warnings, and recovery recommendations unparalleled by any other app.</p>
            </motion.div>
            <motion.div 
              whileHover={{ y: -10 }}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="glass-panel p-8 rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl hover:bg-white/10 transition shadow-[0_10px_30px_rgba(0,0,0,0.5)]"
            >
               <div className="w-12 h-12 bg-primary-purple/20 rounded-xl flex items-center justify-center mb-6">
                 <HeartPulse className="text-primary-purple w-6 h-6" />
               </div>
               <h3 className="text-xl font-semibold mb-3">Holistic Tracking</h3>
               <p className="text-muted text-sm leading-relaxed">From sleep patterns to dietary habits and heart rate variability, we track the metrics that matter most for long-term health and peak performance.</p>
            </motion.div>
            <motion.div 
              whileHover={{ y: -10 }}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="glass-panel p-8 rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl hover:bg-white/10 transition shadow-[0_10px_30px_rgba(0,0,0,0.5)]"
            >
               <div className="w-12 h-12 bg-success/20 rounded-xl flex items-center justify-center mb-6">
                 <Stethoscope className="text-success w-6 h-6" />
               </div>
               <h3 className="text-xl font-semibold mb-3">Evidence-Based</h3>
               <p className="text-muted text-sm leading-relaxed">All AI responses are grounded in verified medical literature and continuously updated to reflect the latest global healthcare standards.</p>
            </motion.div>
         </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-32 px-6 md:px-12 max-w-7xl mx-auto border-t border-white/5 relative">
        <div className="max-w-4xl mx-auto glass-panel p-12 rounded-[3rem] border border-white/10 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-primary-blue/5 to-transparent pointer-events-none" />
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="relative z-10"
          >
            <div className="text-center mb-10">
              <h2 className="text-4xl font-bold mb-4">Get In Touch</h2>
              <p className="text-lg text-muted">Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.</p>
            </div>
            
            <form className="space-y-6 max-w-2xl mx-auto" onSubmit={(e) => e.preventDefault()}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Full Name</label>
                  <input type="text" placeholder="John Doe" className="w-full bg-secondary border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-primary-blue focus:ring-1 focus:ring-primary-blue transition" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Email Address</label>
                  <input type="email" placeholder="john@example.com" className="w-full bg-secondary border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-primary-blue focus:ring-1 focus:ring-primary-blue transition" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Subject</label>
                <input type="text" placeholder="How can we help?" className="w-full bg-secondary border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-primary-blue focus:ring-1 focus:ring-primary-blue transition" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Message</label>
                <textarea rows={4} placeholder="Your message..." className="w-full bg-secondary border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-primary-blue focus:ring-1 focus:ring-primary-blue transition resize-none"></textarea>
              </div>
              <button className="w-full bg-primary-blue text-white py-4 rounded-xl font-bold hover:bg-blue-600 transition shadow-[0_0_20px_rgba(59,130,246,0.3)] flex items-center justify-center gap-2">
                Send Message <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 py-12 px-6 text-center text-muted text-sm">
        <div className="flex items-center justify-center gap-2 mb-4">
          <Activity className="text-primary-blue w-5 h-5" />
          <span className="font-bold text-lg text-white tracking-tight">Health Sentinel<span className="text-primary-blue">.ai</span></span>
        </div>
        <p>© 2026 Health Sentinel Inc. All rights reserved. The best health app in the universe.</p>
      </footer>

    </div>
  );
};

export default LandingPage;

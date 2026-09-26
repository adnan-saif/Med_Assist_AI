import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Activity, 
  BrainCircuit, 
  Pill, 
  Leaf, 
  Utensils, 
  Dumbbell, 
  FileText, 
  AlertTriangle, 
  Heart, 
  BarChart2, 
  Settings, 
  User,
  LogOut,
  Send,
  Mic,
  Paperclip,
  ChevronLeft,
  Menu,
  Plus
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ProfileSetupModal } from '../components/ProfileSetupModal';

const modules = [
  { id: 'dashboard', name: 'Dashboard', icon: BarChart2 },
  { id: 'medical', name: 'Medical AI', icon: BrainCircuit },
  { id: 'drugs', name: 'Drug Info AI', icon: Pill },
  { id: 'herbal', name: 'Herbal AI', icon: Leaf },
  { id: 'diet', name: 'Diet & Nutrition', icon: Utensils },
  { id: 'fitness', name: 'Fitness Coach', icon: Dumbbell },
  { id: 'labs', name: 'Lab Analyzer', icon: FileText }
];

const Dashboard = () => {
  const [activeModule, setActiveModule] = useState('medical');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [inputMessage, setInputMessage] = useState('');
  const [chatHistories, setChatHistories] = useState<Record<string, Record<string, {role: string, content: string, isLoading?: boolean}[]>>>({});
  const [activeSessionId, setActiveSessionId] = useState<string>('default');
  const [profileData, setProfileData] = useState<any>(null);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [editProfileData, setEditProfileData] = useState<any>({});
  const [settingsState, setSettingsState] = useState({ push: true, dark: true });
  const [showProfileSetupModal, setShowProfileSetupModal] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchHistory = async () => {
      const token = localStorage.getItem('token');
      if (!token) return;
      try {
        const res = await fetch('http://localhost:8000/chat/history', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          // Map backend history (e.g. 'drug') to frontend state key ('drugs')
          const fetchedHistories: Record<string, Record<string, {role: string, content: string}[]>> = {};
          for (const [key, sessions] of Object.entries(data)) {
            const frontendKey = key === 'drug' ? 'drugs' : key;
            fetchedHistories[frontendKey] = sessions as any;
          }
          setChatHistories(prev => ({...prev, ...fetchedHistories}));
        }
      } catch (e) {
        console.error('Failed to load chat history', e);
      }
    };

    const fetchProfile = async () => {
      const token = localStorage.getItem('token');
      if (!token) return;
      try {
        const res = await fetch('http://localhost:8000/profile/me', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          setProfileData(data);
          setEditProfileData(data);
          if (!data.age || !data.gender) {
            setShowProfileSetupModal(true);
          }
        }
      } catch (e) {
        console.error('Failed to load profile', e);
      }
    };

    fetchHistory();
    fetchProfile();
  }, []);

  const saveProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:8000/profile/me', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          age: parseInt(editProfileData.age) || null,
          gender: editProfileData.gender || null,
          medical_conditions: typeof editProfileData.medical_conditions === 'string' 
            ? editProfileData.medical_conditions.split(',').map((s: string) => s.trim()).filter(Boolean)
            : editProfileData.medical_conditions,
          allergies: typeof editProfileData.allergies === 'string'
            ? editProfileData.allergies.split(',').map((s: string) => s.trim()).filter(Boolean)
            : editProfileData.allergies,
          medications: typeof editProfileData.medications === 'string'
            ? editProfileData.medications.split(',').map((s: string) => s.trim()).filter(Boolean)
            : editProfileData.medications,
        })
      });
      if (res.ok) {
        const updated = await res.json();
        setProfileData(updated);
        setIsEditingProfile(false);
      }
    } catch(e) {
      console.error(e);
    }
  };

  // Compute Dashboard Metrics
  const totalInteractions = Object.values(chatHistories).reduce((acc, modHist) => {
    return acc + Object.values(modHist).reduce((sum, msgs) => sum + msgs.filter(m => m.role === 'user').length, 0);
  }, 0);
  
  const activeModulesCount = Object.keys(chatHistories).filter(k => Object.keys(chatHistories[k]).length > 0).length;
  
  let profileCompletion = 0;
  if (profileData) {
    let fields = 0;
    if (profileData.age) fields++;
    if (profileData.gender) fields++;
    if (profileData.medical_conditions?.length) fields++;
    if (profileData.allergies?.length) fields++;
    if (profileData.medications?.length) fields++;
    profileCompletion = Math.round((fields / 5) * 100);
  }

  // Get current active history or fallback to greeting
  const moduleHistories = chatHistories[activeModule] || {};
  const chatHistory = moduleHistories[activeSessionId] || [
    { role: 'ai', content: `Hello! I am your ${modules.find(m => m.id === activeModule)?.name} Assistant. How can I help you today?` }
  ];

  const updateChatHistory = (updater: (prev: {role: string, content: string, isLoading?: boolean}[]) => {role: string, content: string, isLoading?: boolean}[]) => {
    setChatHistories(prev => {
      const modHist = prev[activeModule] || {};
      return {
        ...prev,
        [activeModule]: {
          ...modHist,
          [activeSessionId]: updater(modHist[activeSessionId] || [
            { role: 'ai', content: `Hello! I am your ${modules.find(m => m.id === activeModule)?.name} Assistant. How can I help you today?` }
          ])
        }
      };
    });
  };

  const handleProfileSetupComplete = (updatedProfile: any) => {
    setProfileData(updatedProfile);
    setEditProfileData(updatedProfile);
    setShowProfileSetupModal(false);
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;
    
    const userMsg = inputMessage;
    updateChatHistory(prev => [...prev, { role: 'user', content: userMsg }]);
    setInputMessage('');
    
    // Add temporary loading message
    updateChatHistory(prev => [...prev, { role: 'ai', content: '...', isLoading: true }]);
    
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        updateChatHistory(prev => {
          const newHistory = [...prev];
          newHistory[newHistory.length - 1] = { role: 'ai', content: 'Please login to use the AI Assistant.' };
          return newHistory;
        });
        return;
      }
      
      let backendModule = activeModule;
      if (activeModule === 'drugs') backendModule = 'drug';
      
      const res = await fetch('http://localhost:8000/chat/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          query: userMsg,
          module: backendModule,
          session_id: activeSessionId
        })
      });
      
      const data = await res.json();
      
      updateChatHistory(prev => {
        const newHistory = [...prev];
        if (res.ok) {
          // Sometimes the backend response might be nested or named differently, fallback to stringified if response is missing
          newHistory[newHistory.length - 1] = { role: 'ai', content: data.response || data.answer || data.message || JSON.stringify(data) };
        } else {
          newHistory[newHistory.length - 1] = { role: 'ai', content: `Error: ${data.detail || 'Failed to get response'}` };
        }
        return newHistory;
      });
      
    } catch (err) {
      updateChatHistory(prev => {
        const newHistory = [...prev];
        newHistory[newHistory.length - 1] = { role: 'ai', content: 'Failed to connect to the server. Is the backend running?' };
        return newHistory;
      });
    }
  };

  return (
    <div className="flex h-screen bg-background text-white overflow-hidden">
      {/* Sidebar */}
      <motion.div 
        animate={{ width: sidebarOpen ? 280 : 80 }}
        className="h-full bg-secondary border-r border-white/5 flex flex-col relative z-20 shrink-0"
      >
        <div className="p-4 flex items-center justify-between border-b border-white/5">
          {sidebarOpen ? (
            <div className="flex items-center gap-2">
              <Activity className="text-primary-blue w-6 h-6" />
              <span className="font-bold text-lg text-white">Health Sentinel</span>
            </div>
          ) : (
            <div className="w-full flex justify-center">
              <Activity className="text-primary-blue w-6 h-6" />
            </div>
          )}
          <button 
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-1.5 rounded-lg hover:bg-white/5 text-gray-400 hover:text-white transition"
          >
            {sidebarOpen ? <ChevronLeft w-5 h-5 /> : <Menu w-5 h-5 />}
          </button>
        </div>

        <div className="flex-1 overflow-y-auto py-4 px-3 space-y-1 scrollbar-hide">
          {modules.map((mod) => (
            <button
              key={mod.id}
              onClick={() => setActiveModule(mod.id)}
              className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl transition ${
                activeModule === mod.id 
                  ? 'bg-white/10 text-white shadow-[0_0_10px_rgba(255,255,255,0.05)] border border-white/5' 
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <mod.icon className={`w-5 h-5 ${mod.color || (activeModule === mod.id ? 'text-primary-blue' : '')}`} />
              {sidebarOpen && <span className="font-medium text-sm">{mod.name}</span>}
            </button>
          ))}
        </div>

        <div className="p-4 border-t border-white/5 space-y-2">
          <button onClick={() => setActiveModule('profile')} className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-gray-400 hover:text-white hover:bg-white/5 transition">
            <User className="w-5 h-5" />
            {sidebarOpen && <span className="font-medium text-sm">Profile</span>}
          </button>
          <button onClick={() => setActiveModule('settings')} className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-gray-400 hover:text-white hover:bg-white/5 transition">
            <Settings className="w-5 h-5" />
            {sidebarOpen && <span className="font-medium text-sm">Settings</span>}
          </button>
          <button onClick={() => navigate('/')} className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-gray-400 hover:text-danger hover:bg-danger/10 transition">
            <LogOut className="w-5 h-5" />
            {sidebarOpen && <span className="font-medium text-sm">Logout</span>}
          </button>
        </div>
      </motion.div>

      {/* Secondary Sidebar for Sessions (Chat History) */}
      {activeModule !== 'dashboard' && activeModule !== 'profile' && activeModule !== 'settings' && (
        <div className="w-64 bg-background border-r border-white/5 flex flex-col hidden md:flex z-10 shrink-0">
          <div className="p-4 border-b border-white/5 h-16 flex items-center">
            <button onClick={() => setActiveSessionId(Date.now().toString())} className="w-full flex items-center justify-center gap-2 py-2 bg-primary-blue/20 text-primary-blue hover:bg-primary-blue/30 rounded-lg text-sm font-medium transition border border-primary-blue/20">
              <Plus className="w-4 h-4" /> New Chat
            </button>
          </div>
          <div className="flex-1 overflow-y-auto py-2 scrollbar-hide">
            {Object.entries(chatHistories[activeModule] || {'default': []}).map(([sessionId, msgs], i) => (
              <button 
                key={sessionId} 
                onClick={() => setActiveSessionId(sessionId)}
                className={`w-full text-left px-4 py-3 text-sm truncate hover:bg-white/5 transition border-b border-white/5 ${activeSessionId === sessionId ? 'bg-white/5 text-white font-medium border-l-2 border-l-primary-blue' : 'text-gray-400'}`}
              >
                {msgs.find(m => m.role === 'user')?.content?.substring(0, 25) || `Chat Session ${i + 1}`}...
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-full relative">
        {/* Background ambient light */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px] bg-primary-blue/5 rounded-[100%] blur-[100px] pointer-events-none" />
        
        {/* Top Navbar */}
        <header className="h-16 border-b border-white/5 flex items-center justify-between px-6 glass-panel z-10">
           <div className="font-semibold text-lg flex items-center gap-2">
             {activeModule === 'profile' ? 'User Profile' : activeModule === 'settings' ? 'Settings' : modules.find(m => m.id === activeModule)?.name}
             {activeModule !== 'dashboard' && activeModule !== 'profile' && activeModule !== 'settings' && <span className="text-xs px-2 py-0.5 rounded-full bg-success/20 text-success border border-success/20 ml-2">AI Ready</span>}
           </div>
           <div className="flex items-center gap-4">
             <div className="h-8 px-3 rounded-full bg-white/5 border border-white/10 flex items-center gap-2 text-sm font-medium">
                <Activity className="w-4 h-4 text-success" /> Score: 94
             </div>
             <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-primary-blue to-primary-purple p-[1px]">
               <div className="w-full h-full bg-secondary rounded-full flex items-center justify-center">
                 <User className="w-4 h-4" />
               </div>
             </div>
           </div>
        </header>

        {/* Dynamic Content */}
        <div className="flex-1 overflow-hidden relative z-10">
          {activeModule === 'dashboard' ? (
            <div className="p-8 h-full overflow-y-auto">
              <h2 className="text-3xl font-bold mb-6">Welcome Back{profileData?.username ? `, ${profileData.username}` : ''}</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <div className="glass-panel p-6 rounded-2xl border border-white/5 relative overflow-hidden group">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-primary-blue/10 rounded-full blur-2xl group-hover:bg-primary-blue/20 transition-all"></div>
                  <div className="flex justify-between items-start mb-4">
                    <div className="p-2 bg-primary-blue/20 rounded-xl"><User className="w-6 h-6 text-primary-blue" /></div>
                    <span className="text-xs font-medium px-2 py-1 bg-success/20 text-success rounded-full">Active</span>
                  </div>
                  <div className="text-muted text-sm mb-1">Profile Completion</div>
                  <div className="text-3xl font-bold text-white">{profileCompletion}<span className="text-lg text-gray-500 font-normal">%</span></div>
                  <div className="mt-4 flex gap-1 h-1 bg-white/10 rounded-full overflow-hidden">
                    <div className="h-full bg-primary-blue rounded-full transition-all" style={{width: `${profileCompletion}%`}}></div>
                  </div>
                </div>

                <div className="glass-panel p-6 rounded-2xl border border-white/5 relative overflow-hidden group">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-primary-purple/10 rounded-full blur-2xl group-hover:bg-primary-purple/20 transition-all"></div>
                  <div className="flex justify-between items-start mb-4">
                    <div className="p-2 bg-primary-purple/20 rounded-xl"><BrainCircuit className="w-6 h-6 text-primary-purple" /></div>
                    <span className="text-xs font-medium px-2 py-1 bg-success/20 text-success rounded-full">AI Used</span>
                  </div>
                  <div className="text-muted text-sm mb-1">Modules Activated</div>
                  <div className="text-3xl font-bold text-white">{activeModulesCount}<span className="text-lg text-gray-500 font-normal"> / {modules.length - 1}</span></div>
                  <div className="mt-4 flex gap-1 h-1 bg-white/10 rounded-full overflow-hidden">
                    <div className="h-full bg-primary-purple rounded-full transition-all" style={{width: `${(activeModulesCount / (modules.length - 1)) * 100}%`}}></div>
                  </div>
                </div>

                <div className="glass-panel p-6 rounded-2xl border border-white/5 relative overflow-hidden group">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-pink-500/10 rounded-full blur-2xl group-hover:bg-pink-500/20 transition-all"></div>
                  <div className="flex justify-between items-start mb-4">
                    <div className="p-2 bg-pink-500/20 rounded-xl"><Send className="w-6 h-6 text-pink-500" /></div>
                    <span className="text-xs font-medium px-2 py-1 bg-white/10 text-gray-300 rounded-full">Total</span>
                  </div>
                  <div className="text-muted text-sm mb-1">AI Interactions</div>
                  <div className="text-3xl font-bold text-white">{totalInteractions}<span className="text-lg text-gray-500 font-normal"> msgs</span></div>
                  <div className="mt-4 flex items-end gap-1 h-6">
                    {[0.2, 0.5, 0.3, 0.8, 0.6, 1.0, 0.4].map((h, i) => <div key={i} className="w-full bg-pink-500/50 rounded-t-sm" style={{height: `${h*100}%`}}></div>)}
                  </div>
                </div>
                
                <div className="glass-panel p-6 rounded-2xl border border-white/5 relative overflow-hidden group">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-blue-400/10 rounded-full blur-2xl group-hover:bg-blue-400/20 transition-all"></div>
                  <div className="flex justify-between items-start mb-4">
                    <div className="p-2 bg-blue-400/20 rounded-xl"><Activity className="w-6 h-6 text-blue-400" /></div>
                    <span className="text-xs font-medium px-2 py-1 bg-warning/20 text-warning rounded-full">System</span>
                  </div>
                  <div className="text-muted text-sm mb-1">Platform Status</div>
                  <div className="text-3xl font-bold text-white">Optimal</div>
                  <div className="mt-4 h-1 bg-white/10 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-400 w-full rounded-full"></div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                 <div className="glass-panel p-6 rounded-2xl border border-white/5">
                   <h3 className="text-lg font-semibold mb-4">Upcoming Goals</h3>
                   <div className="space-y-4">
                     <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl">
                       <div className="flex items-center gap-4">
                         <div className="w-10 h-10 rounded-full bg-primary-blue/20 flex items-center justify-center"><Utensils className="w-5 h-5 text-primary-blue" /></div>
                         <div>
                           <div className="font-medium">Maintain Caloric Deficit</div>
                           <div className="text-sm text-gray-400">Under 2000 kcal today</div>
                         </div>
                       </div>
                       <div className="w-6 h-6 rounded-full border-2 border-white/20"></div>
                     </div>
                     <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl">
                       <div className="flex items-center gap-4">
                         <div className="w-10 h-10 rounded-full bg-primary-purple/20 flex items-center justify-center"><Dumbbell className="w-5 h-5 text-primary-purple" /></div>
                         <div>
                           <div className="font-medium">Strength Training</div>
                           <div className="text-sm text-gray-400">Upper body focus - 45 mins</div>
                         </div>
                       </div>
                       <div className="w-6 h-6 rounded-full border-2 border-white/20"></div>
                     </div>
                   </div>
                 </div>
                 
                 <div className="glass-panel p-6 rounded-2xl border border-white/5">
                   <h3 className="text-lg font-semibold mb-4">AI Insights</h3>
                   <div className="space-y-4">
                     <div className="p-4 bg-primary-blue/10 border border-primary-blue/20 rounded-xl flex gap-4">
                       <BrainCircuit className="w-6 h-6 text-primary-blue shrink-0" />
                       <div>
                         <div className="font-medium text-primary-blue mb-1">Recovery Recommendation</div>
                         <div className="text-sm text-gray-300">Your resting heart rate is slightly elevated today. Consider substituting high-intensity cardio with light stretching or yoga.</div>
                       </div>
                     </div>
                     <div className="p-4 bg-primary-purple/10 border border-primary-purple/20 rounded-xl flex gap-4">
                       <Pill className="w-6 h-6 text-primary-purple shrink-0" />
                       <div>
                         <div className="font-medium text-primary-purple mb-1">Supplement Reminder</div>
                         <div className="text-sm text-gray-300">You've missed your Vitamin D intake for 2 days. Make sure to take it with your next meal for optimal absorption.</div>
                       </div>
                     </div>
                   </div>
                 </div>
              </div>
            </div>
          ) : activeModule === 'profile' ? (
            <div className="p-8 h-full overflow-y-auto max-w-3xl mx-auto w-full">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-3xl font-bold">Your Profile</h2>
                {!isEditingProfile ? (
                  <button onClick={() => { setEditProfileData(profileData); setIsEditingProfile(true); }} className="px-4 py-2 bg-primary-blue/20 text-primary-blue hover:bg-primary-blue/30 rounded-lg text-sm font-medium transition border border-primary-blue/20">Edit Profile</button>
                ) : (
                  <div className="flex gap-2">
                    <button onClick={() => setIsEditingProfile(false)} className="px-4 py-2 bg-white/5 hover:bg-white/10 text-white rounded-lg text-sm transition">Cancel</button>
                    <button onClick={saveProfile} className="px-4 py-2 bg-primary-blue hover:bg-blue-600 text-white rounded-lg text-sm font-medium transition shadow-lg shadow-primary-blue/20">Save Changes</button>
                  </div>
                )}
              </div>
              
              {(!profileData?.age || !profileData?.gender) && !isEditingProfile && (
                <div className="mb-6 p-4 bg-warning/10 border border-warning/20 rounded-xl text-warning text-sm flex items-center gap-3">
                  <AlertTriangle className="w-5 h-5 shrink-0" />
                  Please set up your profile to ensure the AI gives you accurate and safe recommendations.
                </div>
              )}

              <div className="glass-panel p-8 rounded-3xl border border-white/5 space-y-6">
                <div className="flex items-center gap-6">
                  <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-primary-blue to-primary-purple p-1 shrink-0">
                    <div className="w-full h-full bg-secondary rounded-full flex items-center justify-center">
                      <User className="w-10 h-10 text-white" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-white capitalize">{profileData?.username || 'New User'}</h3>
                    <p className="text-gray-400">Premium Member</p>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-white/10">
                  <div>
                    <label className="text-xs text-gray-400 uppercase tracking-wider mb-1 block">Age</label>
                    {isEditingProfile ? (
                      <input type="number" value={editProfileData?.age || ''} onChange={e => setEditProfileData({...editProfileData, age: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-primary-blue" placeholder="e.g. 28" />
                    ) : (
                      <div className="text-white font-medium text-lg">{profileData?.age || 'Not set'}</div>
                    )}
                  </div>
                  <div>
                    <label className="text-xs text-gray-400 uppercase tracking-wider mb-1 block">Gender</label>
                    {isEditingProfile ? (
                      <select value={editProfileData?.gender || ''} onChange={e => setEditProfileData({...editProfileData, gender: e.target.value})} className="w-full bg-[#1E293B] border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-primary-blue">
                        <option value="">Select...</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                      </select>
                    ) : (
                      <div className="text-white font-medium text-lg capitalize">{profileData?.gender || 'Not set'}</div>
                    )}
                  </div>
                  <div className="md:col-span-2">
                    <label className="text-xs text-gray-400 uppercase tracking-wider mb-1 block">Medical Conditions</label>
                    {isEditingProfile ? (
                       <input type="text" value={Array.isArray(editProfileData?.medical_conditions) ? editProfileData.medical_conditions.join(', ') : (editProfileData?.medical_conditions || '')} onChange={e => setEditProfileData({...editProfileData, medical_conditions: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-primary-blue" placeholder="e.g. Diabetes, Hypertension (comma separated)" />
                    ) : (
                      <div className="text-white font-medium text-lg">{profileData?.medical_conditions?.length ? profileData.medical_conditions.join(', ') : 'None'}</div>
                    )}
                  </div>
                  <div className="md:col-span-2">
                    <label className="text-xs text-gray-400 uppercase tracking-wider mb-1 block">Allergies</label>
                    {isEditingProfile ? (
                       <input type="text" value={Array.isArray(editProfileData?.allergies) ? editProfileData.allergies.join(', ') : (editProfileData?.allergies || '')} onChange={e => setEditProfileData({...editProfileData, allergies: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-primary-blue" placeholder="e.g. Peanuts, Penicillin (comma separated)" />
                    ) : (
                      <div className="text-white font-medium text-lg">{profileData?.allergies?.length ? profileData.allergies.join(', ') : 'None'}</div>
                    )}
                  </div>
                  <div className="md:col-span-2">
                    <label className="text-xs text-gray-400 uppercase tracking-wider mb-1 block">Medications</label>
                    {isEditingProfile ? (
                       <input type="text" value={Array.isArray(editProfileData?.medications) ? editProfileData.medications.join(', ') : (editProfileData?.medications || '')} onChange={e => setEditProfileData({...editProfileData, medications: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-primary-blue" placeholder="e.g. Lisinopril, Metformin (comma separated)" />
                    ) : (
                      <div className="text-white font-medium text-lg">{profileData?.medications?.length ? profileData.medications.join(', ') : 'None'}</div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ) : activeModule === 'settings' ? (
            <div className="p-8 h-full overflow-y-auto max-w-3xl mx-auto w-full">
              <h2 className="text-3xl font-bold mb-6">Settings</h2>
              <div className="glass-panel p-8 rounded-3xl border border-white/5 space-y-8">
                
                <div>
                  <h3 className="text-xl font-semibold mb-4 flex items-center gap-2"><User className="w-5 h-5" /> Account Details</h3>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center p-4 bg-white/5 rounded-xl">
                      <div>
                        <div className="font-medium text-white">Email Address</div>
                        <div className="text-sm text-gray-400">{profileData?.email || 'user@example.com'}</div>
                      </div>
                      <button className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-sm transition">Change</button>
                    </div>
                    <div className="flex justify-between items-center p-4 bg-white/5 rounded-xl">
                      <div>
                        <div className="font-medium text-white">Password</div>
                        <div className="text-sm text-gray-400">Last changed 3 months ago</div>
                      </div>
                      <button className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-sm transition">Update</button>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-semibold mb-4 flex items-center gap-2"><Settings className="w-5 h-5" /> Preferences</h3>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center p-4 bg-white/5 rounded-xl">
                      <div>
                        <div className="font-medium text-white">Push Notifications</div>
                        <div className="text-sm text-gray-400">Receive alerts for AI insights and goals</div>
                      </div>
                      <div onClick={() => setSettingsState(s => ({...s, push: !s.push}))} className={`w-12 h-6 rounded-full relative cursor-pointer transition ${settingsState.push ? 'bg-primary-blue' : 'bg-white/20'}`}>
                        <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${settingsState.push ? 'right-1' : 'left-1'}`}></div>
                      </div>
                    </div>
                    <div className="flex justify-between items-center p-4 bg-white/5 rounded-xl">
                      <div>
                        <div className="font-medium text-white">Dark Mode</div>
                        <div className="text-sm text-gray-400">System default</div>
                      </div>
                      <div onClick={() => setSettingsState(s => ({...s, dark: !s.dark}))} className={`w-12 h-6 rounded-full relative cursor-pointer transition ${settingsState.dark ? 'bg-primary-blue' : 'bg-white/20'}`}>
                        <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${settingsState.dark ? 'right-1' : 'left-1'}`}></div>
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          ) : (
            /* AI Chat Interface */
            <div className="flex flex-col h-full max-w-4xl mx-auto w-full px-4">
              <div className="flex-1 overflow-y-auto py-8 space-y-6 scrollbar-hide">
                <AnimatePresence>
                  {chatHistory.map((msg, idx) => (
                    <motion.div 
                      key={idx}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`flex gap-4 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      {msg.role === 'ai' && (
                        <div className="w-8 h-8 rounded-full bg-primary-blue/20 flex items-center justify-center shrink-0 border border-primary-blue/30 shadow-[0_0_10px_rgba(59,130,246,0.2)]">
                          {React.createElement(modules.find(m => m.id === activeModule)?.icon || BrainCircuit, { className: "w-4 h-4 text-primary-blue" })}
                        </div>
                      )}
                      
                      <div className={`p-4 rounded-2xl max-w-[80%] text-[15px] leading-relaxed shadow-sm whitespace-pre-wrap ${
                        msg.role === 'user' 
                          ? 'bg-white text-black rounded-tr-sm' 
                          : 'bg-white/5 border border-white/10 rounded-tl-sm text-gray-200'
                      }`}>
                        {msg.isLoading ? (
                          <div className="flex items-center gap-1 h-6">
                            <span className="w-2 h-2 bg-primary-blue rounded-full animate-bounce"></span>
                            <span className="w-2 h-2 bg-primary-purple rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></span>
                            <span className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></span>
                          </div>
                        ) : (
                          msg.content.replace(/\*\*/g, '').replace(/\*/g, '').replace(/#/g, '')
                        )}
                      </div>
                      
                      {msg.role === 'user' && (
                        <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center shrink-0 border border-white/20">
                          <User className="w-4 h-4" />
                        </div>
                      )}
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>

              {/* Input Area */}
              <div className="pb-8 pt-4">
                <div className="relative flex items-end gap-2 bg-[#1E293B] border border-white/10 rounded-2xl p-2 shadow-xl">
                  <button className="p-3 text-gray-400 hover:text-white transition rounded-xl hover:bg-white/5">
                    <Paperclip className="w-5 h-5" />
                  </button>
                  <textarea 
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyDown={(e) => { if(e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSendMessage(); } }}
                    placeholder={`Message ${modules.find(m => m.id === activeModule)?.name}...`}
                    className="flex-1 bg-transparent border-none focus:outline-none focus:ring-0 text-white resize-none py-3 px-2 max-h-32"
                    rows={1}
                  />
                  <div className="flex gap-2">
                    <button className="p-3 text-gray-400 hover:text-white transition rounded-xl hover:bg-white/5">
                      <Mic className="w-5 h-5" />
                    </button>
                    <button 
                      onClick={handleSendMessage}
                      className="p-3 bg-white text-black rounded-xl hover:bg-gray-200 transition flex items-center justify-center disabled:opacity-50"
                      disabled={!inputMessage.trim()}
                    >
                      <Send className="w-5 h-5" />
                    </button>
                  </div>
                </div>
                <div className="text-center mt-3 text-xs text-muted">
                  AI can make mistakes. Always consult with a real doctor for medical emergencies.
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Profile Setup Modal */}
      <ProfileSetupModal
        isOpen={showProfileSetupModal}
        profileData={profileData}
        onComplete={handleProfileSetupComplete}
      />
    </div>
  );
};

export default Dashboard;

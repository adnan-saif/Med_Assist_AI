import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, ChevronDown, X } from 'lucide-react';

interface ProfileSetupModalProps {
  isOpen: boolean;
  profileData: any;
  onComplete: (updatedProfile: any) => void;
  onCancel?: () => void;
}

export const ProfileSetupModal: React.FC<ProfileSetupModalProps> = ({ 
  isOpen, 
  profileData, 
  onComplete,
  onCancel 
}) => {
  const [formData, setFormData] = useState({
    age: profileData?.age || '',
    gender: profileData?.gender || '',
    medical_conditions: Array.isArray(profileData?.medical_conditions) 
      ? profileData.medical_conditions.join(', ') 
      : (profileData?.medical_conditions || ''),
    allergies: Array.isArray(profileData?.allergies) 
      ? profileData.allergies.join(', ') 
      : (profileData?.allergies || ''),
    medications: Array.isArray(profileData?.medications) 
      ? profileData.medications.join(', ') 
      : (profileData?.medications || ''),
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const isComplete = formData.age && formData.gender;

  const handleSubmit = async () => {
    if (!isComplete) {
      setError('Please fill in Age and Gender (required fields)');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Authentication token not found');
        setIsLoading(false);
        return;
      }

      const res = await fetch('http://localhost:8000/profile/me', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          age: parseInt(formData.age) || null,
          gender: formData.gender || null,
          medical_conditions: formData.medical_conditions
            ? formData.medical_conditions.split(',').map((s: string) => s.trim()).filter(Boolean)
            : [],
          allergies: formData.allergies
            ? formData.allergies.split(',').map((s: string) => s.trim()).filter(Boolean)
            : [],
          medications: formData.medications
            ? formData.medications.split(',').map((s: string) => s.trim()).filter(Boolean)
            : [],
        })
      });

      if (res.ok) {
        const updated = await res.json();
        onComplete(updated);
      } else {
        const errorData = await res.json();
        setError(errorData.detail || 'Failed to save profile');
      }
    } catch (err) {
      console.error('Profile setup error:', err);
      setError('Failed to save profile. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop - no click to close */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed inset-0 flex items-center justify-center z-50 p-4"
          >
            <div className="bg-secondary border border-white/10 rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              {/* Header */}
              <div className="sticky top-0 bg-secondary border-b border-white/5 p-6 flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-white">Complete Your Profile</h2>
                  <p className="text-sm text-gray-400 mt-1">Set up your profile to get personalized AI recommendations</p>
                </div>
                {onCancel && (
                  <button
                    onClick={onCancel}
                    className="p-2 hover:bg-white/10 rounded-lg transition text-gray-400 hover:text-white"
                  >
                    <X className="w-5 h-5" />
                  </button>
                )}
              </div>

              {/* Content */}
              <div className="p-8 space-y-8">
                {/* Info Banner */}
                <div className="p-4 bg-info/10 border border-info/20 rounded-xl flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-info shrink-0 mt-0.5" />
                  <div>
                    <div className="font-medium text-info text-sm">Required Information</div>
                    <div className="text-xs text-gray-300 mt-1">Age and Gender are required for safe and accurate AI recommendations</div>
                  </div>
                </div>

                {/* Error Message */}
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 bg-danger/10 border border-danger/20 rounded-xl text-danger text-sm"
                  >
                    {error}
                  </motion.div>
                )}

                {/* Form Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Age */}
                  <div>
                    <label className="block text-sm font-semibold text-white mb-3">
                      Age <span className="text-danger">*</span>
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="150"
                      value={formData.age}
                      onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                      placeholder="Enter your age"
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-primary-blue focus:ring-1 focus:ring-primary-blue/20 transition"
                    />
                  </div>

                  {/* Gender */}
                  <div>
                    <label className="block text-sm font-semibold text-white mb-3">
                      Gender <span className="text-danger">*</span>
                    </label>
                    <div className="relative">
                      <select
                        value={formData.gender}
                        onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                        className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-primary-blue focus:ring-1 focus:ring-primary-blue/20 transition appearance-none cursor-pointer"
                      >
                        <option value="" className="bg-secondary">Select your gender</option>
                        <option value="male" className="bg-secondary">Male</option>
                        <option value="female" className="bg-secondary">Female</option>
                        <option value="other" className="bg-secondary">Other</option>
                      </select>
                      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                    </div>
                  </div>

                  {/* Medical Conditions */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-white mb-3">
                      Medical Conditions <span className="text-xs text-gray-400 font-normal">(optional, comma separated)</span>
                    </label>
                    <input
                      type="text"
                      value={formData.medical_conditions}
                      onChange={(e) => setFormData({ ...formData, medical_conditions: e.target.value })}
                      placeholder="e.g. Diabetes, Hypertension, Asthma"
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-primary-blue focus:ring-1 focus:ring-primary-blue/20 transition"
                    />
                  </div>

                  {/* Allergies */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-white mb-3">
                      Allergies <span className="text-xs text-gray-400 font-normal">(optional, comma separated)</span>
                    </label>
                    <input
                      type="text"
                      value={formData.allergies}
                      onChange={(e) => setFormData({ ...formData, allergies: e.target.value })}
                      placeholder="e.g. Penicillin, Peanuts, Shellfish"
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-primary-blue focus:ring-1 focus:ring-primary-blue/20 transition"
                    />
                  </div>

                  {/* Medications */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-white mb-3">
                      Current Medications <span className="text-xs text-gray-400 font-normal">(optional, comma separated)</span>
                    </label>
                    <input
                      type="text"
                      value={formData.medications}
                      onChange={(e) => setFormData({ ...formData, medications: e.target.value })}
                      placeholder="e.g. Metformin, Lisinopril, Omeprazole"
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-primary-blue focus:ring-1 focus:ring-primary-blue/20 transition"
                    />
                  </div>
                </div>

                {/* Progress Indicator */}
                <div className="pt-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-gray-400 font-medium">PROFILE COMPLETION</span>
                    <span className="text-sm font-semibold text-white">{isComplete ? '100' : '50'}%</span>
                  </div>
                  <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: '50%' }}
                      animate={{ width: isComplete ? '100%' : '50%' }}
                      transition={{ duration: 0.3 }}
                      className="h-full bg-gradient-to-r from-primary-blue to-primary-purple rounded-full"
                    />
                  </div>
                </div>
              </div>

              {/* Footer - Actions */}
              <div className="sticky bottom-0 bg-secondary border-t border-white/5 p-6 flex gap-3 justify-end">
                {onCancel && (
                  <button
                    onClick={onCancel}
                    disabled={isLoading}
                    className="px-6 py-2.5 rounded-lg bg-white/5 hover:bg-white/10 text-white font-medium transition disabled:opacity-50"
                  >
                    Cancel
                  </button>
                )}
                <button
                  onClick={handleSubmit}
                  disabled={!isComplete || isLoading}
                  className="px-6 py-2.5 rounded-lg bg-primary-blue hover:bg-blue-600 text-white font-medium transition disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-primary-blue/20 flex items-center gap-2"
                >
                  {isLoading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                      Saving...
                    </>
                  ) : (
                    'Complete Setup'
                  )}
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

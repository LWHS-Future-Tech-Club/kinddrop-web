"use client";

import React, { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { LogOut, Sparkles, Sun, User, Mail, Lock, Camera, Shield, Calendar, MessageSquare, Hash } from 'lucide-react';
import PageTransition from '../components/PageTransition';
import Image from 'next/image';
import Logo from '../components/Logo';
import { Button } from '../components/ui/button';

interface UserData {
  id?: string;
  email?: string;
  username?: string;
  firstName?: string;
  lastName?: string;
  points?: number;
  profileImage?: string;
  hasRegeneratedUsername?: boolean;
  ipAddress?: string;
  accountType?: string;
  roles?: string[];
  sentMessagesCount?: number;
  receivedMessagesCount?: number;
  createdAt?: string;
}

export function SettingsPage() {
  const router = useRouter();
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  
  // Form states
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [emailPassword, setEmailPassword] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  // UI states
  const [activeTab, setActiveTab] = useState<'profile' | 'security' | 'account'>('profile');
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [saving, setSaving] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      const res = await fetch('/api/get-user', { credentials: 'include' });
      if (res.ok) {
        const data = await res.json();
        setUser(data.user);
        setFirstName(data.user.firstName || '');
        setLastName(data.user.lastName || '');
      }
    } catch (err) {
      console.error('Failed to load user:', err);
    } finally {
      setLoading(false);
    }
  };

  const showMessage = (type: 'success' | 'error', text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 5000);
  };

  const handleUpdateProfile = async () => {
    if (!firstName.trim()) {
      showMessage('error', 'First name is required');
      return;
    }
    
    setSaving(true);
    try {
      const res = await fetch('/api/update-profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ firstName, lastName })
      });
      
      if (res.ok) {
        const data = await res.json();
        setUser(prev => ({ ...prev, firstName: data.firstName, lastName: data.lastName }));
        showMessage('success', 'Profile updated successfully');
      } else {
        const err = await res.json();
        showMessage('error', err.error || 'Failed to update profile');
      }
    } catch (err) {
      showMessage('error', 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const handleChangeEmail = async () => {
    if (!newEmail || !emailPassword) {
      showMessage('error', 'Email and password are required');
      return;
    }
    
    setSaving(true);
    try {
      const res = await fetch('/api/change-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ newEmail, password: emailPassword })
      });
      
      if (res.ok) {
        const data = await res.json();
        setUser(prev => ({ ...prev, email: data.email, id: data.email }));
        setNewEmail('');
        setEmailPassword('');
        showMessage('success', 'Email updated successfully');
      } else {
        const err = await res.json();
        showMessage('error', err.error || 'Failed to change email');
      }
    } catch (err) {
      showMessage('error', 'Failed to change email');
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async () => {
    if (!currentPassword || !newPassword) {
      showMessage('error', 'All password fields are required');
      return;
    }
    
    if (newPassword !== confirmPassword) {
      showMessage('error', 'New passwords do not match');
      return;
    }
    
    if (newPassword.length < 6) {
      showMessage('error', 'Password must be at least 6 characters');
      return;
    }
    
    setSaving(true);
    try {
      const res = await fetch('/api/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ currentPassword, newPassword })
      });
      
      if (res.ok) {
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
        showMessage('success', 'Password changed successfully');
      } else {
        const err = await res.json();
        showMessage('error', err.error || 'Failed to change password');
      }
    } catch (err) {
      showMessage('error', 'Failed to change password');
    } finally {
      setSaving(false);
    }
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    if (!file.type.startsWith('image/')) {
      showMessage('error', 'Please select an image file');
      return;
    }
    
    if (file.size > 2 * 1024 * 1024) {
      showMessage('error', 'Image must be less than 2MB');
      return;
    }
    
    const reader = new FileReader();
    reader.onload = async (event) => {
      const base64 = event.target?.result as string;
      
      setSaving(true);
      try {
        const res = await fetch('/api/upload-profile-picture', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({ profileImage: base64 })
        });
        
        if (res.ok) {
          const data = await res.json();
          setUser(prev => ({ ...prev, profileImage: data.profileImage }));
          showMessage('success', 'Profile picture updated');
        } else {
          const err = await res.json();
          showMessage('error', err.error || 'Failed to upload image');
        }
      } catch (err) {
        showMessage('error', 'Failed to upload image');
      } finally {
        setSaving(false);
      }
    };
    reader.readAsDataURL(file);
  };

  const regenerateAvatar = async () => {
    setSaving(true);
    try {
      const res = await fetch('/api/regenerate-avatar', { method: 'POST', credentials: 'include' });
      if (res.ok) {
        const data = await res.json();
        setUser(prev => ({ ...prev, profileImage: data.profileImage }));
        showMessage('success', 'Avatar regenerated');
      }
    } catch (err) {
      showMessage('error', 'Failed to regenerate avatar');
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/logout', { method: 'POST', credentials: 'include' });
    } catch (err) {}
    try {
      localStorage.removeItem('kinddrop_user');
    } catch (storageErr) {}
    router.push('/login');
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Unknown';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role.toLowerCase()) {
      case 'admin': return 'bg-red-500/20 text-red-300 border-red-500/30';
      case 'dev': return 'bg-blue-500/20 text-blue-300 border-blue-500/30';
      case 'beta tester': return 'bg-green-500/20 text-green-300 border-green-500/30';
      default: return 'bg-white/10 text-white/70 border-white/20';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-white/60">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="glass-header mx-6 my-6 px-8 py-4">
        <div className="flex items-center justify-between">
          <Logo />
          <div className="flex items-center gap-4">
            <div className="glass-card px-4 py-2 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-[var(--primary)]" />
              <span className="font-bold">{user?.points ?? 0}</span>
              <span className="text-sm">karma</span>
            </div>
            <div className="flex items-center gap-4">
              <Link href="/dashboard">
                <button className="btn-outline flex items-center gap-2 px-3 py-1">
                  <Sun className="w-4 h-4 mr-2" />
                  Dashboard
                </button>
              </Link>
              <Button variant="outline" size="sm" onClick={handleLogout}>
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <PageTransition className="flex-1">
        <div className="flex items-start justify-center px-4 pb-8">
          <div className="w-full max-w-4xl">
          {/* Message Toast */}
          {message && (
            <div className={`mb-4 p-4 rounded-lg border ${
              message.type === 'success' 
                ? 'bg-green-500/20 border-green-500/30 text-green-300' 
                : 'bg-red-500/20 border-red-500/30 text-red-300'
            }`}>
              {message.text}
            </div>
          )}

          <div className="glass-card p-8">
            <h1 className="text-2xl font-bold mb-2 text-glow">
              Settings
            </h1>
            <p className="mb-6 text-white/60">Manage your account settings and preferences</p>

            {/* Tabs */}
            <div className="flex gap-2 mb-6 border-b border-white/10 pb-4">
              <button
                onClick={() => setActiveTab('profile')}
                className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-all ${
                  activeTab === 'profile' ? 'bg-[var(--primary)] text-white' : 'text-white/60 hover:text-white hover:bg-white/5'
                }`}
              >
                <User className="w-4 h-4" />
                Profile
              </button>
              <button
                onClick={() => setActiveTab('security')}
                className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-all ${
                  activeTab === 'security' ? 'bg-[var(--primary)] text-white' : 'text-white/60 hover:text-white hover:bg-white/5'
                }`}
              >
                <Lock className="w-4 h-4" />
                Security
              </button>
              <button
                onClick={() => setActiveTab('account')}
                className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-all ${
                  activeTab === 'account' ? 'bg-[var(--primary)] text-white' : 'text-white/60 hover:text-white hover:bg-white/5'
                }`}
              >
                <Shield className="w-4 h-4" />
                Account Info
              </button>
            </div>

            {/* Profile Tab */}
            {activeTab === 'profile' && (
              <div className="space-y-6">
                {/* Profile Picture */}
                <div className="flex items-start gap-6">
                  <div className="relative">
                    {user?.profileImage ? (
                      <img src={user.profileImage} alt="Profile" className="w-24 h-24 rounded-full border-2 border-white/20" />
                    ) : (
                      <div className="w-24 h-24 rounded-full bg-white/10 flex items-center justify-center">
                        <User className="w-10 h-10 text-white/40" />
                      </div>
                    )}
                    <button 
                      onClick={() => fileInputRef.current?.click()}
                      className="absolute bottom-0 right-0 w-8 h-8 bg-[var(--primary)] rounded-full flex items-center justify-center hover:bg-[var(--primary)]/80 transition-colors"
                    >
                      <Camera className="w-4 h-4 text-white" />
                    </button>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleFileSelect}
                      className="hidden"
                    />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-lg mb-1">Profile Picture</h3>
                    <p className="text-white/60 text-sm mb-3">Upload a custom image or generate a new avatar</p>
                    <div className="flex gap-2">
                      <button onClick={() => fileInputRef.current?.click()} className="btn-outline px-3 py-1 text-sm">
                        Upload Image
                      </button>
                      <button onClick={regenerateAvatar} className="btn-outline px-3 py-1 text-sm" disabled={saving}>
                        Regenerate Avatar
                      </button>
                    </div>
                  </div>
                </div>

                {/* Name Fields */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-white/60 mb-2">First Name *</label>
                    <input
                      type="text"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      className="input-glass w-full"
                      placeholder="Your first name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-white/60 mb-2">Last Name (optional)</label>
                    <input
                      type="text"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      className="input-glass w-full"
                      placeholder="Your last name"
                    />
                  </div>
                </div>

                <button 
                  onClick={handleUpdateProfile} 
                  className="btn-glow px-6 py-2"
                  disabled={saving}
                >
                  {saving ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            )}

            {/* Security Tab */}
            {activeTab === 'security' && (
              <div className="space-y-8">
                {/* Change Email */}
                <div className="p-4 bg-white/5 rounded-lg">
                  <h3 className="font-bold text-lg mb-1 flex items-center gap-2">
                    <Mail className="w-5 h-5" />
                    Change Email
                  </h3>
                  <p className="text-white/60 text-sm mb-4">Current: {user?.email}</p>
                  <div className="space-y-3">
                    <input
                      type="email"
                      value={newEmail}
                      onChange={(e) => setNewEmail(e.target.value)}
                      className="input-glass w-full"
                      placeholder="New email address"
                    />
                    <input
                      type="password"
                      value={emailPassword}
                      onChange={(e) => setEmailPassword(e.target.value)}
                      className="input-glass w-full"
                      placeholder="Confirm with your password"
                    />
                    <button 
                      onClick={handleChangeEmail} 
                      className="btn-outline px-4 py-2"
                      disabled={saving}
                    >
                      {saving ? 'Updating...' : 'Update Email'}
                    </button>
                  </div>
                </div>

                {/* Change Password */}
                <div className="p-4 bg-white/5 rounded-lg">
                  <h3 className="font-bold text-lg mb-1 flex items-center gap-2">
                    <Lock className="w-5 h-5" />
                    Change Password
                  </h3>
                  <p className="text-white/60 text-sm mb-4">Use a strong password with at least 6 characters</p>
                  <div className="space-y-3">
                    <input
                      type="password"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      className="input-glass w-full"
                      placeholder="Current password"
                    />
                    <input
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="input-glass w-full"
                      placeholder="New password"
                    />
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="input-glass w-full"
                      placeholder="Confirm new password"
                    />
                    <button 
                      onClick={handleChangePassword} 
                      className="btn-outline px-4 py-2"
                      disabled={saving}
                    >
                      {saving ? 'Changing...' : 'Change Password'}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Account Info Tab */}
            {activeTab === 'account' && (
              <div className="space-y-6">
                {/* Stats Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div className="p-4 bg-white/5 rounded-lg text-center">
                    <MessageSquare className="w-6 h-6 mx-auto mb-2 text-[var(--primary)]" />
                    <div className="text-2xl font-bold">{user?.sentMessagesCount || 0}</div>
                    <div className="text-xs text-white/60">Messages Sent</div>
                  </div>
                  <div className="p-4 bg-white/5 rounded-lg text-center">
                    <MessageSquare className="w-6 h-6 mx-auto mb-2 text-green-400" />
                    <div className="text-2xl font-bold">{user?.receivedMessagesCount || 0}</div>
                    <div className="text-xs text-white/60">Messages Received</div>
                  </div>
                  <div className="p-4 bg-white/5 rounded-lg text-center">
                    <Sparkles className="w-6 h-6 mx-auto mb-2 text-yellow-400" />
                    <div className="text-2xl font-bold">{user?.points || 0}</div>
                    <div className="text-xs text-white/60">Total Karma</div>
                  </div>
                  <div className="p-4 bg-white/5 rounded-lg text-center">
                    <Calendar className="w-6 h-6 mx-auto mb-2 text-blue-400" />
                    <div className="text-sm font-bold">{formatDate(user?.createdAt)}</div>
                    <div className="text-xs text-white/60">Member Since</div>
                  </div>
                </div>

                {/* Account Details */}
                <div className="p-4 bg-white/5 rounded-lg space-y-4">
                  <h3 className="font-bold text-lg mb-4">Account Details</h3>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <span className="text-xs text-white/50 flex items-center gap-1">
                        <Hash className="w-3 h-3" /> User ID
                      </span>
                      <p className="font-mono text-sm text-white/80 break-all">{user?.id || 'Unknown'}</p>
                    </div>
                    <div>
                      <span className="text-xs text-white/50 flex items-center gap-1">
                        <Mail className="w-3 h-3" /> Email
                      </span>
                      <p className="font-mono text-sm text-white/80">{user?.email || 'Loading...'}</p>
                    </div>
                    <div>
                      <span className="text-xs text-white/50 flex items-center gap-1">
                        <User className="w-3 h-3" /> Username
                      </span>
                      <p className="font-mono text-sm text-white/80">{user?.username || 'Not set'}</p>
                    </div>
                    <div>
                      <span className="text-xs text-white/50 flex items-center gap-1">
                        <Shield className="w-3 h-3" /> Account Type
                      </span>
                      <p className="font-mono text-sm text-white/80 capitalize">{user?.accountType || 'Regular'}</p>
                    </div>
                  </div>

                  {/* Roles */}
                  <div>
                    <span className="text-xs text-white/50 block mb-2">Roles</span>
                    <div className="flex flex-wrap gap-2">
                      {(user?.roles || ['user']).map((role, index) => (
                        <span 
                          key={index}
                          className={`px-3 py-1 rounded-full text-xs font-medium border ${getRoleBadgeColor(role)}`}
                        >
                          {role}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="mt-8 pt-6 border-t border-white/10">
              <Link href="/dashboard" className="btn-glow inline-block">
                Back to Dashboard
              </Link>
            </div>
          </div>
        </div>
        </div>
      </PageTransition>
    </div>
  );
}

export default SettingsPage;
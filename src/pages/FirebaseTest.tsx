"use client";

import React, { useState } from 'react';
import { createTestUser, getUser, updateUserPoints, unlockItem, addMessage } from '../lib/firestore';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';

export default function FirebaseTest() {
  const [userId, setUserId] = useState('test-user-123');
  const [email, setEmail] = useState('test@example.com');
  const [userData, setUserData] = useState<any>(null);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleCreateUser = async () => {
    setLoading(true);
    setMessage('Creating user...');
    try {
      const result = await createTestUser(userId, email);
      if (result.success) {
        setMessage(`✅ User created: ${userId}`);
      } else {
        setMessage(`❌ Error: ${JSON.stringify(result.error)}`);
      }
    } catch (error: any) {
      setMessage(`❌ Exception: ${error.message || error}`);
      console.error('Create user error:', error);
    }
    setLoading(false);
  };

  const handleGetUser = async () => {
    setLoading(true);
    setMessage('Fetching user...');
    try {
      const result = await getUser(userId);
      if (result.success) {
        setUserData(result.data);
        setMessage(`✅ User loaded: ${userId}`);
      } else {
        setMessage(`❌ Error: ${JSON.stringify(result.error)}`);
      }
    } catch (error: any) {
      setMessage(`❌ Exception: ${error.message || error}`);
      console.error('Get user error:', error);
    }
    setLoading(false);
  };

  const handleAddPoints = async () => {
    setLoading(true);
    const newPoints = (userData?.points || 0) + 10;
    const result = await updateUserPoints(userId, newPoints);
    if (result.success) {
      setMessage(`✅ Added 10 points! New total: ${newPoints}`);
      await handleGetUser(); // Refresh data
    } else {
      setMessage(`❌ Error: ${result.error}`);
    }
    setLoading(false);
  };

  const handleUnlockItem = async () => {
    setLoading(true);
    const result = await unlockItem(userId, 'font-serif');
    if (result.success) {
      setMessage(`✅ Unlocked item: font-serif`);
      await handleGetUser(); // Refresh data
    } else {
      setMessage(`❌ Error: ${result.error}`);
    }
    setLoading(false);
  };

  const handleAddMessage = async () => {
    setLoading(true);
    const newMessage = {
      id: Date.now().toString(),
      text: 'Test message: You are awesome!',
      type: 'sent',
      customization: {
        fontFamily: 'sans-serif',
        color: '#000000',
        backgroundColor: '#FFFFFF',
        fontSize: 'medium',
      }
    };
    const result = await addMessage(userId, newMessage);
    if (result.success) {
      setMessage(`✅ Message added!`);
      await handleGetUser(); // Refresh data
    } else {
      setMessage(`❌ Error: ${result.error}`);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <h1 className="text-3xl font-bold text-white mb-8">Firebase Firestore Test</h1>

        {/* Input Section */}
        <Card className="glass-card border-purple-500/30">
          <CardHeader>
            <CardTitle className="text-white">User Configuration</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-white/70 text-sm">User ID</label>
              <Input
                className="input-glass mt-1"
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
                placeholder="test-user-123"
              />
            </div>
            <div>
              <label className="text-white/70 text-sm">Email</label>
              <Input
                className="input-glass mt-1"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="test@example.com"
                type="email"
              />
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <Card className="glass-card border-purple-500/30">
          <CardHeader>
            <CardTitle className="text-white">Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <Button 
                onClick={handleCreateUser} 
                disabled={loading}
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
              >
                Create User
              </Button>
              <Button 
                onClick={handleGetUser} 
                disabled={loading}
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
              >
                Get User Data
              </Button>
              <Button 
                onClick={handleAddPoints} 
                disabled={loading || !userData}
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
              >
                Add 10 Points
              </Button>
              <Button 
                onClick={handleUnlockItem} 
                disabled={loading || !userData}
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
              >
                Unlock font-serif
              </Button>
              <Button 
                onClick={handleAddMessage} 
                disabled={loading || !userData}
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 col-span-2"
              >
                Add Test Message
              </Button>
            </div>
            
            {message && (
              <div className={`p-3 rounded-lg ${message.includes('✅') ? 'bg-green-500/20 text-green-300' : 'bg-red-500/20 text-red-300'}`}>
                {message}
              </div>
            )}
          </CardContent>
        </Card>

        {/* User Data Display */}
        {userData && (
          <Card className="glass-card border-purple-500/30">
            <CardHeader>
              <CardTitle className="text-white">User Data</CardTitle>
            </CardHeader>
            <CardContent>
              <pre className="text-white/90 text-sm overflow-auto p-4 bg-black/30 rounded-lg">
                {JSON.stringify(userData, null, 2)}
              </pre>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

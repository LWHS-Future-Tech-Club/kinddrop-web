"use client";

import { useEffect, useMemo, useState } from 'react';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Badge } from '@/app/components/ui/badge';
import { Switch } from '@/app/components/ui/switch';
import TopBar from '@/app/components/TopBar';
import { RefreshCw, Pencil, Ban as BanIcon, ShieldCheck, Trash2 } from 'lucide-react';

interface AdminUser {
  email: string;
  username: string;
  firstName: string;
  lastName?: string;
  points: number;
  roles: string[];
  accountType: string;
  banned: boolean;
  createdAt: string | null;
  lastLoginAt: string | null;
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selected, setSelected] = useState<AdminUser | null>(null);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);

  const loadUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/admin/list-users', { credentials: 'include' });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to load users');
      setUsers(data.users || []);
    } catch (err: any) {
      setError(err.message || 'Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleSelect = (user: AdminUser) => {
    setSelected({ ...user });
  };

  const handleFieldChange = (field: keyof AdminUser, value: any) => {
    if (!selected) return;
    setSelected({ ...selected, [field]: value });
  };

  const handleSave = async () => {
    if (!selected) return;
    setSaving(true);
    setError(null);
    try {
      const res = await fetch('/api/admin/update-user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          email: selected.email,
          firstName: selected.firstName,
          username: selected.username,
          points: selected.points,
          banned: selected.banned,
          roles: selected.roles,
          accountType: selected.accountType,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to update user');
      await loadUsers();
    } catch (err: any) {
      setError(err.message || 'Failed to save user');
    } finally {
      setSaving(false);
    }
  };

  const handleToggleBan = async (user: AdminUser) => {
    setSaving(true);
    setError(null);
    try {
      const res = await fetch('/api/admin/update-user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email: user.email, banned: !user.banned }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to update user');
      await loadUsers();
    } catch (err: any) {
      setError(err.message || 'Failed to update user');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (email: string) => {
    setDeleting(email);
    setError(null);
    try {
      const res = await fetch('/api/admin/delete-user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to delete user');
      setSelected((prev) => (prev?.email === email ? null : prev));
      await loadUsers();
    } catch (err: any) {
      setError(err.message || 'Failed to delete user');
    } finally {
      setDeleting(null);
    }
  };

  const selectedIsAdmin = useMemo(
    () => selected?.roles?.includes('admin') || selected?.accountType === 'admin',
    [selected]
  );

  return (
    <div className="min-h-screen bg-[#04011E] text-white px-6 py-8 relative overflow-hidden">
      <div className="floating-glow" style={{ top: '-8%', left: '-6%' }} />
      <div className="floating-glow" style={{ bottom: '-10%', right: '-8%' }} />
      <TopBar />
      <div className="max-w-6xl mx-auto">
        <header className="glass-header px-6 py-4 flex items-center justify-between border border-[rgba(128,0,255,0.14)] bg-[rgba(7,2,32,0.75)] shadow-[0_10px_40px_rgba(0,0,0,0.25)]">
          <div>
            <h1 className="text-2xl font-semibold">Admin • User Management</h1>
            <p className="text-[rgba(217,200,255,0.7)] text-sm mt-1">
              Edit profiles, ban users, and delete accounts (messages are removed on delete).
            </p>
          </div>
          <Button variant="outline" size="sm" onClick={loadUsers} disabled={loading} className="gap-2">
            <RefreshCw className="w-4 h-4" />
            Refresh
          </Button>
        </header>

        <div className="grid lg:grid-cols-3 gap-6 mt-8">
          {/* Users list */}
          <div className="lg:col-span-2 bg-[rgba(7,2,32,0.65)] border border-[rgba(128,0,255,0.16)] rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.35)]">
            <div className="p-4 border-b border-white/5 flex items-center justify-between">
              <h2 className="text-lg font-semibold">Users</h2>
              {loading && <span className="text-sm text-[rgba(217,200,255,0.7)]">Loading…</span>}
            </div>
            {error && (
              <div className="px-4 py-3 text-sm text-rose-200 bg-rose-500/10 border border-rose-500/30">
                {error}
              </div>
            )}
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-white/5 border-b border-white/5">
                  <tr>
                    <th className="px-4 py-3 text-left text-[rgba(217,200,255,0.9)]">Email</th>
                    <th className="px-4 py-3 text-left text-[rgba(217,200,255,0.9)]">Username</th>
                    <th className="px-4 py-3 text-left text-[rgba(217,200,255,0.9)]">Points</th>
                    <th className="px-4 py-3 text-left text-[rgba(217,200,255,0.9)]">Roles</th>
                    <th className="px-4 py-3 text-left text-[rgba(217,200,255,0.9)]">Banned</th>
                    <th className="px-4 py-3 text-left text-[rgba(217,200,255,0.9)]">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {users.map((user) => (
                    <tr key={user.email} className="hover:bg-white/3">
                      <td className="px-4 py-3 font-medium text-white">{user.email}</td>
                      <td className="px-4 py-3 text-[rgba(217,200,255,0.85)]">{user.username}</td>
                      <td className="px-4 py-3 text-white">{user.points}</td>
                      <td className="px-4 py-3 text-[rgba(217,200,255,0.8)]">
                        {user.roles?.length ? user.roles.join(', ') : 'user'}
                      </td>
                      <td className="px-4 py-3">
                        <Badge variant={user.banned ? 'destructive' : 'secondary'}>
                          {user.banned ? 'Banned' : 'Active'}
                        </Badge>
                      </td>
                      <td className="px-4 py-3 flex flex-wrap gap-2">
                        <Button variant="secondary" size="icon" onClick={() => handleSelect(user)} title="Edit user" className="shrink-0">
                          <Pencil className="w-4 h-4" />
                        </Button>
                        <Button
                          variant={user.banned ? 'default' : 'outline'}
                          size="icon"
                          onClick={() => handleToggleBan(user)}
                          disabled={saving}
                          title={user.banned ? 'Unban user' : 'Ban user'}
                          className="shrink-0"
                        >
                          {user.banned ? <ShieldCheck className="w-4 h-4" /> : <BanIcon className="w-4 h-4" />}
                        </Button>
                        <Button
                          variant="destructive"
                          size="icon"
                          onClick={() => handleDelete(user.email)}
                          disabled={deleting === user.email}
                          title="Delete user"
                          className="shrink-0"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Edit pane */}
          <div className="relative">
            {selected && (
              <div className="bg-[rgba(7,2,32,0.65)] border border-[rgba(128,0,255,0.16)] rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.35)] p-5 flex flex-col gap-4 animate-in fade-in slide-in-from-right duration-200">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold">Edit User</h2>
                  <Badge variant="secondary">{selected.email}</Badge>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm text-[rgba(217,200,255,0.8)]">First name</label>
                    <Input
                      value={selected.firstName}
                      onChange={(e) => handleFieldChange('firstName', e.target.value)}
                      className="mt-1 bg-transparent border-white/20 text-white placeholder-white/60"
                    />
                  </div>
                  <div>
                    <label className="text-sm text-[rgba(217,200,255,0.8)]">Username</label>
                    <Input
                      value={selected.username}
                      onChange={(e) => handleFieldChange('username', e.target.value)}
                      className="mt-1 bg-transparent border-white/20 text-white placeholder-white/60"
                    />
                  </div>
                  <div>
                    <label className="text-sm text-[rgba(217,200,255,0.8)]">Points</label>
                    <Input
                      type="number"
                      value={selected.points}
                      onChange={(e) => handleFieldChange('points', Number(e.target.value))}
                      className="mt-1 bg-transparent border-white/20 text-white placeholder-white/60"
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-[rgba(217,200,255,0.8)]">Banned</p>
                      <p className="text-xs text-[rgba(217,200,255,0.6)]">Banned users cannot login or send messages.</p>
                    </div>
                    <Switch
                      checked={selected.banned}
                      onCheckedChange={(v) => handleFieldChange('banned', v)}
                    />
                  </div>
                  <div>
                    <label className="text-sm text-[rgba(217,200,255,0.8)]">Roles (comma separated)</label>
                    <Input
                      value={selected.roles?.join(', ') || ''}
                      onChange={(e) => handleFieldChange('roles', e.target.value.split(',').map((r) => r.trim()).filter(Boolean))}
                      className="mt-1 bg-transparent border-white/20 text-white placeholder-white/60"
                    />
                  </div>
                  <div>
                    <label className="text-sm text-[rgba(217,200,255,0.8)]">Account type</label>
                    <Input
                      value={selected.accountType}
                      onChange={(e) => handleFieldChange('accountType', e.target.value)}
                      className="mt-1 bg-transparent border-white/20 text-white placeholder-white/60"
                    />
                  </div>
                  {selectedIsAdmin && (
                    <p className="text-xs text-[rgba(217,200,255,0.7)]">This user is an admin.</p>
                  )}

                  <div className="flex gap-2">
                    <Button onClick={handleSave} disabled={saving}>
                      {saving ? 'Saving…' : 'Save changes'}
                    </Button>
                    <Button variant="outline" onClick={() => setSelected(null)} disabled={saving}>
                      Cancel
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

import React, { useState, useEffect, useCallback } from 'react';
import {
  Users,
  UserPlus,
  KeyRound,
  LogOut,
  Shield,
  ShieldCheck,
  ShieldAlert,
  Power,
  Trash2,
  Lock,
  Eye,
  EyeOff,
  Check,
  CheckCircle2,
  AlertCircle,
  X,
  RefreshCw,
  User,
  GraduationCap
} from 'lucide-react';
import { apiService } from '../services/apiService';
import { soundEffects } from '../utils/audioFeedback';

export default function UserManagementSection({ currentUser, theme }) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(null);
  const [feedback, setFeedback] = useState({ type: '', message: '' });

  // Modal states
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  // Form states for Add User
  const [newFullName, setNewFullName] = useState('');
  const [newUsername, setNewUsername] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newRole, setNewRole] = useState('guest');
  const [newFieldOfStudy, setNewFieldOfStudy] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [addError, setAddError] = useState('');

  // Form states for Edit Credentials
  const [targetUser, setTargetUser] = useState(null);
  const [editFullName, setEditFullName] = useState('');
  const [editUsername, setEditUsername] = useState('');
  const [editPassword, setEditPassword] = useState('');
  const [editRole, setEditRole] = useState('guest');
  const [editFieldOfStudy, setEditFieldOfStudy] = useState('');
  const [editIsActive, setEditIsActive] = useState(true);
  const [adminPasswordConfirm, setAdminPasswordConfirm] = useState('');
  const [showEditPassword, setShowEditPassword] = useState(false);
  const [showAdminConfirm, setShowAdminConfirm] = useState(false);
  const [editError, setEditError] = useState('');

  // Form states for Delete User
  const [deleteAdminPassword, setDeleteAdminPassword] = useState('');
  const [deleteError, setDeleteError] = useState('');

  const showFeedback = (type, message) => {
    setFeedback({ type, message });
    setTimeout(() => {
      setFeedback({ type: '', message: '' });
    }, 4000);
  };

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const res = await apiService.getAllUsers();
      if (res && res.success && Array.isArray(res.data)) {
        setUsers(res.data);
      }
    } catch (err) {
      console.error('Failed to load users:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  // Open Edit Credentials Modal
  const handleOpenEdit = (user) => {
    setTargetUser(user);
    setEditFullName(user.name || '');
    setEditUsername(user.username || '');
    setEditPassword('');
    setEditRole(user.role || 'guest');
    setEditFieldOfStudy(user.fieldOfStudy || '');
    setEditIsActive(user.isActive !== false);
    setAdminPasswordConfirm('');
    setEditError('');
    setIsEditModalOpen(true);
  };

  // Open Delete Modal
  const handleOpenDelete = (user) => {
    setTargetUser(user);
    setDeleteAdminPassword('');
    setDeleteError('');
    setIsDeleteModalOpen(true);
  };

  // Submit Add New User
  const handleCreateUser = async (e) => {
    e.preventDefault();
    setAddError('');

    if (!newFullName.trim()) {
      setAddError('Full name is required.');
      return;
    }
    if (!newUsername.trim()) {
      setAddError('Username / Login ID is required.');
      return;
    }
    if (!newPassword || newPassword.length < 4) {
      setAddError('Password must be at least 4 characters long.');
      return;
    }

    setActionLoading('create');
    try {
      const res = await apiService.createUser({
        name: newFullName.trim(),
        username: newUsername.trim().toLowerCase(),
        password: newPassword.trim(),
        role: newRole,
        fieldOfStudy: newFieldOfStudy.trim()
      });

      if (res && res.success) {
        soundEffects.playSuccess();
        showFeedback('success', `User account @${newUsername.trim().toLowerCase()} created successfully!`);
        setIsAddModalOpen(false);
        setNewFullName('');
        setNewUsername('');
        setNewPassword('');
        setNewFieldOfStudy('');
        fetchUsers();
      } else {
        setAddError(res?.message || 'Failed to create user.');
      }
    } catch (err) {
      setAddError(err.message || 'Error creating user account.');
    } finally {
      setActionLoading(null);
    }
  };

  // Submit Edit Credentials
  const handleUpdateCredentials = async (e) => {
    e.preventDefault();
    setEditError('');

    if (!targetUser) return;

    // Verify Admin Password
    const expectedAdminPassword = currentUser?.password || 'Password123!';
    if (!adminPasswordConfirm) {
      setEditError('Administrator password is required to authorize credential changes.');
      return;
    }
    if (adminPasswordConfirm !== expectedAdminPassword) {
      setEditError('Incorrect administrator password. Authorization failed.');
      return;
    }

    if (!editFullName.trim()) {
      setEditError('Full name is required.');
      return;
    }
    if (!editUsername.trim()) {
      setEditError('Username is required.');
      return;
    }
    if (editPassword && editPassword.length < 4) {
      setEditError('New password must be at least 4 characters long.');
      return;
    }

    setActionLoading(`edit-${targetUser.id}`);
    try {
      const payload = {
        name: editFullName.trim(),
        username: editUsername.trim().toLowerCase(),
        role: editRole,
        fieldOfStudy: editFieldOfStudy.trim(),
        isActive: editIsActive
      };
      if (editPassword.trim()) {
        payload.password = editPassword.trim();
      }

      const res = await apiService.updateUserCredentials(targetUser.id, payload);
      if (res && res.success) {
        soundEffects.playSuccess();
        showFeedback('success', `Credentials updated for @${res.data?.username || targetUser.username}!`);
        setIsEditModalOpen(false);
        fetchUsers();
      } else {
        setEditError(res?.message || 'Failed to update user credentials.');
      }
    } catch (err) {
      setEditError(err.message || 'Error updating credentials.');
    } finally {
      setActionLoading(null);
    }
  };

  // Submit Force Logout
  const handleForceLogout = async (user) => {
    setActionLoading(`logout-${user.id}`);
    try {
      const res = await apiService.forceLogoutUser(user.id);
      if (res && res.success) {
        soundEffects.playSuccess();
        showFeedback('success', `Session terminated for @${user.username}. They must log in again.`);
        fetchUsers();
      } else {
        showFeedback('error', res?.message || 'Failed to terminate session.');
      }
    } catch (err) {
      showFeedback('error', err.message || 'Error terminating session.');
    } finally {
      setActionLoading(null);
    }
  };

  // Submit Toggle Active Status
  const handleToggleStatus = async (user) => {
    if (user.role === 'admin' || user.username === 'n0vemberain') {
      showFeedback('error', 'Cannot suspend the primary administrator account.');
      return;
    }

    setActionLoading(`toggle-${user.id}`);
    try {
      const res = await apiService.toggleUserStatus(user.id);
      if (res && res.success) {
        soundEffects.playSuccess();
        const statusText = res.data?.isActive ? 'Activated' : 'Suspended';
        showFeedback('success', `Account @${user.username} has been ${statusText}.`);
        fetchUsers();
      } else {
        showFeedback('error', res?.message || 'Failed to update account status.');
      }
    } catch (err) {
      showFeedback('error', err.message || 'Error updating account status.');
    } finally {
      setActionLoading(null);
    }
  };

  // Submit Delete User
  const handleDeleteUser = async (e) => {
    e.preventDefault();
    setDeleteError('');

    if (!targetUser) return;

    const expectedAdminPassword = currentUser?.password || 'Password123!';
    if (!deleteAdminPassword) {
      setDeleteError('Administrator password is required to delete an account.');
      return;
    }
    if (deleteAdminPassword !== expectedAdminPassword) {
      setDeleteError('Incorrect administrator password. Deletion cancelled.');
      return;
    }

    setActionLoading(`delete-${targetUser.id}`);
    try {
      const res = await apiService.deleteUser(targetUser.id);
      if (res && res.success) {
        soundEffects.playSuccess();
        showFeedback('success', `User account @${targetUser.username} and all associated data deleted.`);
        setIsDeleteModalOpen(false);
        fetchUsers();
      } else {
        setDeleteError(res?.message || 'Failed to delete user.');
      }
    } catch (err) {
      setDeleteError(err.message || 'Error deleting user.');
    } finally {
      setActionLoading(null);
    }
  };

  const guestCount = users.filter((u) => u.role !== 'admin').length;
  const activeCount = users.filter((u) => u.isActive !== false).length;

  return (
    <div className="bg-[#161b22] border border-github-border rounded-xl p-6 shadow-sm space-y-6">
      {/* Top Header Card */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-github-border">
        <div className="flex items-center gap-3">
          <div
            className="p-2.5 rounded-xl border flex items-center justify-center"
            style={{
              backgroundColor: theme.accentDark,
              borderColor: theme.accent + '40',
              color: theme.accent
            }}
          >
            <Users className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <span>User &amp; Guest Accounts Management</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full font-mono bg-purple-950/60 text-purple-300 border border-purple-800/50 flex items-center gap-1">
                <ShieldCheck className="w-2.5 h-2.5 text-purple-400" />
                Administrator Access
              </span>
            </h3>
            <p className="text-xs text-github-muted">
              Create guest accounts, update credentials, isolate user activity data, or force logout sessions.
            </p>
          </div>
        </div>

        {/* Action Button: Add User */}
        <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end">
          <button
            type="button"
            onClick={fetchUsers}
            disabled={loading}
            className="p-2 rounded-lg bg-[#21262d] hover:bg-[#30363d] text-github-muted hover:text-white border border-github-border transition-colors"
            title="Refresh user list"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          </button>
          <button
            type="button"
            onClick={() => {
              setAddError('');
              setIsAddModalOpen(true);
            }}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold ${theme.primaryBtn} shadow-md transition-all whitespace-nowrap`}
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>Add New User / Guest</span>
          </button>
        </div>
      </div>

      {/* Stats Counter Bar */}
      <div className="grid grid-cols-3 gap-3">
        <div className="p-3 rounded-lg bg-[#0d1117] border border-github-border text-center">
          <div className="text-[11px] text-github-muted">Total Accounts</div>
          <div className="text-base font-bold text-white font-mono mt-0.5">{users.length}</div>
        </div>
        <div className="p-3 rounded-lg bg-[#0d1117] border border-github-border text-center">
          <div className="text-[11px] text-github-muted">Active Sessions</div>
          <div className="text-base font-bold text-emerald-400 font-mono mt-0.5">{activeCount}</div>
        </div>
        <div className="p-3 rounded-lg bg-[#0d1117] border border-github-border text-center">
          <div className="text-[11px] text-github-muted">Guest Accounts</div>
          <div className="text-base font-bold text-blue-400 font-mono mt-0.5">{guestCount}</div>
        </div>
      </div>

      {/* Feedback Banner */}
      {feedback.message && (
        <div
          className={`p-3 rounded-lg text-xs flex items-center justify-between gap-2 animate-in fade-in ${
            feedback.type === 'success'
              ? 'bg-emerald-950/40 border border-emerald-800/40 text-emerald-300'
              : 'bg-red-950/40 border border-red-800/40 text-red-300'
          }`}
        >
          <div className="flex items-center gap-2">
            {feedback.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            ) : (
              <AlertCircle className="w-4 h-4 text-red-400" />
            )}
            <span>{feedback.message}</span>
          </div>
          <button
            type="button"
            onClick={() => setFeedback({ type: '', message: '' })}
            className="p-1 text-github-muted hover:text-white"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* User Accounts List */}
      <div className="space-y-3">
        {users.length === 0 ? (
          <div className="p-8 text-center text-xs text-github-muted bg-[#0d1117] rounded-xl border border-github-border">
            No registered users found. Click &quot;Add New User / Guest&quot; above to create one.
          </div>
        ) : (
          users.map((u) => {
            const isAdmin = u.role === 'admin' || u.username === 'n0vemberain';
            const isActive = u.isActive !== false;

            return (
              <div
                key={u.id || u.username}
                className="p-4 rounded-xl bg-[#0d1117] border border-github-border hover:border-white/20 transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
              >
                {/* User Identity Column */}
                <div className="flex items-center gap-3.5 min-w-0">
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm shadow-md border flex-shrink-0"
                    style={{
                      backgroundColor: isAdmin ? theme.accentDark : '#21262d',
                      borderColor: isAdmin ? theme.accent + '70' : '#30363d',
                      color: isAdmin ? theme.accentLight : '#c9d1d9'
                    }}
                  >
                    {u.avatarUrl ? (
                      <img
                        src={u.avatarUrl}
                        alt={u.name}
                        className="w-full h-full rounded-full object-cover"
                      />
                    ) : (
                      (u.name || u.username || 'U').charAt(0).toUpperCase()
                    )}
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-sm font-bold text-white truncate">{u.name || 'User'}</span>
                      <span className="text-xs font-mono text-github-muted">@{u.username}</span>
                      {isAdmin ? (
                        <span className="text-[10px] px-2 py-0.5 rounded font-mono bg-purple-950/60 text-purple-300 border border-purple-800/40">
                          Admin
                        </span>
                      ) : (
                        <span className="text-[10px] px-2 py-0.5 rounded font-mono bg-blue-950/60 text-blue-300 border border-blue-800/40">
                          Guest Account
                        </span>
                      )}
                      {isActive ? (
                        <span className="text-[10px] px-2 py-0.5 rounded font-mono bg-emerald-950/60 text-emerald-300 border border-emerald-800/40 flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                          Active
                        </span>
                      ) : (
                        <span className="text-[10px] px-2 py-0.5 rounded font-mono bg-red-950/60 text-red-300 border border-red-800/40 flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-red-400"></span>
                          Suspended
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-3 text-[11px] text-github-muted mt-1">
                      <span>{u.fieldOfStudy || 'General Activity'}</span>
                      <span>•</span>
                      <span>Password: <strong className="font-mono text-github-muted">••••••••</strong></span>
                      <span>•</span>
                      <span className="font-mono">v{u.sessionVersion || 1}</span>
                    </div>
                  </div>
                </div>

                {/* Actions Column */}
                <div className="flex items-center gap-2 flex-wrap w-full md:w-auto justify-end border-t md:border-t-0 pt-3 md:pt-0 border-github-border">
                  {/* Edit Credentials */}
                  <button
                    type="button"
                    onClick={() => handleOpenEdit(u)}
                    className="px-2.5 py-1.5 rounded-lg text-xs font-medium bg-[#21262d] hover:bg-[#30363d] text-white border border-github-border flex items-center gap-1.5 transition-colors"
                    title="Change Username or Password"
                  >
                    <KeyRound className="w-3.5 h-3.5 text-amber-400" />
                    <span>Change Credentials</span>
                  </button>

                  {/* Force Logout (Disabled for primary admin) */}
                  {!isAdmin && (
                    <button
                      type="button"
                      onClick={() => handleForceLogout(u)}
                      disabled={actionLoading === `logout-${u.id}`}
                      className="px-2.5 py-1.5 rounded-lg text-xs font-medium bg-[#21262d] hover:bg-amber-950/40 text-amber-300 hover:text-amber-200 border border-github-border hover:border-amber-800/50 flex items-center gap-1.5 transition-colors"
                      title="Terminate active session across all devices"
                    >
                      <LogOut className="w-3.5 h-3.5 text-amber-400" />
                      <span>Force Logout</span>
                    </button>
                  )}

                  {/* Suspend / Activate (Disabled for admin) */}
                  {!isAdmin && (
                    <button
                      type="button"
                      onClick={() => handleToggleStatus(u)}
                      disabled={actionLoading === `toggle-${u.id}`}
                      className={`px-2.5 py-1.5 rounded-lg text-xs font-medium border flex items-center gap-1.5 transition-colors ${
                        isActive
                          ? 'bg-[#21262d] hover:bg-red-950/40 text-red-300 border-github-border hover:border-red-800/50'
                          : 'bg-[#21262d] hover:bg-emerald-950/40 text-emerald-300 border-github-border hover:border-emerald-800/50'
                      }`}
                      title={isActive ? 'Suspend Account' : 'Activate Account'}
                    >
                      <Power className="w-3.5 h-3.5" />
                      <span>{isActive ? 'Suspend' : 'Activate'}</span>
                    </button>
                  )}

                  {/* Delete User (Disabled for admin) */}
                  {!isAdmin && (
                    <button
                      type="button"
                      onClick={() => handleOpenDelete(u)}
                      className="p-1.5 rounded-lg text-xs bg-[#21262d] hover:bg-red-950/60 text-red-400 hover:text-red-200 border border-github-border hover:border-red-800/50 transition-colors"
                      title="Delete user account and isolated tasks"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* MODAL 1: Add New User */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-[#161b22] border border-github-border rounded-xl w-full max-w-md shadow-2xl overflow-hidden flex flex-col">
            <div className="flex items-center justify-between px-5 py-4 border-b border-github-border bg-[#0d1117]">
              <div className="flex items-center gap-2.5">
                <div
                  className="w-8 h-8 rounded-lg border flex items-center justify-center"
                  style={{
                    backgroundColor: theme.accentDark,
                    borderColor: theme.accent + '40',
                    color: theme.accent
                  }}
                >
                  <UserPlus className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">Create New User / Guest Account</h3>
                  <p className="text-[11px] text-github-muted">Data will be isolated to this user</p>
                </div>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1 text-github-muted hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateUser} className="p-5 space-y-4">
              {addError && (
                <div className="p-2.5 rounded-lg bg-red-950/40 border border-red-800/40 text-red-300 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>{addError}</span>
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-github-text uppercase tracking-wider mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={newFullName}
                  onChange={(e) => setNewFullName(e.target.value)}
                  placeholder="e.g. Rahim Khan"
                  className="w-full px-3 py-2 bg-[#0d1117] border border-github-border rounded-lg text-xs text-white placeholder-github-muted outline-none focus:border-white/40"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-github-text uppercase tracking-wider mb-1">
                  Username / Login ID *
                </label>
                <input
                  type="text"
                  required
                  value={newUsername}
                  onChange={(e) => setNewUsername(e.target.value)}
                  placeholder="e.g. rahim_guest"
                  className="w-full px-3 py-2 bg-[#0d1117] border border-github-border rounded-lg text-xs text-white placeholder-github-muted font-mono outline-none focus:border-white/40"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-github-text uppercase tracking-wider mb-1">
                  Initial Password *
                </label>
                <div className="relative">
                  <input
                    type={showNewPassword ? 'text' : 'password'}
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Enter password (min 4 characters)..."
                    className="w-full px-3 py-2 pr-10 bg-[#0d1117] border border-github-border rounded-lg text-xs text-white placeholder-github-muted font-mono outline-none focus:border-white/40"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-github-muted hover:text-white"
                  >
                    {showNewPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-github-text uppercase tracking-wider mb-1">
                    Role
                  </label>
                  <select
                    value={newRole}
                    onChange={(e) => setNewRole(e.target.value)}
                    className="w-full px-3 py-2 bg-[#0d1117] border border-github-border rounded-lg text-xs text-white outline-none"
                  >
                    <option value="guest">Guest (Isolated)</option>
                    <option value="admin">Administrator</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-github-text uppercase tracking-wider mb-1">
                    Field of Study
                  </label>
                  <input
                    type="text"
                    value={newFieldOfStudy}
                    onChange={(e) => setNewFieldOfStudy(e.target.value)}
                    placeholder="e.g. Biology / Web Dev"
                    className="w-full px-3 py-2 bg-[#0d1117] border border-github-border rounded-lg text-xs text-white placeholder-github-muted outline-none"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-github-border">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-lg text-xs font-semibold bg-[#21262d] hover:bg-[#30363d] text-github-muted hover:text-white transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={actionLoading === 'create'}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold ${theme.primaryBtn}`}
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>Create Account</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: Edit User Credentials */}
      {isEditModalOpen && targetUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-[#161b22] border border-github-border rounded-xl w-full max-w-md shadow-2xl overflow-hidden flex flex-col">
            <div className="flex items-center justify-between px-5 py-4 border-b border-github-border bg-[#0d1117]">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-amber-950/50 border border-amber-800/50 flex items-center justify-center text-amber-400">
                  <KeyRound className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">Edit User Credentials</h3>
                  <p className="text-[11px] text-github-muted">Modifying @{targetUser.username}</p>
                </div>
              </div>
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="p-1 text-github-muted hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleUpdateCredentials} className="p-5 space-y-4">
              {editError && (
                <div className="p-2.5 rounded-lg bg-red-950/40 border border-red-800/40 text-red-300 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>{editError}</span>
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-github-text uppercase tracking-wider mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  value={editFullName}
                  onChange={(e) => setEditFullName(e.target.value)}
                  className="w-full px-3 py-2 bg-[#0d1117] border border-github-border rounded-lg text-xs text-white outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-github-text uppercase tracking-wider mb-1">
                  Username / Login ID
                </label>
                <input
                  type="text"
                  required
                  value={editUsername}
                  onChange={(e) => setEditUsername(e.target.value)}
                  className="w-full px-3 py-2 bg-[#0d1117] border border-github-border rounded-lg text-xs text-white font-mono outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-github-text uppercase tracking-wider mb-1">
                  New Password (leave blank to keep current)
                </label>
                <div className="relative">
                  <input
                    type={showEditPassword ? 'text' : 'password'}
                    value={editPassword}
                    onChange={(e) => setEditPassword(e.target.value)}
                    placeholder="Enter new password to change..."
                    className="w-full px-3 py-2 pr-10 bg-[#0d1117] border border-github-border rounded-lg text-xs text-white placeholder-github-muted font-mono outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowEditPassword(!showEditPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-github-muted hover:text-white"
                  >
                    {showEditPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="user-is-active"
                  checked={editIsActive}
                  onChange={(e) => setEditIsActive(e.target.checked)}
                  disabled={targetUser.role === 'admin' || targetUser.username === 'n0vemberain'}
                  className="rounded border-github-border bg-[#0d1117]"
                />
                <label htmlFor="user-is-active" className="text-xs text-white select-none cursor-pointer">
                  Account Active (Uncheck to suspend account)
                </label>
              </div>

              {/* Admin Confirmation Field */}
              <div className="p-3.5 rounded-lg bg-amber-950/20 border border-amber-800/40 space-y-2">
                <label className="block text-xs font-bold text-amber-300">
                  Confirm Administrator Password *
                </label>
                <div className="relative">
                  <input
                    type={showAdminConfirm ? 'text' : 'password'}
                    required
                    value={adminPasswordConfirm}
                    onChange={(e) => setAdminPasswordConfirm(e.target.value)}
                    placeholder="Enter your admin password..."
                    className="w-full px-3 py-2 pr-10 bg-[#0d1117] border border-amber-800/50 rounded-lg text-xs text-white placeholder-github-muted font-mono outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowAdminConfirm(!showAdminConfirm)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-amber-400/80 hover:text-amber-200"
                  >
                    {showAdminConfirm ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>
                <p className="text-[11px] text-github-muted">
                  Required to prevent unauthorized credential alterations.
                </p>
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-github-border">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-4 py-2 rounded-lg text-xs font-semibold bg-[#21262d] hover:bg-[#30363d] text-github-muted hover:text-white transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={actionLoading === `edit-${targetUser.id}`}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold ${theme.primaryBtn}`}
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>Update Credentials</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: Delete User Confirmation */}
      {isDeleteModalOpen && targetUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-[#161b22] border border-red-900/50 rounded-xl w-full max-w-md shadow-2xl overflow-hidden flex flex-col">
            <div className="flex items-center justify-between px-5 py-4 border-b border-github-border bg-red-950/20">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-red-950 border border-red-800 text-red-400 flex items-center justify-center">
                  <Trash2 className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">Delete User Account</h3>
                  <p className="text-[11px] text-red-300">Irreversible Action</p>
                </div>
              </div>
              <button
                onClick={() => setIsDeleteModalOpen(false)}
                className="p-1 text-github-muted hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleDeleteUser} className="p-5 space-y-4">
              <div className="text-xs text-github-muted leading-relaxed">
                You are about to permanently delete <strong className="text-white">@{targetUser.username}</strong> ({targetUser.name}). All isolated tasks, challenges, and timer records belonging to this user will be removed.
              </div>

              {deleteError && (
                <div className="p-2.5 rounded-lg bg-red-950/40 border border-red-800/40 text-red-300 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>{deleteError}</span>
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-github-text uppercase tracking-wider mb-1">
                  Administrator Password *
                </label>
                <input
                  type="password"
                  required
                  value={deleteAdminPassword}
                  onChange={(e) => setDeleteAdminPassword(e.target.value)}
                  placeholder="Enter your admin password to authorize deletion..."
                  className="w-full px-3 py-2 bg-[#0d1117] border border-red-900/40 rounded-lg text-xs text-white placeholder-github-muted font-mono outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-github-border">
                <button
                  type="button"
                  onClick={() => setIsDeleteModalOpen(false)}
                  className="px-4 py-2 rounded-lg text-xs font-semibold bg-[#21262d] hover:bg-[#30363d] text-github-muted hover:text-white transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={actionLoading === `delete-${targetUser.id}`}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold bg-red-600 hover:bg-red-700 text-white transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Delete User Account</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

import React, { useState, useEffect } from 'react';
import { adminService } from '../../services/adminService';
import { Role, User, UserStatus } from '../../types/auth';
import { Pagination } from '../../components/common/Pagination';
import { useToast } from '../../context/ToastContext';
import {
  Users,
  Search,
  Shield,
  ShieldAlert,
  UserCheck,
  UserX,
  Calendar,
} from 'lucide-react';

export const AdminUsersPage: React.FC = () => {
  const { success, error } = useToast();

  const [users, setUsers] = useState<User[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRole, setSelectedRole] = useState<Role | ''>('');
  const [selectedStatus, setSelectedStatus] = useState<UserStatus | ''>('');
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await adminService.searchUsers({
        query: searchQuery.trim() || undefined,
        role: selectedRole || undefined,
        status: selectedStatus || undefined,
        page,
        size: 15,
      });
      setUsers(res.content);
      setTotalPages(res.totalPages);
    } catch (err: any) {
      error(err.message || 'Failed to query users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [selectedRole, selectedStatus, page]);

  const handleToggleStatus = async (user: User) => {
    const newStatus: UserStatus = user.status === 'ACTIVE' ? 'SUSPENDED' : 'ACTIVE';
    try {
      await adminService.updateUserStatus(user.id, newStatus);
      success(`User account status updated to ${newStatus}`);
      fetchUsers();
    } catch (err: any) {
      error(err.message || 'Failed to update account status');
    }
  };

  const handleRoleChange = async (user: User, newRole: Role) => {
    if (user.role === newRole) return;
    try {
      await adminService.updateUserRole(user.id, newRole);
      success(`User ${user.email} assigned role ${newRole}`);
      fetchUsers();
    } catch (err: any) {
      error(err.message || 'Failed to update user role');
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-white tracking-tight">User Account Directory</h1>
        <p className="text-xs text-slate-400 mt-1">
          Review registered profiles, manage operational roles, or toggle account access
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-slate-950 p-4 rounded-3xl border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative flex-1 w-full sm:w-auto">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            placeholder="Search by name or email address..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && fetchUsers()}
            className="w-full pl-10 pr-3 py-2 bg-slate-900 border border-slate-700/80 rounded-xl text-xs font-semibold text-slate-200 placeholder:text-slate-500 focus:outline-hidden"
          />
        </div>

        <div className="flex items-center space-x-2 w-full sm:w-auto">
          <select
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value as Role | '')}
            className="bg-slate-900 border border-slate-700/80 rounded-xl px-3 py-2 text-xs font-bold text-slate-300 focus:outline-hidden"
          >
            <option value="">All Roles</option>
            <option value="ROLE_USER">ROLE_USER (Seeker/Owner)</option>
            <option value="ROLE_AGENT">ROLE_AGENT</option>
            <option value="ROLE_ADMIN">ROLE_ADMIN</option>
          </select>

          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value as UserStatus | '')}
            className="bg-slate-900 border border-slate-700/80 rounded-xl px-3 py-2 text-xs font-bold text-slate-300 focus:outline-hidden"
          >
            <option value="">All Statuses</option>
            <option value="ACTIVE">ACTIVE</option>
            <option value="SUSPENDED">SUSPENDED</option>
          </select>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-slate-950/80 rounded-3xl border border-slate-800 overflow-hidden shadow-xl">
        {loading ? (
          <div className="p-16 text-center">
            <div className="w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
            <p className="text-xs text-slate-500 font-bold">Querying user accounts...</p>
          </div>
        ) : users.length === 0 ? (
          <div className="p-12 text-center text-slate-500 text-sm">No user accounts found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-900 text-slate-400 font-extrabold uppercase tracking-wider border-b border-slate-800">
                <tr>
                  <th className="py-3 px-5">User</th>
                  <th className="py-3 px-4">Role</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Agency / License</th>
                  <th className="py-3 px-4">Registered</th>
                  <th className="py-3 px-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80 text-slate-300">
                {users.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-900/40 transition-colors">
                    <td className="py-4 px-5">
                      <div className="font-bold text-white text-sm">
                        {u.firstName} {u.lastName}
                      </div>
                      <div className="text-slate-400 text-xs">{u.email}</div>
                    </td>

                    <td className="py-4 px-4">
                      <select
                        value={u.role}
                        onChange={(e) => handleRoleChange(u, e.target.value as Role)}
                        className="bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1 text-xs font-bold text-slate-200 focus:outline-hidden"
                      >
                        <option value="ROLE_USER">ROLE_USER</option>
                        <option value="ROLE_AGENT">ROLE_AGENT</option>
                        <option value="ROLE_ADMIN">ROLE_ADMIN</option>
                      </select>
                    </td>

                    <td className="py-4 px-4">
                      <span
                        className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider ${
                          u.status === 'ACTIVE'
                            ? 'bg-emerald-950 text-emerald-400 border border-emerald-800/40'
                            : 'bg-rose-950 text-rose-400 border border-rose-800/40'
                        }`}
                      >
                        {u.status}
                      </span>
                    </td>

                    <td className="py-4 px-4 text-slate-400">
                      {u.agencyName ? (
                        <div>
                          <span className="font-semibold text-slate-200">{u.agencyName}</span>
                          <span className="block text-[10px] text-slate-500">{u.licenseNumber}</span>
                        </div>
                      ) : (
                        <span>—</span>
                      )}
                    </td>

                    <td className="py-4 px-4 text-slate-400">
                      {u.createdAt ? new Date(u.createdAt).toLocaleDateString() : '—'}
                    </td>

                    <td className="py-4 px-5 text-right">
                      <button
                        onClick={() => handleToggleStatus(u)}
                        className={`px-3 py-1.5 rounded-xl font-bold text-xs transition-colors ${
                          u.status === 'ACTIVE'
                            ? 'bg-slate-800 hover:bg-rose-950 text-rose-300'
                            : 'bg-emerald-900 hover:bg-emerald-800 text-emerald-200'
                        }`}
                      >
                        {u.status === 'ACTIVE' ? 'Suspend' : 'Reactivate'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <Pagination
        currentPage={page}
        totalPages={totalPages}
        onPageChange={(p) => setPage(p)}
      />
    </div>
  );
};

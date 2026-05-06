import React, { useState } from 'react';
import { UserPlus, MoreVertical, Trash2, Shield, Filter } from 'lucide-react';
import { cn, User } from '../../constants';

interface UsersTabProps {
  users: User[];
  onAddUser: () => void;
  onDeleteUser: (id: string) => void;
  onUpdateRole: (id: string, role: User['role']) => void;
}

export const UsersTab: React.FC<UsersTabProps> = ({ users, onAddUser, onDeleteUser, onUpdateRole }) => {
  const [roleFilter, setRoleFilter] = useState<string>('All');
  const [activeMenu, setActiveMenu] = useState<string | null>(null);

  const filteredUsers = users.filter(user => 
    roleFilter === 'All' || user.role === roleFilter
  );

  return (
    <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
      <div className="p-6 border-b border-slate-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h3 className="text-xl font-bold text-slate-900">System Users</h3>
          <p className="text-slate-500 text-sm">Manage system access and permissions.</p>
        </div>
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:flex-none">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <select 
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="pl-10 pr-8 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-600 outline-none focus:ring-2 focus:ring-emerald-500/20 appearance-none cursor-pointer w-full"
            >
              <option value="All">All Roles</option>
              <option value="Admin">Admin</option>
              <option value="Manager">Manager</option>
              <option value="Encoder">Encoder</option>
              <option value="Guest">Guest</option>
            </select>
          </div>
          <button 
            onClick={onAddUser}
            className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-xl text-sm font-bold hover:bg-slate-800 transition-colors whitespace-nowrap"
          >
            <UserPlus size={18} />
            Add User
          </button>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-slate-50 text-slate-500 text-xs font-bold uppercase tracking-widest">
              <th className="px-6 py-4">User</th>
              <th className="px-6 py-4">Role</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">Last Active</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredUsers.map((user) => (
              <tr key={user.id} className="hover:bg-slate-50 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 text-sm font-bold">
                      {user.name[0]}
                    </div>
                    <div>
                      <div className="font-bold text-slate-900">{user.name}</div>
                      <div className="text-xs text-slate-500">{user.email}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <Shield size={14} className="text-slate-400" />
                    <span className="text-sm font-medium text-slate-700">{user.role}</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <div className={cn("w-2 h-2 rounded-full", user.status === 'active' ? "bg-emerald-500" : "bg-slate-300")} />
                    <span className="text-sm text-slate-600 capitalize">{user.status}</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-slate-500">{user.lastActive}</td>
                <td className="px-6 py-4 text-right relative">
                  <button 
                    onClick={() => setActiveMenu(activeMenu === user.id ? null : user.id)}
                    className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-all"
                  >
                    <MoreVertical size={18} />
                  </button>

                  {activeMenu === user.id && (
                    <>
                      <div 
                        className="fixed inset-0 z-10" 
                        onClick={() => setActiveMenu(null)}
                      />
                      <div className="absolute right-6 top-12 w-48 bg-white rounded-2xl shadow-xl border border-slate-100 py-2 z-20 animate-in fade-in zoom-in duration-200">
                        <div className="px-4 py-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-50 mb-1">Change Role</div>
                        {(['Admin', 'Manager', 'Encoder', 'Guest'] as User['role'][]).map((role) => (
                          <button
                            key={role}
                            onClick={() => {
                              onUpdateRole(user.id, role);
                              setActiveMenu(null);
                            }}
                            className={cn(
                              "w-full px-4 py-2 text-left text-sm transition-colors flex items-center justify-between",
                              user.role === role ? "text-emerald-600 bg-emerald-50 font-bold" : "text-slate-600 hover:bg-slate-50"
                            )}
                          >
                            {role}
                            {user.role === role && <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />}
                          </button>
                        ))}
                        <div className="h-px bg-slate-100 my-2" />
                        <button
                          onClick={() => {
                            onDeleteUser(user.id);
                            setActiveMenu(null);
                          }}
                          className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 transition-colors flex items-center gap-2"
                        >
                          <Trash2 size={14} />
                          Delete User
                        </button>
                      </div>
                    </>
                  )}
                </td>
              </tr>
            ))}
            {filteredUsers.length === 0 && (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-slate-500 italic">
                  No users found with the selected role.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

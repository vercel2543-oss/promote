import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Users,
  UserPlus,
  Search,
  Filter,
  Shield,
  Edit2,
  Trash2,
  Key,
  CheckCircle2,
  X,
  AlertTriangle,
  Building2,
  Mail,
  Phone,
  Briefcase,
  GraduationCap,
  Sparkles,
  Lock,
  UserCheck,
  Layers,
} from 'lucide-react';
import { User, UserRole, PositionGroup } from '../types';
import { STANDARD_POSITIONS_13 } from '../data/formTemplates';
import { TargetPositionGroupModal } from './TargetPositionGroupModal';

export const UserManagementView: React.FC = () => {
  const {
    users,
    targetPositionGroups,
    addUser,
    updateUser,
    deleteUser,
    resetUserPassword,
    currentUser,
    loginAsUser,
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<'all' | UserRole>('all');
  const [groupFilter, setGroupFilter] = useState<'all' | string>('all');
  const [isTargetModalOpen, setIsTargetModalOpen] = useState(false);

  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [deletingUser, setDeletingUser] = useState<User | null>(null);
  const [resetPasswordUser, setResetPasswordUser] = useState<User | null>(null);
  const [newPasswordValue, setNewPasswordValue] = useState('password123');

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    username: '',
    password: 'password123',
    role: 'staff' as UserRole,
    positionGroup: 'support_staff' as PositionGroup,
    position: 'ลูกจ้างชั่วคราว ตำแหน่งคนงาน',
    department: 'กลุ่มบริหารงานบริการและอาคารสถานที่',
    email: '',
    phone: '',
    employeeCode: '',
  });

  const resetForm = () => {
    setFormData({
      name: '',
      username: '',
      password: 'password123',
      role: 'staff',
      positionGroup: 'support_staff',
      position: 'ลูกจ้างชั่วคราว ตำแหน่งคนงาน',
      department: 'กลุ่มบริหารงานบริการและอาคารสถานที่',
      email: '',
      phone: '',
      employeeCode: '',
    });
  };

  const handleOpenAddModal = () => {
    resetForm();
    setIsAddModalOpen(true);
  };

  const handleOpenEditModal = (user: User) => {
    setEditingUser(user);
    setFormData({
      name: user.name,
      username: user.username || '',
      password: user.password || 'password123',
      role: user.role,
      positionGroup: user.positionGroup || (user.position.includes('ครูผู้ช่วย') ? 'teacher_assistant' : 'support_staff'),
      position: user.position,
      department: user.department,
      email: user.email || '',
      phone: user.phone || '',
      employeeCode: user.employeeCode || '',
    });
  };

  const handleSaveAddUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    addUser({
      name: formData.name,
      username: formData.username || `user_${Date.now().toString(36)}`,
      password: formData.password || 'password123',
      role: formData.role,
      positionGroup: formData.role === 'staff' ? formData.positionGroup : undefined,
      position: formData.position,
      department: formData.department,
      email: formData.email || `${formData.username || 'user'}@school.ac.th`,
      phone: formData.phone,
      employeeCode: formData.employeeCode,
    });

    setIsAddModalOpen(false);
    resetForm();
  };

  const handleSaveEditUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser || !formData.name.trim()) return;

    updateUser({
      ...editingUser,
      name: formData.name,
      username: formData.username,
      password: formData.password,
      role: formData.role,
      positionGroup: formData.role === 'staff' ? formData.positionGroup : undefined,
      position: formData.position,
      department: formData.department,
      email: formData.email,
      phone: formData.phone,
      employeeCode: formData.employeeCode,
    });

    setEditingUser(null);
  };

  const handleConfirmDelete = () => {
    if (deletingUser) {
      deleteUser(deletingUser.id);
      setDeletingUser(null);
    }
  };

  const handleConfirmResetPassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (resetPasswordUser && newPasswordValue) {
      resetUserPassword(resetPasswordUser.id, newPasswordValue);
      setResetPasswordUser(null);
      setNewPasswordValue('password123');
    }
  };

  // Filtered list
  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.position.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (user.username && user.username.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (user.employeeCode && user.employeeCode.toLowerCase().includes(searchQuery.toLowerCase())) ||
      user.department.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    const matchesGroup =
      groupFilter === 'all' ||
      (groupFilter === 'teacher_assistant' && user.position.includes('ครูผู้ช่วย')) ||
      (groupFilter === 'support_staff' && user.role === 'staff' && !user.position.includes('ครูผู้ช่วย'));

    return matchesSearch && matchesRole && matchesGroup;
  });

  const getRoleBadge = (role: UserRole) => {
    switch (role) {
      case 'admin':
        return (
          <span className="inline-flex items-center gap-1 bg-purple-100 text-purple-800 text-xs font-semibold px-2.5 py-1 rounded-full border border-purple-200">
            <Shield className="w-3 h-3 text-purple-600" />
            ผู้บริหาร / Admin
          </span>
        );
      case 'evaluator':
        return (
          <span className="inline-flex items-center gap-1 bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-1 rounded-full border border-blue-200">
            <UserCheck className="w-3 h-3 text-blue-600" />
            คณะกรรมการ
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 bg-emerald-100 text-emerald-800 text-xs font-semibold px-2.5 py-1 rounded-full border border-emerald-200">
            <GraduationCap className="w-3 h-3 text-emerald-600" />
            ผู้รับการประเมิน
          </span>
        );
    }
  };

  return (
    <div className="space-y-6 pb-12">
      
      {/* Top Header Card */}
      <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/80 shadow-xs flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-blue-700 uppercase tracking-wider mb-1">
            <Shield className="w-4 h-4" />
            <span>Admin Management Hub</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
            ระบบจัดการผู้ใช้งานและสิทธิ์ (User & Access Control)
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            จัดการรายชื่อ ชื่อผู้ใช้ รหัสผ่าน บทบาท และตำแหน่งงาน (ครูผู้ช่วย & สายสนับสนุน 12 สายงาน)
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            id="btn-manage-target-groups-user-view"
            onClick={() => setIsTargetModalOpen(true)}
            className="flex items-center justify-center gap-2 px-3.5 py-2.5 bg-slate-100 hover:bg-blue-50 text-slate-700 hover:text-blue-700 rounded-xl font-bold text-xs sm:text-sm border border-slate-200 transition cursor-pointer"
            title="เปลี่ยนชื่อ เพิ่ม ลบ แก้ไข กลุ่มสายงานเป้าหมาย"
          >
            <Layers className="w-4 h-4 text-blue-600" />
            <span>กลุ่มสายงาน ({targetPositionGroups.length})</span>
          </button>

          <button
            type="button"
            onClick={handleOpenAddModal}
            className="flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-xs sm:text-sm shadow-md shadow-blue-600/20 transition cursor-pointer"
          >
            <UserPlus className="w-4 h-4" />
            <span>เพิ่มผู้ใช้งานใหม่</span>
          </button>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs flex flex-col md:flex-row items-center gap-3">
        {/* Search */}
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="ค้นหาชื่อ, นามสกุล, ตำแหน่ง, รหัสผู้ใช้, หรือกลุ่มสาระ..."
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 text-xs sm:text-sm outline-none transition"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs"
            >
              ✕
            </button>
          )}
        </div>

        {/* Role Filter */}
        <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0 scrollbar-none">
          <div className="flex items-center bg-slate-100 p-1 rounded-xl">
            <button
              type="button"
              onClick={() => setRoleFilter('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
                roleFilter === 'all'
                  ? 'bg-white text-slate-900 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              ทั้งหมด ({users.length})
            </button>
            <button
              type="button"
              onClick={() => setRoleFilter('admin')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
                roleFilter === 'admin'
                  ? 'bg-purple-600 text-white shadow-2xs'
                  : 'text-slate-600 hover:text-purple-700'
              }`}
            >
              Admin
            </button>
            <button
              type="button"
              onClick={() => setRoleFilter('evaluator')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
                roleFilter === 'evaluator'
                  ? 'bg-blue-600 text-white shadow-2xs'
                  : 'text-slate-600 hover:text-blue-700'
              }`}
            >
              กรรมการ
            </button>
            <button
              type="button"
              onClick={() => setRoleFilter('staff')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
                roleFilter === 'staff'
                  ? 'bg-emerald-600 text-white shadow-2xs'
                  : 'text-slate-600 hover:text-emerald-700'
              }`}
            >
              ผู้รับการประเมิน
            </button>
          </div>
        </div>
      </div>

      {/* Users Count Summary */}
      <div className="flex items-center justify-between text-xs text-slate-500 px-1">
        <span>
          แสดงผล <strong className="text-slate-800">{filteredUsers.length}</strong> จากทั้งหมด {users.length} บัญชี
        </span>
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-purple-500"></span> Admin ({users.filter(u => u.role === 'admin').length})</span>
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-blue-500"></span> กรรมการ ({users.filter(u => u.role === 'evaluator').length})</span>
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-emerald-500"></span> ผู้รับการประเมิน ({users.filter(u => u.role === 'staff').length})</span>
        </div>
      </div>

      {/* Users Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredUsers.map((user) => {
          const isMe = currentUser.id === user.id;
          return (
            <div
              key={user.id}
              className={`bg-white rounded-2xl p-5 border transition hover:shadow-md flex flex-col justify-between ${
                isMe
                  ? 'border-blue-500 ring-2 ring-blue-500/20 bg-blue-50/10'
                  : 'border-slate-200/80 hover:border-slate-300'
              }`}
            >
              <div>
                {/* Card Top */}
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-11 h-11 rounded-xl flex items-center justify-center font-bold text-base text-white shadow-xs ${
                        user.role === 'admin'
                          ? 'bg-purple-600'
                          : user.role === 'evaluator'
                          ? 'bg-blue-700'
                          : 'bg-emerald-600'
                      }`}
                    >
                      {user.name.charAt(0)}
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <h4 className="text-sm font-bold text-slate-900 leading-snug">
                          {user.name}
                        </h4>
                      </div>
                      <div className="text-[11px] text-slate-500 font-mono">
                        User: <strong className="text-blue-700">{user.username || 'user'}</strong> | รหัส: {user.employeeCode || user.id}
                      </div>
                    </div>
                  </div>
                  {getRoleBadge(user.role)}
                </div>

                {/* Details */}
                <div className="space-y-1.5 text-xs text-slate-600 bg-slate-50/70 p-3 rounded-xl border border-slate-100 mb-4">
                  <div className="flex items-center gap-2 text-slate-800 font-medium">
                    <Briefcase className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="truncate">{user.position}</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-500">
                    <Building2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="truncate">{user.department}</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-500">
                    <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="truncate">{user.email}</span>
                  </div>
                  {user.phone && (
                    <div className="flex items-center gap-2 text-slate-500">
                      <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>{user.phone}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-1 text-xs">
                <button
                  type="button"
                  onClick={() => loginAsUser(user)}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-lg transition cursor-pointer"
                  title="สลับเข้าใช้งานด้วยบัญชีนี้ (Demo Quick Switch)"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                  <span>{isMe ? 'เข้าสู่ระบบอยู่' : 'สลับตัวตน'}</span>
                </button>

                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => setResetPasswordUser(user)}
                    className="p-1.5 text-slate-400 hover:text-amber-700 hover:bg-amber-50 rounded-lg transition cursor-pointer"
                    title="เปลี่ยนรหัสผ่าน"
                  >
                    <Key className="w-4 h-4" />
                  </button>

                  <button
                    type="button"
                    onClick={() => handleOpenEditModal(user)}
                    className="p-1.5 text-slate-400 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition cursor-pointer"
                    title="แก้ไขข้อมูล"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>

                  {user.role !== 'admin' && (
                    <button
                      type="button"
                      onClick={() => setDeletingUser(user)}
                      className="p-1.5 text-slate-400 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition cursor-pointer"
                      title="ลบผู้ใช้งาน"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* MODAL: ADD USER */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center">
                  <UserPlus className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold text-slate-900">เพิ่มผู้ใช้งานใหม่ในระบบ</h3>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveAddUser} className="mt-4 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    ชื่อ - นามสกุล <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="เช่น นายประสิทธิ์ มั่นคง"
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    รหัสผู้ใช้ (Username) <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.username}
                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                    placeholder="เช่น prasit.m"
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    รหัสผ่าน (Password)
                  </label>
                  <input
                    type="password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    placeholder="ค่าเริ่มต้น: password123"
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    รหัสประจำตัวพนักงาน / ลำดับ
                  </label>
                  <input
                    type="text"
                    value={formData.employeeCode}
                    onChange={(e) => setFormData({ ...formData, employeeCode: e.target.value })}
                    placeholder="เช่น S-013, T-004"
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    บทบาทในระบบ (Role) <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value as UserRole })}
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 outline-none bg-white"
                  >
                    <option value="staff">ผู้รับการประเมิน (Staff / Evaluatee)</option>
                    <option value="evaluator">คณะกรรมการประเมิน (Evaluator)</option>
                    <option value="admin">ผู้บริหาร / ผู้ดูแลระบบ (Admin)</option>
                  </select>
                </div>

                {formData.role === 'staff' && (
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      กลุ่มสายงานเป้าหมาย
                    </label>
                    <select
                      value={formData.positionGroup}
                      onChange={(e) => setFormData({ ...formData, positionGroup: e.target.value as PositionGroup })}
                      className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 outline-none bg-white"
                    >
                      {targetPositionGroups.map((tg) => (
                        <option key={tg.id} value={tg.id}>
                          {tg.name}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  ตำแหน่งงาน (Position) <span className="text-rose-500">*</span>
                </label>
                {formData.role === 'staff' ? (
                  <select
                    value={formData.position}
                    onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 outline-none bg-white"
                  >
                    <optgroup label="กลุ่มที่ 1: ครูผู้ช่วย">
                      <option value="ลูกจ้างชั่วคราว ตำแหน่งครูผู้ช่วย">ลูกจ้างชั่วคราว ตำแหน่งครูผู้ช่วย</option>
                    </optgroup>
                    <optgroup label="กลุ่มที่ 2: จ้างเหมาบริการ สายสนับสนุน (12 ตำแหน่ง)">
                      {STANDARD_POSITIONS_13.slice(1).map((pos) => (
                        <option key={pos.code} value={pos.title}>
                          {pos.title}
                        </option>
                      ))}
                    </optgroup>
                  </select>
                ) : (
                  <input
                    type="text"
                    required
                    value={formData.position}
                    onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                    placeholder="เช่น รองผู้อำนวยการสถานศึกษา, กรรมการชุดที่ 1"
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 outline-none"
                  />
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    กลุ่มงาน / กลุ่มสาระ / ฝ่าย
                  </label>
                  <input
                    type="text"
                    value={formData.department}
                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                    placeholder="เช่น กลุ่มบริหารงานทั่วไป"
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    อีเมล (Email)
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="user@school.ac.th"
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 outline-none"
                  />
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 text-xs sm:text-sm font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition cursor-pointer"
                >
                  ยกเลิก
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs sm:text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-md shadow-blue-600/20 transition cursor-pointer"
                >
                  บันทึกผู้ใช้งาน
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: EDIT USER */}
      {editingUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center">
                  <Edit2 className="w-4 h-4" />
                </div>
                <h3 className="text-lg font-bold text-slate-900">แก้ไขข้อมูลผู้ใช้งาน</h3>
              </div>
              <button
                onClick={() => setEditingUser(null)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveEditUser} className="mt-4 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    ชื่อ - นามสกุล
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl focus:border-blue-600 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    ชื่อผู้ใช้ (Username)
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.username}
                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl focus:border-blue-600 outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    บทบาท (Role)
                  </label>
                  <select
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value as UserRole })}
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl focus:border-blue-600 outline-none bg-white"
                  >
                    <option value="staff">ผู้รับการประเมิน</option>
                    <option value="evaluator">คณะกรรมการ</option>
                    <option value="admin">Admin / ผู้บริหาร</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    รหัสประจำตัว
                  </label>
                  <input
                    type="text"
                    value={formData.employeeCode}
                    onChange={(e) => setFormData({ ...formData, employeeCode: e.target.value })}
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl focus:border-blue-600 outline-none"
                  />
                </div>
              </div>

              {formData.role === 'staff' && (
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    กลุ่มสายงานเป้าหมาย
                  </label>
                  <select
                    value={formData.positionGroup}
                    onChange={(e) => setFormData({ ...formData, positionGroup: e.target.value as PositionGroup })}
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl focus:border-blue-600 outline-none bg-white"
                  >
                    {targetPositionGroups.map((tg) => (
                      <option key={tg.id} value={tg.id}>
                        {tg.name}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  ตำแหน่งงาน
                </label>
                <input
                  type="text"
                  required
                  value={formData.position}
                  onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl focus:border-blue-600 outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    กลุ่มงาน / สังกัด
                  </label>
                  <input
                    type="text"
                    value={formData.department}
                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl focus:border-blue-600 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    อีเมล
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl focus:border-blue-600 outline-none"
                  />
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditingUser(null)}
                  className="px-4 py-2 text-xs sm:text-sm font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition cursor-pointer"
                >
                  ยกเลิก
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs sm:text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-md shadow-blue-600/20 transition cursor-pointer"
                >
                  บันทึกการแก้ไข
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: RESET PASSWORD */}
      {resetPasswordUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center gap-3 text-amber-600 mb-3">
              <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center">
                <Key className="w-5 h-5 text-amber-700" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">รีเซ็ตรหัสผ่าน</h3>
                <p className="text-xs text-slate-500">{resetPasswordUser.name}</p>
              </div>
            </div>

            <form onSubmit={handleConfirmResetPassword} className="space-y-4 mt-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  กำหนดรหัสผ่านใหม่
                </label>
                <input
                  type="text"
                  required
                  value={newPasswordValue}
                  onChange={(e) => setNewPasswordValue(e.target.value)}
                  placeholder="เช่น password123 หรือรหัสผ่านใหม่"
                  className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-sm font-mono focus:border-blue-600 outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setResetPasswordUser(null)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl cursor-pointer"
                >
                  ยกเลิก
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-bold text-white bg-amber-600 hover:bg-amber-700 rounded-xl shadow-xs cursor-pointer"
                >
                  ยืนยันเปลี่ยนรหัสผ่าน
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: CONFIRM DELETE USER */}
      {deletingUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center gap-3 text-rose-600 mb-3">
              <div className="w-10 h-10 rounded-xl bg-rose-100 flex items-center justify-center">
                <AlertTriangle className="w-6 h-6 text-rose-600" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">ยืนยันการลบผู้ใช้งาน</h3>
                <p className="text-xs text-slate-500">การดำเนินการนี้ไม่สามารถย้อนกลับได้</p>
              </div>
            </div>

            <p className="text-xs text-slate-600 my-4 bg-slate-50 p-3 rounded-xl border border-slate-100">
              คุณต้องการลบข้อมูลของ <strong className="text-slate-900">{deletingUser.name}</strong> ({deletingUser.position}) ออกจากระบบใช่หรือไม่?
            </p>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setDeletingUser(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl cursor-pointer"
              >
                ยกเลิก
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                className="px-4 py-2 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-xl shadow-xs cursor-pointer"
              >
                ลบผู้ใช้งาน
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Target Position Group Modal */}
      <TargetPositionGroupModal
        isOpen={isTargetModalOpen}
        onClose={() => setIsTargetModalOpen(false)}
      />

    </div>
  );
};

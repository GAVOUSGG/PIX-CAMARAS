import React, { useEffect, useState } from 'react';
import { Users, Clock, Shield, Plus, Edit2, Trash2, X, Save } from 'lucide-react';
import { API_URL } from '../../config';

const AdminPanel = ({ darkMode = true }) => {
  const [history, setHistory] = useState([]);
  const [activeView, setActiveView] = useState('users'); // 'users' or 'history'
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({ username: '', password: '', role: 'user' });

  useEffect(() => {
    fetchUsers();
  }, []);

  const getAuthHeaders = () => {
    const token = sessionStorage.getItem('token');
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    };
  };

  const fetchUsers = async () => {
    try {
      const response = await fetch(`${API_URL}/users`, {
        headers: getAuthHeaders()
      });
      if (response.ok) {
        const data = await response.json();
        setUsers(data);
      } else {
        setError('Error al cargar usuarios');
      }
    } catch (err) {
      setError('Error de conexiÒ³n');
    } finally {
      setLoading(false);
    }
  };

  const fetchHistory = async () => {
    try {
      const response = await fetch(`${API_URL}/login-history`, {
        headers: getAuthHeaders()
      });
      if (response.ok) {
        const data = await response.json();
        setHistory(data);
      }
    } catch (err) {
      console.error('Error fetching history:', err);
    }
  };

  useEffect(() => {
    if (activeView === 'history') {
      fetchHistory();
    }
  }, [activeView]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = editingUser 
        ? `${API_URL}/users/${editingUser.id}`
        : `${API_URL}/users`;
      
      const method = editingUser ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: getAuthHeaders(),
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        setShowModal(false);
        setEditingUser(null);
        setFormData({ username: '', password: '', role: 'user' });
        fetchUsers();
      } else {
        const data = await response.json();
        alert(data.error || 'Error al guardar usuario');
      }
    } catch (err) {
      alert('Error de conexiÒ³n');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('�¿EstÒ¡s seguro de eliminar este usuario?')) return;
    
    try {
      const response = await fetch(`${API_URL}/users/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
      });

      if (response.ok) {
        fetchUsers();
      } else {
        alert('Error al eliminar usuario');
      }
    } catch (err) {
      alert('Error de conexiÒ³n');
    }
  };

  const openModal = (user = null) => {
    if (user) {
      setEditingUser(user);
      setFormData({ username: user.username, password: '', role: user.role });
    } else {
      setEditingUser(null);
      setFormData({ username: '', password: '', role: 'user' });
    }
    setShowModal(true);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-20">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className={`text-xl md:text-2xl font-bold transition-colors duration-500 ${darkMode ? 'text-white' : 'text-zinc-900'}`}>Panel de AdministraciÒ³n</h2>
          <p className="text-sm md:text-base text-zinc-500">GestiÒ³n de usuarios y monitoreo de actividad</p>
        </div>
        <div className="flex flex-wrap gap-2 md:space-x-3">
          <div className={`flex rounded-xl p-1 transition-colors duration-500 ${darkMode ? 'bg-zinc-900 border border-white/5' : 'bg-zinc-100 border border-black/5'}`}>
            <button
              onClick={() => setActiveView('users')}
              className={`px-4 py-1.5 rounded-lg text-sm font-bold transition-all whitespace-nowrap ${
                activeView === 'users' 
                  ? darkMode 
                    ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                    : 'bg-emerald-500 text-white shadow-lg' 
                  : 'text-zinc-500 hover:text-zinc-400'
              }`}
            >
              Usuarios
            </button>
            <button
              onClick={() => setActiveView('history')}
              className={`px-4 py-1.5 rounded-lg text-sm font-bold transition-all whitespace-nowrap ${
                activeView === 'history' 
                  ? darkMode 
                    ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                    : 'bg-emerald-500 text-white shadow-lg' 
                  : 'text-zinc-500 hover:text-zinc-400'
              }`}
            >
              Historial
            </button>
          </div>
          
          {activeView === 'users' && (
            <button 
              onClick={() => openModal()}
              className="flex items-center justify-center px-6 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl transition-all text-sm font-bold shadow-lg shadow-emerald-500/20 group uppercase tracking-widest"
            >
              <Plus className="w-4 h-4 mr-2 transition-transform group-hover:rotate-90" />
              Nuevo Usuario
            </button>
          )}
        </div>
      </div>

      {error && (
        <div className={`border p-4 rounded-xl text-sm font-medium transition-colors ${darkMode ? 'bg-red-500/10 border-red-500/20 text-red-400' : 'bg-red-50 border-red-100 text-red-600'}`}>
          {error}
        </div>
      )}

      <div className={`rounded-3xl border overflow-hidden transition-all duration-500 ${
        darkMode ? 'bg-zinc-950 border-white/5 shadow-2xl' : 'bg-white border-black/5 shadow-xl shadow-zinc-200'
      }`}>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className={`border-b transition-colors duration-500 ${darkMode ? 'bg-white/[0.02] border-white/5' : 'bg-zinc-50 border-zinc-100'}`}>
                {activeView === 'users' ? (
                  <>
                    <th className="px-6 py-4 text-[10px] font-black text-zinc-500 uppercase tracking-widest">Usuario</th>
                    <th className="px-6 py-4 text-[10px] font-black text-zinc-500 uppercase tracking-widest hidden md:table-cell">Rol</th>
                    <th className="px-6 py-4 text-[10px] font-black text-zinc-500 uppercase tracking-widest">Estado</th>
                    <th className="px-6 py-4 text-[10px] font-black text-zinc-500 uppercase tracking-widest hidden sm:table-cell">Òšltimo Acceso</th>
                    <th className="px-6 py-4 text-[10px] font-black text-zinc-500 uppercase tracking-widest text-right">Acciones</th>
                  </>
                ) : (
                  <>
                    <th className="px-6 py-4 text-[10px] font-black text-zinc-500 uppercase tracking-widest">Fecha</th>
                    <th className="px-6 py-4 text-[10px] font-black text-zinc-500 uppercase tracking-widest">Usuario</th>
                    <th className="px-6 py-4 text-[10px] font-black text-zinc-500 uppercase tracking-widest">IP</th>
                    <th className="px-6 py-4 text-[10px] font-black text-zinc-500 uppercase tracking-widest">Resultado</th>
                  </>
                )}
              </tr>
            </thead>
            <tbody className={`divide-y transition-colors duration-500 ${darkMode ? 'divide-white/5' : 'divide-zinc-100'}`}>
              {activeView === 'users' ? (
                users.map((user) => (
                  <tr key={user.id} className={`transition-colors hover:bg-emerald-500/[0.02]`}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className={`h-10 w-10 rounded-xl flex items-center justify-center mr-3 transition-colors duration-500 ${darkMode ? 'bg-white/5' : 'bg-zinc-100'}`}>
                          <UserIcon className={`h-5 w-5 ${darkMode ? 'text-emerald-400' : 'text-emerald-600'}`} />
                        </div>
                        <span className={`text-sm font-bold ${darkMode ? 'text-white' : 'text-zinc-900'}`}>{user.username}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap hidden md:table-cell">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border transition-colors ${
                        user.role === 'admin' 
                          ? 'bg-purple-500/10 text-purple-400 border-purple-500/20' 
                          : 'bg-blue-500/10 text-blue-400 border-blue-500/20'
                      }`}>
                        {user.role === 'admin' && <Shield className="w-3 h-3 mr-1" />}
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {user.lockoutUntil && new Date(user.lockoutUntil) > new Date() ? (
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-red-500/10 text-red-400 border border-red-500/20">
                          Bloqueado
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                          Activo
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-zinc-500 hidden sm:table-cell font-medium">
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-2 opacity-50" />
                        {user.lastLogin ? new Date(user.lastLogin).toLocaleString() : 'Nunca'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end space-x-2">
                        <button 
                          onClick={() => openModal(user)}
                          className={`p-2 rounded-lg transition-colors ${darkMode ? 'text-zinc-400 hover:text-blue-400 hover:bg-blue-500/10' : 'text-zinc-400 hover:text-blue-600 hover:bg-blue-50'}`}
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleDelete(user.id)}
                          className={`p-2 rounded-lg transition-colors ${darkMode ? 'text-zinc-400 hover:text-red-400 hover:bg-red-500/10' : 'text-zinc-400 hover:text-red-600 hover:bg-red-50'}`}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                history.map((attempt) => (
                  <tr key={attempt.id} className={`transition-colors hover:bg-emerald-500/[0.02]`}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-zinc-500">
                      {new Date(attempt.timestamp).toLocaleString()}
                    </td>
                    <td className={`px-6 py-4 whitespace-nowrap text-sm font-bold ${darkMode ? 'text-white' : 'text-zinc-900'}`}>
                      {attempt.username}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-[10px] font-black text-zinc-500 uppercase tracking-widest">
                      {attempt.ip}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {attempt.success ? (
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                          Exitoso
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-red-500/10 text-red-400 border border-red-500/20">
                          Fallido
                        </span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className={`w-full max-w-md p-8 rounded-[2rem] border shadow-2xl transition-all duration-500 ${
            darkMode ? 'bg-zinc-900 border-white/10' : 'bg-white border-black/5'
          }`}>
            <div className="flex justify-between items-center mb-8">
              <h3 className={`text-2xl font-black tracking-tight ${darkMode ? 'text-white' : 'text-zinc-900'}`}>
                {editingUser ? 'Editar' : 'Nuevo'} <span className="text-emerald-500">Usuario</span>
              </h3>
              <button 
                onClick={() => setShowModal(false)}
                className={`p-2 rounded-xl transition-colors ${darkMode ? 'hover:bg-white/5 text-zinc-500 hover:text-white' : 'hover:bg-zinc-100 text-zinc-400 hover:text-zinc-900'}`}
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-1">Identificador de Usuario</label>
                <input
                  type="text"
                  value={formData.username}
                  onChange={(e) => setFormData({...formData, username: e.target.value})}
                  className={`w-full px-4 py-3 rounded-xl border text-sm font-medium outline-none transition-all focus:ring-2 focus:ring-emerald-500/50 ${
                    darkMode ? 'bg-white/5 border-white/10 text-white placeholder-zinc-500' : 'bg-zinc-50 border-zinc-200 text-zinc-900'
                  }`}
                  placeholder="ej. JuanPerez"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-1">
                  ContraseÒ±a {editingUser && '(opcional)'}
                </label>
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                  className={`w-full px-4 py-3 rounded-xl border text-sm font-medium outline-none transition-all focus:ring-2 focus:ring-emerald-500/50 ${
                    darkMode ? 'bg-white/5 border-white/10 text-white placeholder-zinc-500' : 'bg-zinc-50 border-zinc-200 text-zinc-900'
                  }`}
                  placeholder="â��¢â��¢â��¢â��¢â��¢â��¢â��¢â��¢"
                  required={!editingUser}
                  autoComplete="new-password"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-1">Nivel de Acceso</label>
                <select
                  value={formData.role}
                  onChange={(e) => setFormData({...formData, role: e.target.value})}
                  className={`w-full px-4 py-3 rounded-xl border text-sm font-bold outline-none appearance-none transition-all focus:ring-2 focus:ring-emerald-500/50 cursor-pointer ${
                    darkMode ? 'bg-white/5 border-white/10 text-white' : 'bg-zinc-50 border-zinc-200 text-zinc-900'
                  }`}
                >
                  <option value="user" className={darkMode ? 'bg-zinc-900' : 'bg-white'}>Colaborador (Ventas)</option>
                  <option value="admin" className={darkMode ? 'bg-zinc-900' : 'bg-white'}>Administrador (Total)</option>
                </select>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className={`flex-1 px-6 py-3 rounded-xl text-sm font-bold transition-all border ${
                    darkMode ? 'bg-white/5 border-white/10 text-zinc-400 hover:bg-white/10 hover:text-white' : 'bg-zinc-100 border-zinc-200 text-zinc-600 hover:bg-zinc-200'
                  }`}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-[1.5] px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl text-sm font-black uppercase tracking-widest shadow-xl shadow-emerald-500/20 active:scale-95 transition-all flex items-center justify-center space-x-2"
                >
                  <Save className="w-4 h-4" />
                  <span>Guardar</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

const UserIcon = ({ className }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2.5" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

export default AdminPanel;

import React, { useEffect, useState } from 'react';
import { Users, Clock, Shield, Plus, Edit2, Trash2, X, Save } from 'lucide-react';
import { API_URL } from '../../config';

const AdminPanel = () => {
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
    const token = localStorage.getItem('token');
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
      setError('Error de conexión');
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
      alert('Error de conexión');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('¿Estás seguro de eliminar este usuario?')) return;
    
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
      alert('Error de conexión');
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
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl md:text-2xl font-bold text-white">Panel de Administración</h2>
          <p className="text-sm md:text-base text-slate-400">Gestión de usuarios y monitoreo de actividad</p>
        </div>
        <div className="flex flex-wrap gap-2 md:space-x-3">
          <div className="flex bg-slate-800 rounded-lg p-1 mr-0 md:mr-4 w-full md:w-auto overflow-x-auto">
            <button
              onClick={() => setActiveView('users')}
              className={`flex-1 md:flex-none px-3 md:px-4 py-1.5 rounded-md text-sm font-medium transition-all whitespace-nowrap ${
                activeView === 'users' 
                  ? 'bg-emerald-600 text-white shadow-lg' 
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Usuarios
            </button>
            <button
              onClick={() => setActiveView('history')}
              className={`flex-1 md:flex-none px-3 md:px-4 py-1.5 rounded-md text-sm font-medium transition-all whitespace-nowrap ${
                activeView === 'history' 
                  ? 'bg-emerald-600 text-white shadow-lg' 
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Historial
            </button>
            {activeView === 'history' && (
              <button
                onClick={async () => {
                  if (window.confirm('¿Estás seguro de eliminar TODO el historial de cámaras? Esta acción no se puede deshacer.')) {
                     try {
                       const token = localStorage.getItem('token');
                       const response = await fetch(`${API_URL}/camera-history`, {
                         method: 'DELETE',
                         headers: {
                           'Content-Type': 'application/json',
                           'Authorization': `Bearer ${token}`
                         }
                       });

                       if (response.ok) {
                         fetchHistory();
                         alert('Historial eliminado exitosamente');
                       } else {
                         const data = await response.json();
                         alert(data.error || 'Error al eliminar historial');
                       }
                     } catch (error) {
                       console.error(error);
                       alert('Error de conexión al eliminar historial');
                     }
                  }
                }}
                className="ml-2 px-3 md:px-4 py-1.5 rounded-md text-sm font-medium transition-all bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white border border-red-500/20"
              >
                Eliminar Historial
              </button>
            )}
          </div>
          
          {activeView === 'users' && (
            <button 
              onClick={() => openModal()}
              className="flex-1 md:flex-none flex items-center justify-center px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors text-sm font-medium whitespace-nowrap"
            >
              <Plus className="w-4 h-4 mr-2" />
              Crear Usuario
            </button>
          )}
        </div>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {activeView === 'users' ? (
        <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-900/50 border-b border-slate-700">
                  <th className="px-4 py-3 md:px-6 md:py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    Usuario
                  </th>
                  <th className="px-4 py-3 md:px-6 md:py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider hidden md:table-cell">
                    Rol
                  </th>
                  <th className="px-4 py-3 md:px-6 md:py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    Estado
                  </th>
                  <th className="px-4 py-3 md:px-6 md:py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider hidden sm:table-cell">
                    Último Acceso
                  </th>
                  <th className="px-4 py-3 md:px-6 md:py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider text-right">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700">
                {users.map((user) => (
                  <tr key={user.id} className="hover:bg-slate-700/30 transition-colors">
                    <td className="px-4 py-3 md:px-6 md:py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-8 w-8 rounded-full bg-emerald-500/10 flex items-center justify-center mr-3">
                          <UserIcon className="h-4 w-4 text-emerald-500" />
                        </div>
                        <span className="text-sm font-medium text-white">{user.username}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 md:px-6 md:py-4 whitespace-nowrap hidden md:table-cell">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        user.role === 'admin' 
                          ? 'bg-purple-500/10 text-purple-400 border border-purple-500/20' 
                          : 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                      }`}>
                        {user.role === 'admin' ? <Shield className="w-3 h-3 mr-1" /> : null}
                        {user.role}
                      </span>
                    </td>
                    <td className="px-4 py-3 md:px-6 md:py-4 whitespace-nowrap">
                      {user.lockoutUntil && new Date(user.lockoutUntil) > new Date() ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-500/10 text-red-400 border border-red-500/20">
                          Bloqueado
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                          Activo
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 md:px-6 md:py-4 whitespace-nowrap text-sm text-slate-300 hidden sm:table-cell">
                      <div className="flex items-center">
                        <Clock className="h-3 w-3 mr-1.5 text-slate-500" />
                        {user.lastLogin ? new Date(user.lastLogin).toLocaleString() : 'Nunca'}
                      </div>
                    </td>
                    <td className="px-4 py-3 md:px-6 md:py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button 
                        onClick={() => openModal(user)}
                        className="text-blue-400 hover:text-blue-300 mr-3"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleDelete(user.id)}
                        className="text-red-400 hover:text-red-300"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-900/50 border-b border-slate-700">
                  <th className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    Fecha
                  </th>
                  <th className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    Usuario
                  </th>
                  <th className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    IP
                  </th>
                  <th className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    Resultado
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700">
                {history.map((attempt) => (
                  <tr key={attempt.id} className="hover:bg-slate-700/30 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-300">
                      {new Date(attempt.timestamp).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">
                      {attempt.username}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-400">
                      {attempt.ip}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {attempt.success ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                          Exitoso
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-500/10 text-red-400 border border-red-500/20">
                          Fallido
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-slate-800 border border-slate-700 rounded-xl shadow-2xl w-full max-w-md p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-white">
                {editingUser ? 'Editar Usuario' : 'Crear Usuario'}
              </h3>
              <button 
                onClick={() => setShowModal(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">
                  Usuario
                </label>
                <input
                  type="text"
                  value={formData.username}
                  onChange={(e) => setFormData({...formData, username: e.target.value})}
                  className="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">
                  Contraseña {editingUser && '(Dejar en blanco para no cambiar)'}
                </label>
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                  className="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  required={!editingUser}
                  autoComplete="new-password"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">
                  Rol
                </label>
                <select
                  value={formData.role}
                  onChange={(e) => setFormData({...formData, role: e.target.value})}
                  className="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="user">Usuario</option>
                  <option value="admin">Administrador</option>
                </select>
              </div>

              <div className="flex justify-end space-x-3 mt-6">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors flex items-center"
                >
                  <Save className="w-4 h-4 mr-2" />
                  Guardar
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
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

export default AdminPanel;

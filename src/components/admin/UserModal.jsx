import React, { useState, useEffect } from 'react';
import Modal from '../dashboard/Modal';

export default function UserModal({ isOpen, onClose, user, onSave }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'user'
  });
  
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        password: '',
        role: user.role || 'user'
      });
    } else {
      setFormData({ name: '', email: '', password: '', role: 'user' });
    }
  }, [user, isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: null }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email is invalid';
    
    if (!user && !formData.password.trim()) newErrors.password = 'Password is required';
    else if (!user && formData.password.length < 6) newErrors.password = 'Min 6 characters';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsSubmitting(true);
    try {
      const dataToSave = { ...formData, ...((!formData.password && user) ? { password: undefined } : {}) };
      await onSave(dataToSave);
      onClose();
    } catch (error) {
      setErrors({ form: 'Failed to save user' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={user ? 'Edit User' : 'Add New User'}>
      <form onSubmit={handleSubmit}>
        {errors.form && <div className="mb-4 p-2 bg-red-100 text-red-800 rounded">{errors.form}</div>}
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">Name</label>
          <input name="name" type="text" value={formData.name} onChange={handleChange} className={`shadow border rounded w-full py-2 px-3 text-gray-700 ${errors.name ? 'border-red-500' : ''}`} />
          {errors.name && <p className="text-red-500 text-xs italic">{errors.name}</p>}
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">Email</label>
          <input name="email" type="email" value={formData.email} onChange={handleChange} className={`shadow border rounded w-full py-2 px-3 text-gray-700 ${errors.email ? 'border-red-500' : ''}`} />
          {errors.email && <p className="text-red-500 text-xs italic">{errors.email}</p>}
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">Password {user && '(Optional)'}</label>
          <input name="password" type="password" value={formData.password} onChange={handleChange} className={`shadow border rounded w-full py-2 px-3 text-gray-700 ${errors.password ? 'border-red-500' : ''}`} />
          {errors.password && <p className="text-red-500 text-xs italic">{errors.password}</p>}
        </div>
        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-bold mb-2">Role</label>
          <select name="role" value={formData.role} onChange={handleChange} className="shadow border rounded w-full py-2 px-3 text-gray-700">
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>
        </div>
        <div className="flex justify-end gap-2">
          <button type="button" onClick={onClose} className="bg-gray-300 px-4 py-2 rounded">Cancel</button>
          <button type="submit" disabled={isSubmitting} className="bg-blue-500 text-white px-4 py-2 rounded">{isSubmitting ? 'Saving...' : 'Save'}</button>
        </div>
      </form>
    </Modal>
  );
}
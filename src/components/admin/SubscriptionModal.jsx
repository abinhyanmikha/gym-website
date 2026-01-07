import React, { useState, useEffect } from "react";
import Modal from "../dashboard/Modal";

export default function SubscriptionModal({ isOpen, onClose, subscription, onSave }) {
  const [formData, setFormData] = useState({ name: "", price: "", duration: "", includesCardio: false, features: [""] });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (subscription) setFormData({ ...subscription, features: subscription.features?.length ? [...subscription.features] : [""] });
    else setFormData({ name: "", price: "", duration: "", includesCardio: false, features: [""] });
  }, [subscription, isOpen]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: null }));
  };

  const validateForm = () => {
    const errs = {};
    if (!formData.name.trim()) errs.name = "Name required";
    if (!formData.price || isNaN(formData.price)) errs.price = "Valid price required";
    if (!formData.duration || isNaN(formData.duration)) errs.duration = "Valid duration required";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsSubmitting(true);
    try {
      await onSave({ ...formData, price: Number(formData.price), duration: Number(formData.duration), features: formData.features.filter(f => f.trim()) });
      onClose();
    } catch (err) { setErrors({ form: "Failed to save" }); } finally { setIsSubmitting(false); }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={subscription ? "Edit Plan" : "Add Plan"}>
      <form onSubmit={handleSubmit} className="space-y-4">
        {errors.form && <div className="p-2 bg-red-100 text-red-800 rounded">{errors.form}</div>}
        <div>
          <label className="block text-sm font-bold mb-1">Plan Name</label>
          <input name="name" value={formData.name} onChange={handleChange} className={`w-full p-2 border rounded ${errors.name ? "border-red-500" : ""}`} />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-bold mb-1">Price (Rs)</label>
            <input name="price" type="number" value={formData.price} onChange={handleChange} className={`w-full p-2 border rounded ${errors.price ? "border-red-500" : ""}`} />
          </div>
          <div>
            <label className="block text-sm font-bold mb-1">Duration (days)</label>
            <input name="duration" type="number" value={formData.duration} onChange={handleChange} className={`w-full p-2 border rounded ${errors.duration ? "border-red-500" : ""}`} />
          </div>
        </div>
        <label className="flex items-center gap-2 cursor-pointer font-bold text-sm">
          <input name="includesCardio" type="checkbox" checked={formData.includesCardio} onChange={handleChange} className="w-4 h-4" /> Includes Cardio
        </label>
        <div>
          <label className="block text-sm font-bold mb-1">Features</label>
          {formData.features.map((f, i) => (
            <div key={i} className="flex gap-2 mb-2">
              <input value={f} onChange={(e) => {
                const newF = [...formData.features];
                newF[i] = e.target.value;
                setFormData(p => ({ ...p, features: newF }));
              }} className="flex-1 p-2 border rounded" />
              <button type="button" onClick={() => setFormData(p => ({ ...p, features: p.features.filter((_, idx) => idx !== i) }))} className="bg-red-500 text-white px-2 rounded">&times;</button>
            </div>
          ))}
          <button type="button" onClick={() => setFormData(p => ({ ...p, features: [...p.features, ""] }))} className="text-blue-500 text-sm font-bold">+ Add Feature</button>
        </div>
        <div className="flex justify-end gap-2 pt-2">
          <button type="button" onClick={onClose} className="bg-gray-300 px-4 py-2 rounded">Cancel</button>
          <button type="submit" disabled={isSubmitting} className="bg-blue-500 text-white px-4 py-2 rounded">{isSubmitting ? "Saving..." : "Save"}</button>
        </div>
      </form>
    </Modal>
  );
}

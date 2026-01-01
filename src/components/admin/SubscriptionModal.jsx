import React, { useState, useEffect } from "react";

export default function SubscriptionModal({
  isOpen,
  onClose,
  subscription,
  onSave,
}) {
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    duration: "",
    includesCardio: false,
    features: [""],
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (subscription) {
      setFormData({
        name: subscription.name || "",
        price: subscription.price || "",
        duration: subscription.duration || "",
        includesCardio: subscription.includesCardio || false,
        features: subscription.features?.length
          ? [...subscription.features]
          : [""],
      });
    } else {
      // Reset form for new subscription
      setFormData({
        name: "",
        price: "",
        duration: "",
        includesCardio: false,
        features: [""],
      });
    }
  }, [subscription, isOpen]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    // Clear error when field is edited
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: null,
      }));
    }
  };

  const handleFeatureChange = (index, value) => {
    const updatedFeatures = [...formData.features];
    updatedFeatures[index] = value;

    setFormData((prev) => ({
      ...prev,
      features: updatedFeatures,
    }));
  };

  const addFeature = () => {
    setFormData((prev) => ({
      ...prev,
      features: [...prev.features, ""],
    }));
  };

  const removeFeature = (index) => {
    const updatedFeatures = [...formData.features];
    updatedFeatures.splice(index, 1);

    setFormData((prev) => ({
      ...prev,
      features: updatedFeatures.length ? updatedFeatures : [""],
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!formData.price) {
      newErrors.price = "Price is required";
    } else if (isNaN(formData.price) || Number(formData.price) <= 0) {
      newErrors.price = "Price must be a positive number";
    }

    if (!formData.duration) {
      newErrors.duration = "Duration is required";
    } else if (isNaN(formData.duration) || Number(formData.duration) <= 0) {
      newErrors.duration = "Duration must be a positive number";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Filter out empty features
      const filteredFeatures = formData.features.filter(
        (feature) => feature.trim() !== ""
      );

      const dataToSave = {
        ...formData,
        price: Number(formData.price),
        duration: Number(formData.duration),
        features: filteredFeatures,
      };

      await onSave(dataToSave);
      onClose();
    } catch (error) {
      console.error("Error saving subscription:", error);
      setErrors((prev) => ({
        ...prev,
        form: "Failed to save subscription. Please try again.",
      }));
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">
            {subscription
              ? "Edit Subscription Plan"
              : "Add New Subscription Plan"}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            &times;
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          {errors.form && (
            <div className="mb-4 p-2 bg-red-100 text-red-800 rounded">
              {errors.form}
            </div>
          )}

          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="name"
            >
              Plan Name
            </label>
            <input
              id="name"
              name="name"
              type="text"
              value={formData.name}
              onChange={handleChange}
              className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
                errors.name ? "border-red-500" : ""
              }`}
            />
            {errors.name && (
              <p className="text-red-500 text-xs italic">{errors.name}</p>
            )}
          </div>

          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="price"
            >
              Price (Rs)
            </label>
            <input
              id="price"
              name="price"
              type="number"
              step="0.01"
              min="0"
              value={formData.price}
              onChange={handleChange}
              className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
                errors.price ? "border-red-500" : ""
              }`}
            />
            {errors.price && (
              <p className="text-red-500 text-xs italic">{errors.price}</p>
            )}
          </div>

          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="duration"
            >
              Duration (days)
            </label>
            <input
              id="duration"
              name="duration"
              type="number"
              min="1"
              value={formData.duration}
              onChange={handleChange}
              className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
                errors.duration ? "border-red-500" : ""
              }`}
            />
            {errors.duration && (
              <p className="text-red-500 text-xs italic">{errors.duration}</p>
            )}
          </div>

          <div className="mb-4">
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                name="includesCardio"
                type="checkbox"
                checked={formData.includesCardio}
                onChange={handleChange}
                className="form-checkbox h-5 w-5 text-blue-600 rounded focus:ring-blue-500"
              />
              <span className="text-gray-700 text-sm font-bold">
                Includes Cardio Training
              </span>
            </label>
          </div>

          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Features
            </label>
            {formData.features.map((feature, index) => (
              <div key={index} className="flex mb-2">
                <input
                  type="text"
                  value={feature}
                  onChange={(e) => handleFeatureChange(index, e.target.value)}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mr-2"
                  placeholder="Enter feature"
                />
                <button
                  type="button"
                  onClick={() => removeFeature(index)}
                  className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded"
                >
                  &times;
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={addFeature}
              className="mt-2 bg-green-500 hover:bg-green-700 text-white font-bold py-1 px-2 rounded text-sm"
            >
              + Add Feature
            </button>
          </div>

          <div className="flex items-center justify-end">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded mr-2"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              {isSubmitting ? "Saving..." : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

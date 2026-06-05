"use client";

import { useState } from "react";
import { X } from "lucide-react";

interface AddStockModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AddStockModal({ isOpen, onClose }: AddStockModalProps) {
  const [formData, setFormData] = useState({
    itemName: "",
    type: "",
    quantity: "",
    expiryDate: "",
    status: "In Stock"
  });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onClose();
  };

  return (
    <>
      {/* Overlay that excludes sidebar */}
      <div className="fixed inset-0 z-[9999]">
        {/* Sidebar area - no blur */}
        <div className="absolute left-0 top-0 w-64 h-full bg-transparent pointer-events-none"></div>
        
        {/* Main content area - lighter blur */}
        <div className="absolute left-64 top-0 right-0 bottom-0 bg-black bg-opacity-10 backdrop-blur-sm"></div>
        
        {/* Modal container - centered without top space */}
        <div className="absolute left-64 top-0 right-0 bottom-0 flex items-center justify-center p-4">
          <div className="bg-black text-white rounded-lg p-6 w-full max-w-lg relative z-10">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Add New Stock Item</h2>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-white"
              >
                <X size={20} />
              </button>
            </div>

            {/* Subtitle */}
            <p className="text-gray-400 text-sm mb-6">
              Add a new item to the stock inventory.
            </p>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                {/* Item Name */}
                <div>
                  <label className="block text-sm text-gray-300 mb-2">
                    Item Name
                  </label>
                  <input
                    type="text"
                    value={formData.itemName}
                    onChange={(e) => setFormData({ ...formData, itemName: e.target.value })}
                    className="w-full bg-black border border-gray-400 rounded px-3 py-2 text-white text-sm focus:outline-none focus:border-gray-300"
                    placeholder="Enter item name"
                  />
                </div>

                {/* Type */}
                <div>
                  <label className="block text-sm text-gray-300 mb-2">
                    Type
                  </label>
                  <input
                    type="text"
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    className="w-full bg-black border border-gray-400 rounded px-3 py-2 text-white text-sm focus:outline-none focus:border-gray-300"
                    placeholder="Enter type"
                  />
                </div>

                {/* Quantity */}
                <div>
                  <label className="block text-sm text-gray-300 mb-2">
                    Quantity
                  </label>
                  <input
                    type="text"
                    value={formData.quantity}
                    onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                    className="w-full bg-black border border-gray-400 rounded px-3 py-2 text-white text-sm focus:outline-none focus:border-gray-300"
                    placeholder="Enter quantity"
                  />
                </div>

                {/* Expiry Date */}
                <div>
                  <label className="block text-sm text-gray-300 mb-2">
                    Expiry Date
                  </label>
                  <input
                    type="text"
                    value={formData.expiryDate}
                    onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
                    className="w-full bg-black border border-gray-400 rounded px-3 py-2 text-white text-sm focus:outline-none focus:border-gray-300"
                    placeholder="DD-MM-YYYY"
                  />
                </div>
              </div>

              {/* Status */}
              <div>
                <label className="block text-sm text-gray-300 mb-2">
                  Status
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className="w-full bg-black border border-gray-400 rounded px-3 py-2 text-white text-sm focus:outline-none focus:border-gray-300"
                >
                  <option value="In Stock">In Stock</option>
                  <option value="Out of Stock">Out of Stock</option>
                  <option value="Low Stock">Low Stock</option>
                </select>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3 mt-6">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 bg-white text-black rounded text-sm hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-white text-black rounded text-sm hover:bg-gray-100"
                >
                  Add Item
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}

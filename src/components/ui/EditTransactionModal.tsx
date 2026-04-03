"use client";

import { useState } from "react";
import { X } from "lucide-react";

interface EditTransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  transaction?: {
    description: string;
    sourceDestination: string;
    timestamp: string;
    amount: string;
    paymentMethod: string;
  };
}

export function EditTransactionModal({ isOpen, onClose, transaction }: EditTransactionModalProps) {
  const [formData, setFormData] = useState({
    description: transaction?.description || "Term 1 payment",
    sourceDestination: transaction?.sourceDestination || "12090857063",
    timestamp: transaction?.timestamp || "12-06-2025",
    amount: transaction?.amount || "30,000",
    paymentMethod: transaction?.paymentMethod || "Umwarimu Sacco"
  });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onClose();
  };

  return (
    <>
      {/* Overlay that excludes sidebar */}
      <div className="fixed inset-0 z-50">
        {/* Sidebar area - no blur */}
        <div className="absolute left-0 top-0 w-64 h-full bg-transparent pointer-events-none"></div>
        
        {/* Main content area - light blur */}
        <div className="absolute left-64 top-0 right-0 bottom-0 bg-black bg-opacity-20 backdrop-blur-sm"></div>
        
        {/* Modal container - no top space */}
        <div className="absolute left-64 top-0 right-0 bottom-0 flex items-center justify-center">
          <div className="bg-black text-white rounded-lg p-6 w-full max-w-lg mx-4 relative z-10">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Edit Transaction</h2>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-white"
              >
                <X size={20} />
              </button>
            </div>

            {/* Subtitle */}
            <p className="text-gray-400 text-sm mb-6">
              Review and update the transaction information. Some fields may be locked.
            </p>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                {/* Description */}
                <div>
                  <label className="block text-sm text-gray-300 mb-2">
                    Description
                  </label>
                  <input
                    type="text"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full bg-black border border-gray-400 rounded px-3 py-2 text-white text-sm focus:outline-none focus:border-gray-300"
                  />
                </div>

                {/* Source/Destination */}
                <div>
                  <label className="block text-sm text-gray-300 mb-2">
                    Source / Destination
                  </label>
                  <input
                    type="text"
                    value={formData.sourceDestination}
                    onChange={(e) => setFormData({ ...formData, sourceDestination: e.target.value })}
                    className="w-full bg-black border border-gray-400 rounded px-3 py-2 text-white text-sm focus:outline-none focus:border-gray-300"
                  />
                </div>

                {/* Timestamp */}
                <div>
                  <label className="block text-sm text-gray-300 mb-2">
                    Timestamp
                  </label>
                  <input
                    type="text"
                    value={formData.timestamp}
                    onChange={(e) => setFormData({ ...formData, timestamp: e.target.value })}
                    className="w-full bg-black border border-gray-400 rounded px-3 py-2 text-white text-sm focus:outline-none focus:border-gray-300"
                  />
                </div>

                {/* Amount */}
                <div>
                  <label className="block text-sm text-gray-300 mb-2">
                    Amount
                  </label>
                  <input
                    type="text"
                    value={formData.amount}
                    onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                    className="w-full bg-black border border-gray-400 rounded px-3 py-2 text-white text-sm focus:outline-none focus:border-gray-300"
                  />
                </div>
              </div>

              {/* Payment Method */}
              <div>
                <label className="block text-sm text-gray-300 mb-2">
                  Payment Method
                </label>
                <input
                  type="text"
                  value={formData.paymentMethod}
                  onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
                  className="w-full bg-black border border-gray-400 rounded px-3 py-2 text-white text-sm focus:outline-none focus:border-gray-300"
                />
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
                  type="button"
                  className="px-4 py-2 bg-white text-black rounded text-sm hover:bg-gray-100"
                >
                  Edit
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-white text-black rounded text-sm hover:bg-gray-100"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
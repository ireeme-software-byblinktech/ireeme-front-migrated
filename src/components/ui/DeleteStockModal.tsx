"use client";

import { X, AlertTriangle } from "lucide-react";

interface DeleteStockModalProps {
  isOpen: boolean;
  onClose: () => void;
  stockItem?: {
    itemName: string;
    type: string;
    quantity: string;
    expiryDate: string;
    status: string;
  };
}

export function DeleteStockModal({ isOpen, onClose, stockItem }: DeleteStockModalProps) {
  if (!isOpen || !stockItem) return null;

  const handleDelete = () => {
    // Handle delete logic here
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
          <div className="bg-black text-white rounded-lg p-6 w-full max-w-md relative z-10">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-red-600 rounded-full flex items-center justify-center">
                  <AlertTriangle size={20} className="text-white" />
                </div>
                <h2 className="text-lg font-semibold">Delete Stock Item</h2>
              </div>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-white"
              >
                <X size={20} />
              </button>
            </div>

            {/* Content */}
            <div className="mb-6">
              <p className="text-gray-300 mb-4">
                Are you sure you want to delete this stock item? This action cannot be undone.
              </p>
              
              <div className="bg-gray-800 rounded-lg p-4 border border-gray-600">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Item Name:</span>
                    <span className="text-white">{stockItem.itemName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Type:</span>
                    <span className="text-white">{stockItem.type}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Quantity:</span>
                    <span className="text-white">{stockItem.quantity}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Status:</span>
                    <span className="bg-black text-white px-2 py-1 rounded text-xs">
                      {stockItem.status}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 bg-white text-black rounded text-sm hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDelete}
                className="px-4 py-2 bg-red-600 text-white rounded text-sm hover:bg-red-700"
              >
                Delete Item
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

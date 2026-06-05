"use client";

import { X } from "lucide-react";

interface ViewStockModalProps {
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

export function ViewStockModal({ isOpen, onClose, stockItem }: ViewStockModalProps) {
  if (!isOpen || !stockItem) return null;

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
              <h2 className="text-lg font-semibold">View Stock Item: {stockItem.itemName}</h2>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-white"
              >
                <X size={20} />
              </button>
            </div>

            {/* Subtitle */}
            <p className="text-gray-400 text-sm mb-6">
              View detailed information about this stock item.
            </p>

            {/* Content */}
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                {/* Item Name */}
                <div>
                  <label className="block text-sm text-gray-300 mb-2">
                    Item Name
                  </label>
                  <div className="w-full bg-gray-800 border border-gray-600 rounded px-3 py-2 text-white text-sm">
                    {stockItem.itemName}
                  </div>
                </div>

                {/* Type */}
                <div>
                  <label className="block text-sm text-gray-300 mb-2">
                    Type
                  </label>
                  <div className="w-full bg-gray-800 border border-gray-600 rounded px-3 py-2 text-white text-sm">
                    {stockItem.type}
                  </div>
                </div>

                {/* Quantity */}
                <div>
                  <label className="block text-sm text-gray-300 mb-2">
                    Quantity
                  </label>
                  <div className="w-full bg-gray-800 border border-gray-600 rounded px-3 py-2 text-white text-sm">
                    {stockItem.quantity}
                  </div>
                </div>

                {/* Expiry Date */}
                <div>
                  <label className="block text-sm text-gray-300 mb-2">
                    Expiry Date
                  </label>
                  <div className="w-full bg-gray-800 border border-gray-600 rounded px-3 py-2 text-white text-sm">
                    {stockItem.expiryDate}
                  </div>
                </div>
              </div>

              {/* Status */}
              <div>
                <label className="block text-sm text-gray-300 mb-2">
                  Status
                </label>
                <div className="w-full bg-gray-800 border border-gray-600 rounded px-3 py-2 text-white text-sm">
                  <span className="bg-black text-white px-3 py-1 rounded text-xs">
                    {stockItem.status}
                  </span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-end gap-3 mt-6">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 bg-white text-black rounded text-sm hover:bg-gray-100"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

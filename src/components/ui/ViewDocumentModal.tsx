"use client";

import { X, Download, Eye } from "lucide-react";

interface ViewDocumentModalProps {
  isOpen: boolean;
  onClose: () => void;
  document?: {
    name: string;
    category: string;
    fileType: string;
    uploadDate: string;
    status: string;
  };
}

export function ViewDocumentModal({ isOpen, onClose, document }: ViewDocumentModalProps) {
  if (!isOpen || !document) return null;

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
              <h2 className="text-lg font-semibold">View Document: {document.name}</h2>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-white"
              >
                <X size={20} />
              </button>
            </div>

            {/* Subtitle */}
            <p className="text-gray-400 text-sm mb-6">
              View detailed information about this document.
            </p>

            {/* Content */}
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                {/* Document Name */}
                <div>
                  <label className="block text-sm text-gray-300 mb-2">
                    Document Name
                  </label>
                  <div className="w-full bg-gray-800 border border-gray-600 rounded px-3 py-2 text-white text-sm">
                    {document.name}
                  </div>
                </div>

                {/* Category */}
                <div>
                  <label className="block text-sm text-gray-300 mb-2">
                    Category
                  </label>
                  <div className="w-full bg-gray-800 border border-gray-600 rounded px-3 py-2 text-white text-sm">
                    {document.category}
                  </div>
                </div>

                {/* File Type */}
                <div>
                  <label className="block text-sm text-gray-300 mb-2">
                    File Type
                  </label>
                  <div className="w-full bg-gray-800 border border-gray-600 rounded px-3 py-2 text-white text-sm">
                    {document.fileType}
                  </div>
                </div>

                {/* Upload Date */}
                <div>
                  <label className="block text-sm text-gray-300 mb-2">
                    Upload Date
                  </label>
                  <div className="w-full bg-gray-800 border border-gray-600 rounded px-3 py-2 text-white text-sm">
                    {document.uploadDate}
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
                    {document.status}
                  </span>
                </div>
              </div>

              {/* Document Preview */}
              <div>
                <label className="block text-sm text-gray-300 mb-2">
                  Document Preview
                </label>
                <div className="w-full bg-gray-800 border border-gray-600 rounded p-4 text-center">
                  <div className="w-16 h-20 bg-gray-700 rounded mx-auto mb-3 flex items-center justify-center">
                    <Eye size={24} className="text-gray-400" />
                  </div>
                  <p className="text-gray-400 text-sm">
                    {document.name}.{document.fileType.toLowerCase()}
                  </p>
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
              <button
                type="button"
                className="px-4 py-2 bg-white text-black rounded text-sm hover:bg-gray-100 flex items-center gap-2"
              >
                <Download size={16} />
                Download
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
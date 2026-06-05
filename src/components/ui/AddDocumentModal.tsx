"use client";

import { useState } from "react";
import { X, Upload } from "lucide-react";

interface AddDocumentModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AddDocumentModal({ isOpen, onClose }: AddDocumentModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    category: "Certificate",
    fileType: "PDF",
    uploadDate: "",
    status: "Private"
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
              <h2 className="text-lg font-semibold">Upload New Document</h2>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-white"
              >
                <X size={20} />
              </button>
            </div>

            {/* Subtitle */}
            <p className="text-gray-400 text-sm mb-6">
              Upload a new document to the system.
            </p>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* File Upload Area */}
              <div>
                <label className="block text-sm text-gray-300 mb-2">
                  Document File
                </label>
                <div className="w-full border-2 border-dashed border-gray-400 rounded-lg p-6 text-center">
                  <Upload size={32} className="mx-auto text-gray-400 mb-2" />
                  <p className="text-gray-400 text-sm mb-2">
                    Drag and drop your file here, or click to browse
                  </p>
                  <input
                    type="file"
                    className="hidden"
                    accept=".pdf,.doc,.docx,.jpg,.png"
                  />
                  <button
                    type="button"
                    className="px-4 py-2 bg-gray-700 text-white rounded text-sm hover:bg-gray-600"
                  >
                    Choose File
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {/* Document Name */}
                <div>
                  <label className="block text-sm text-gray-300 mb-2">
                    Document Name
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-black border border-gray-400 rounded px-3 py-2 text-white text-sm focus:outline-none focus:border-gray-300"
                    placeholder="Enter document name"
                  />
                </div>

                {/* Category */}
                <div>
                  <label className="block text-sm text-gray-300 mb-2">
                    Category
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full bg-black border border-gray-400 rounded px-3 py-2 text-white text-sm focus:outline-none focus:border-gray-300"
                  >
                    <option value="Certificate">Certificate</option>
                    <option value="Medical record">Medical record</option>
                    <option value="Academic">Academic</option>
                    <option value="Financial">Financial</option>
                  </select>
                </div>

                {/* File Type */}
                <div>
                  <label className="block text-sm text-gray-300 mb-2">
                    File Type
                  </label>
                  <select
                    value={formData.fileType}
                    onChange={(e) => setFormData({ ...formData, fileType: e.target.value })}
                    className="w-full bg-black border border-gray-400 rounded px-3 py-2 text-white text-sm focus:outline-none focus:border-gray-300"
                  >
                    <option value="PDF">PDF</option>
                    <option value="DOC">DOC</option>
                    <option value="DOCX">DOCX</option>
                    <option value="JPG">JPG</option>
                    <option value="PNG">PNG</option>
                  </select>
                </div>

                {/* Upload Date */}
                <div>
                  <label className="block text-sm text-gray-300 mb-2">
                    Upload Date
                  </label>
                  <input
                    type="text"
                    value={formData.uploadDate}
                    onChange={(e) => setFormData({ ...formData, uploadDate: e.target.value })}
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
                  <option value="Private">Private</option>
                  <option value="Public">Public</option>
                  <option value="Shared">Shared</option>
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
                  Upload Document
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}

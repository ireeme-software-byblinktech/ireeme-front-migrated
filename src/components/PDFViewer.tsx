'use client';

import { Download, X, Loader } from 'lucide-react';
import { useState, useEffect } from 'react';

interface PDFViewerProps {
  fileUrl: string;
  fileName: string;
}

export default function PDFViewer({ fileUrl, fileName }: PDFViewerProps) {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [iframeKey, setIframeKey] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  // Handle iframe load error - retry or show download option
  const handleIframeError = () => {
    console.error('[PDFViewer] Failed to load PDF via iframe, URL:', fileUrl);
    setError('Failed to load PDF in viewer. Use download button instead.');
    setIsLoading(false);
  };

  // Handle iframe load success
  const handleIframeLoad = () => {
    setIsLoading(false);
  };

  // Retry loading the iframe
  const handleRetry = () => {
    setError(null);
    setIsLoading(true);
    setIframeKey(prev => prev + 1);
  };

  return (
    <>
      {/* Normal View */}
      {!isFullscreen && (
        <div className="w-full bg-white rounded-lg border border-gray-200 overflow-hidden">
          {/* Toolbar */}
          <div className="bg-gray-50 border-b border-gray-200 px-4 py-3 flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700 truncate">{fileName}</span>
            <div className="flex items-center gap-2">
              <a
                href={fileUrl}
                download={fileName}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
              >
                <Download size={16} />
                Download
              </a>
              <button
                onClick={() => setIsFullscreen(true)}
                className="px-3 py-2 text-sm font-medium text-gray-700 bg-white hover:bg-gray-100 border border-gray-300 rounded-lg transition-colors"
              >
                View
              </button>
            </div>
          </div>

          {/* PDF Display */}
          <div className="w-full h-[600px] bg-gray-100 flex items-center justify-center">
            {error ? (
              <div className="text-center p-6 bg-white rounded-lg">
                <p className="text-red-600 font-medium mb-4">{error}</p>
                <div className="flex gap-3">
                  <button
                    onClick={handleRetry}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                  >
                    Retry
                  </button>
                  <a
                    href={fileUrl}
                    download={fileName}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Download size={16} />
                    Download
                  </a>
                </div>
              </div>
            ) : isLoading ? (
              <div className="flex flex-col items-center gap-3">
                <Loader size={40} className="text-blue-600 animate-spin" />
                <p className="text-gray-600 font-medium">Loading PDF...</p>
              </div>
            ) : (
              <iframe
                key={iframeKey}
                src={fileUrl}
                className="w-full h-full border-0"
                title="PDF Viewer"
                onError={handleIframeError}
                onLoad={handleIframeLoad}
              />
            )}
          </div>
        </div>
      )}

      {/* Fullscreen Modal */}
      {isFullscreen && (
        <div className="fixed inset-0 bg-black z-50 flex flex-col">
          {/* Header */}
          <div className="bg-gray-900 border-b border-gray-700 px-4 py-3 flex items-center justify-between">
            <span className="text-sm font-medium text-white truncate flex-1">{fileName}</span>
            <div className="flex items-center gap-3">
              <a
                href={fileUrl}
                download={fileName}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
              >
                <Download size={16} />
                Download
              </a>
              <button
                onClick={() => setIsFullscreen(false)}
                className="p-2 hover:bg-gray-800 rounded-lg transition-colors text-white"
              >
                <X size={24} />
              </button>
            </div>
          </div>

          {/* PDF Display */}
          <div className="flex-1 w-full bg-gray-100 flex items-center justify-center">
            {error ? (
              <div className="text-center p-6 bg-white rounded-lg">
                <p className="text-red-600 font-medium mb-4">{error}</p>
                <div className="flex gap-3">
                  <button
                    onClick={handleRetry}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                  >
                    Retry
                  </button>
                  <a
                    href={fileUrl}
                    download={fileName}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Download size={16} />
                    Download
                  </a>
                </div>
              </div>
            ) : isLoading ? (
              <div className="flex flex-col items-center gap-3">
                <Loader size={48} className="text-blue-600 animate-spin" />
                <p className="text-gray-600 font-medium">Loading PDF...</p>
              </div>
            ) : (
              <iframe
                key={iframeKey}
                src={fileUrl}
                className="w-full h-full border-0"
                title="PDF Viewer Fullscreen"
                allow="fullscreen"
                onError={handleIframeError}
                onLoad={handleIframeLoad}
              />
            )}
          </div>
        </div>
      )}
    </>
  );
}


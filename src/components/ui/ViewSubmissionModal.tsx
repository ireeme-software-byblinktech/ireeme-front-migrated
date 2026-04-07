import { Modal } from "@/components/ui/Modal";
import { FileText, Calendar, User, Clock, CheckCircle2, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface ViewSubmissionModalProps {
  isOpen: boolean;
  onClose: () => void;
  submission: {
    id: string;
    title: string;
    subject: string;
    teacher: string;
    submittedDate: string;
    status: string;
    grade?: string;
    comments?: string;
    fileUrl?: string;
    fileName?: string;
    fileSize?: string;
  } | null;
}

export function ViewSubmissionModal({ isOpen, onClose, submission }: ViewSubmissionModalProps) {
  if (!submission) return null;

  const isGraded = !!submission.grade;

  return (
    <Modal
      open={isOpen}
      onClose={onClose}
      title="Submission details"
      size="md"
      className="p-0 overflow-hidden"
    >
      <div className="space-y-6">
        {/* Header Header */}
        <div className="flex items-center gap-4 bg-gray-50/50 p-4 rounded-xl border border-gray-100">
          <div className="w-12 h-12 bg-black rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg shadow-black/10">
            <FileText size={24} className="text-white" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900 leading-tight">{submission.title}</h3>
            <p className="text-sm text-gray-500 font-medium">{submission.subject}</p>
          </div>
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5 p-3 rounded-xl border border-gray-100 bg-white">
            <div className="flex items-center gap-2 text-gray-400">
              <User size={14} />
              <span className="text-[11px] font-bold uppercase tracking-wider">Teacher</span>
            </div>
            <p className="text-sm font-semibold text-gray-900">{submission.teacher}</p>
          </div>
          <div className="space-y-1.5 p-3 rounded-xl border border-gray-100 bg-white">
            <div className="flex items-center gap-2 text-gray-400">
              <Calendar size={14} />
              <span className="text-[11px] font-bold uppercase tracking-wider">Submitted Date</span>
            </div>
            <p className="text-sm font-semibold text-gray-900">{submission.submittedDate}</p>
          </div>
        </div>

        {/* Status and Grade */}
        <div className="flex items-center justify-between p-4 rounded-xl border border-gray-100 bg-black text-white px-6 py-5">
          <div className="space-y-1">
            <div className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Submission Status</div>
            <div className="flex items-center gap-2">
              <CheckCircle2 size={16} className="text-emerald-400" />
              <span className="text-sm font-bold uppercase tracking-wide">{submission.status}</span>
            </div>
          </div>
          {isGraded ? (
            <div className="text-right">
              <div className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Final Grade</div>
              <div className="text-2xl font-black text-white">{submission.grade}</div>
            </div>
          ) : (
            <div className="flex items-center gap-2 bg-white/10 px-3 py-1.5 rounded-lg border border-white/10">
              <Clock size={16} className="text-gray-300" />
              <span className="text-xs font-bold text-gray-300">AWAITING REVIEW</span>
            </div>
          )}
        </div>

        {/* Files */}
        {submission.fileName && (
          <div className="space-y-3">
            <h4 className="text-[11px] font-bold text-gray-400 uppercase tracking-widest ml-1">Submitted Files</h4>
            <div className="group flex items-center justify-between p-3.5 rounded-xl border border-gray-200 bg-white hover:border-black transition-all cursor-pointer">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gray-50 rounded-lg flex items-center justify-center text-gray-400 group-hover:bg-black group-hover:text-white transition-colors">
                  <FileText size={20} />
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-900">{submission.fileName}</p>
                  <p className="text-xs text-gray-500 font-medium">{submission.fileSize || "2.4 MB"}</p>
                </div>
              </div>
              <button className="text-xs font-bold text-black bg-gray-100 px-3 py-1.5 rounded-lg group-hover:bg-black group-hover:text-white transition-all">
                DOWNLOAD
              </button>
            </div>
          </div>
        )}

        {/* Comments */}
        {submission.comments && (
          <div className="space-y-3">
            <h4 className="text-[11px] font-bold text-gray-400 uppercase tracking-widest ml-1">Teacher Feedback</h4>
            <div className="p-4 rounded-xl border border-gray-100 bg-gray-50/50 relative overflow-hidden">
               <div className="absolute top-0 left-0 w-1 h-full bg-black"></div>
               <p className="text-sm text-gray-700 leading-relaxed italic font-medium">"{submission.comments}"</p>
            </div>
          </div>
        )}
      </div>

      <div className="mt-8 flex justify-end">
        <button 
          onClick={onClose}
          className="w-full bg-black text-white py-4 rounded-xl text-sm font-bold hover:bg-gray-800 transition-all shadow-xl shadow-black/10 active:scale-[0.98]"
        >
          CLOSE PORTAL
        </button>
      </div>
    </Modal>
  );
}

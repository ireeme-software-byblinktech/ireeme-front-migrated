import React from "react";
import { Modal } from "@/components/ui/Modal";
import { FormData, Question, Subject, AssignmentVariant } from "./types";
import { Plus, X, Bold, Italic, Underline, AlignLeft, AlignCenter, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface EditAssignmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  formData: FormData;
  formErrors: Record<string, string>;
  subjects: Subject[];
  assignmentVariant: AssignmentVariant;
  questions: Question[];
  isSubmitting: boolean;
  onFormChange: (data: Partial<FormData>) => void;
  onVariantChange: (variant: AssignmentVariant) => void;
  onAddQuestion: () => void;
  onRemoveQuestion: (questionId: string) => void;
  onUpdateQuestionText: (questionId: string, text: string) => void;
  onUpdateQuestionOption: (questionId: string, optionId: string, value: string) => void;
  onSetCorrectOption: (questionId: string, optionId: string) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export const EditAssignmentModal: React.FC<EditAssignmentModalProps> = ({
  isOpen,
  onClose,
  formData,
  formErrors,
  subjects,
  assignmentVariant,
  questions,
  isSubmitting,
  onFormChange,
  onVariantChange,
  onAddQuestion,
  onRemoveQuestion,
  onUpdateQuestionText,
  onUpdateQuestionOption,
  onSetCorrectOption,
  onSubmit,
}) => {
  return (
    <Modal
      open={isOpen}
      onClose={onClose}
      title="Edit Assignment"
      className="modal--premium"
      size="lg"
    >
      <form onSubmit={onSubmit} className="space-y-6">
        {/* Error Alert */}
        {formErrors.submit && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
            <AlertCircle size={20} className="text-red-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-red-900 text-sm">{formErrors.submit}</p>
            </div>
          </div>
        )}

        {/* Title and Type Row */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-bold text-gray-900 mb-2">Assignment Title *</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => onFormChange({ title: e.target.value })}
              placeholder="e.g., Chapter 5 Review Questions"
              className={cn(
                "w-full px-4 py-2.5 rounded-lg border-2 transition-colors text-sm",
                formErrors.title
                  ? "border-red-300 bg-red-50 focus:border-red-500"
                  : "border-gray-200 bg-white focus:border-black focus:outline-none"
              )}
            />
            {formErrors.title && <p className="text-red-600 text-xs mt-1">{formErrors.title}</p>}
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-900 mb-2">Type</label>
            <select
              value={formData.type}
              onChange={(e) => onFormChange({ type: e.target.value })}
              className="w-full px-4 py-2.5 rounded-lg border-2 border-gray-200 bg-white focus:border-black focus:outline-none text-sm appearance-none"
            >
              <option value="HOMEWORK">Homework</option>
              <option value="CAT">CAT (Continuous Assessment)</option>
              <option value="EXAM">Exam</option>
              <option value="PROJECT">Project</option>
              <option value="QUIZ">Quiz</option>
            </select>
          </div>
        </div>

        {/* Subject and Max Score Row */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-bold text-gray-900 mb-2">Subject *</label>
            <select
              value={formData.subjectId}
              onChange={(e) => onFormChange({ subjectId: e.target.value })}
              className={cn(
                "w-full px-4 py-2.5 rounded-lg border-2 transition-colors text-sm appearance-none",
                formErrors.subjectId
                  ? "border-red-300 bg-red-50 focus:border-red-500"
                  : "border-gray-200 bg-white focus:border-black focus:outline-none"
              )}
            >
              <option value="">Select a subject...</option>
              {subjects.map((subject) => (
                <option key={subject.id} value={subject.id}>
                  {subject.name}
                </option>
              ))}
            </select>
            {formErrors.subjectId && <p className="text-red-600 text-xs mt-1">{formErrors.subjectId}</p>}
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-900 mb-2">Max Score</label>
            <input
              type="number"
              value={formData.maxScore}
              onChange={(e) => onFormChange({ maxScore: parseInt(e.target.value) || 0 })}
              placeholder="100"
              className={cn(
                "w-full px-4 py-2.5 rounded-lg border-2 transition-colors text-sm",
                formErrors.maxScore
                  ? "border-red-300 bg-red-50 focus:border-red-500"
                  : "border-gray-200 bg-white focus:border-black focus:outline-none"
              )}
            />
            {formErrors.maxScore && <p className="text-red-600 text-xs mt-1">{formErrors.maxScore}</p>}
          </div>
        </div>

        {/* Due Date and Allow Late Row */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-bold text-gray-900 mb-2">Due Date *</label>
            <input
              type="datetime-local"
              value={formData.dueAt}
              onChange={(e) => onFormChange({ dueAt: e.target.value })}
              className={cn(
                "w-full px-4 py-2.5 rounded-lg border-2 transition-colors text-sm",
                formErrors.dueAt
                  ? "border-red-300 bg-red-50 focus:border-red-500"
                  : "border-gray-200 bg-white focus:border-black focus:outline-none"
              )}
            />
            {formErrors.dueAt && <p className="text-red-600 text-xs mt-1">{formErrors.dueAt}</p>}
          </div>
          <div className="flex items-end">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.allowLate}
                onChange={(e) => onFormChange({ allowLate: e.target.checked })}
                className="w-5 h-5 rounded border-2 border-gray-300 cursor-pointer"
              />
              <span className="text-sm font-medium text-gray-700">Allow Late Submissions</span>
            </label>
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-bold text-gray-900 mb-2">Description</label>
          <textarea
            value={formData.description}
            onChange={(e) => onFormChange({ description: e.target.value })}
            placeholder="Add assignment details, instructions, or requirements..."
            rows={4}
            className="w-full px-4 py-2.5 rounded-lg border-2 border-gray-200 bg-white focus:border-black focus:outline-none text-sm resize-none"
          />
        </div>

        {/* Assignment Type Toggle */}
        <div>
          <label className="block text-sm font-bold text-gray-900 mb-3">Question Format</label>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => onVariantChange("MCQ")}
              className={cn(
                "flex-1 py-2.5 px-4 rounded-lg font-semibold text-sm transition-all",
                assignmentVariant === "MCQ"
                  ? "bg-black text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              )}
            >
              Multiple Choice (MCQ)
            </button>
            <button
              type="button"
              onClick={() => onVariantChange("Open-Ended")}
              className={cn(
                "flex-1 py-2.5 px-4 rounded-lg font-semibold text-sm transition-all",
                assignmentVariant === "Open-Ended"
                  ? "bg-black text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              )}
            >
              Open-Ended
            </button>
          </div>
        </div>

        {/* Question Section */}
        <QuestionSection
          variant={assignmentVariant}
          questions={questions}
          onAddQuestion={onAddQuestion}
          onRemoveQuestion={onRemoveQuestion}
          onUpdateQuestionText={onUpdateQuestionText}
          onUpdateQuestionOption={onUpdateQuestionOption}
          onSetCorrectOption={onSetCorrectOption}
        />

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2.5 rounded-lg border-2 border-gray-300 text-gray-700 font-semibold text-sm hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-2.5 rounded-lg bg-black text-white font-semibold text-sm hover:opacity-90 disabled:opacity-50 transition-opacity flex items-center gap-2"
          >
            {isSubmitting ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Updating...
              </>
            ) : (
              <>
                <Plus size={16} />
                Update Assignment
              </>
            )}
          </button>
        </div>
      </form>
    </Modal>
  );
};

interface QuestionSectionProps {
  variant: AssignmentVariant;
  questions: Question[];
  onAddQuestion: () => void;
  onRemoveQuestion: (questionId: string) => void;
  onUpdateQuestionText: (questionId: string, text: string) => void;
  onUpdateQuestionOption: (questionId: string, optionId: string, value: string) => void;
  onSetCorrectOption: (questionId: string, optionId: string) => void;
}

const QuestionSection: React.FC<QuestionSectionProps> = ({
  variant,
  questions,
  onAddQuestion,
  onRemoveQuestion,
  onUpdateQuestionText,
  onUpdateQuestionOption,
  onSetCorrectOption,
}) => {
  return (
    <div className="bg-gray-50 rounded-lg p-6 space-y-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-gray-900">Add Questions</h3>
        <button
          type="button"
          onClick={onAddQuestion}
          className="flex items-center gap-2 px-3 py-1.5 bg-black text-white rounded-lg text-sm font-semibold hover:opacity-90 transition-opacity"
        >
          <Plus size={14} /> Add Question
        </button>
      </div>

      {questions.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <p className="mb-4">No questions added yet</p>
          <button
            type="button"
            onClick={onAddQuestion}
            className="inline-flex items-center gap-2 px-4 py-2 bg-black text-white rounded-lg text-sm font-semibold hover:opacity-90"
          >
            <Plus size={16} /> Add First Question
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {questions.map((question, qIdx) => (
            <div key={question.id} className="bg-white rounded-lg p-4 border-2 border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-semibold text-gray-900">Question {qIdx + 1}</h4>
                <button
                  type="button"
                  onClick={() => onRemoveQuestion(question.id)}
                  className="text-red-600 hover:text-red-700 text-sm font-semibold flex items-center gap-1"
                >
                  <X size={14} /> Remove
                </button>
              </div>

              {variant === "MCQ" ? (
                <MCQQuestion
                  question={question}
                  questionId={question.id}
                  onUpdateText={onUpdateQuestionText}
                  onUpdateOption={onUpdateQuestionOption}
                  onSetCorrectOption={onSetCorrectOption}
                />
              ) : (
                <OpenEndedQuestion
                  question={question}
                  questionId={question.id}
                  onUpdateText={onUpdateQuestionText}
                />
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

interface MCQQuestionProps {
  question: Question;
  questionId: string;
  onUpdateText: (questionId: string, text: string) => void;
  onUpdateOption: (questionId: string, optionId: string, value: string) => void;
  onSetCorrectOption: (questionId: string, optionId: string) => void;
}

const MCQQuestion: React.FC<MCQQuestionProps> = ({
  question,
  questionId,
  onUpdateText,
  onUpdateOption,
  onSetCorrectOption,
}) => {
  return (
    <>
      <div className="mb-4">
        <label className="block text-sm font-semibold text-gray-700 mb-2">Question Text</label>
        <input
          type="text"
          value={question.text}
          onChange={(e) => onUpdateText(questionId, e.target.value)}
          placeholder="Enter your question..."
          className="w-full px-4 py-2.5 rounded-lg border-2 border-gray-200 bg-white focus:border-black focus:outline-none text-sm"
        />
      </div>

      <div className="space-y-3">
        {question.options?.map((opt) => (
          <div key={opt.id} className="flex items-center gap-3">
            <div
              className="flex-1 flex items-center gap-3 px-4 py-2.5 rounded-lg border-2 border-gray-200 bg-white hover:border-gray-300 cursor-pointer transition-colors"
              onClick={() => onSetCorrectOption(questionId, opt.id)}
            >
              <div className="w-5 h-5 rounded-full border-2 border-gray-400 flex items-center justify-center flex-shrink-0">
                {opt.isCorrect && <div className="w-2.5 h-2.5 rounded-full bg-black" />}
              </div>
              <input
                type="text"
                placeholder={`Option ${opt.id}`}
                value={opt.value}
                onChange={(e) => onUpdateOption(questionId, opt.id, e.target.value)}
                className="flex-1 bg-transparent outline-none text-sm"
              />
            </div>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={opt.isCorrect}
                onChange={() => onSetCorrectOption(questionId, opt.id)}
                className="w-4 h-4 rounded border-2 border-gray-300"
              />
              <span className="text-xs font-medium text-gray-600">Correct</span>
            </label>
          </div>
        ))}
      </div>
    </>
  );
};

interface OpenEndedQuestionProps {
  question: Question;
  questionId: string;
  onUpdateText: (questionId: string, text: string) => void;
}

const OpenEndedQuestion: React.FC<OpenEndedQuestionProps> = ({
  question,
  questionId,
  onUpdateText,
}) => {
  return (
    <>
      <label className="block text-sm font-semibold text-gray-700 mb-2">Question Text</label>
      <div className="border-2 border-gray-200 rounded-lg overflow-hidden bg-white">
        <div className="flex items-center gap-2 px-4 py-3 border-b-2 border-gray-200 bg-gray-50">
          <Bold size={18} className="cursor-pointer hover:text-black text-gray-600" />
          <Italic size={18} className="cursor-pointer hover:text-black text-gray-600" />
          <Underline size={18} className="cursor-pointer hover:text-black text-gray-600" />
          <div className="w-px h-6 bg-gray-300"></div>
          <AlignLeft size={18} className="cursor-pointer hover:text-black text-gray-600" />
          <AlignCenter size={18} className="cursor-pointer hover:text-black text-gray-600" />
        </div>
        <textarea
          value={question.text}
          onChange={(e) => onUpdateText(questionId, e.target.value)}
          placeholder="Enter your question..."
          rows={4}
          className="w-full p-4 outline-none text-sm resize-none"
        />
      </div>
    </>
  );
};

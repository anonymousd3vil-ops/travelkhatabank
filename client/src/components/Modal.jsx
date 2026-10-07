import { FiX, FiLayers } from 'react-icons/fi';

export default function Modal({ title, onClose, children }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-slate-950/50 p-3 backdrop-blur-sm sm:p-5"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose?.();
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title || 'Dialog'}
        className="rise relative my-auto flex max-h-[90dvh] w-full max-w-lg flex-col overflow-hidden rounded-3xl border border-white/70 bg-white shadow-2xl shadow-slate-950/20"
      >
        {/* Header */}
        <div className="flex shrink-0 items-center justify-between gap-4 border-b border-slate-100 bg-white px-5 py-4 sm:px-6">
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-teal-50 text-teal-700">
              <FiLayers size={19} />
            </div>

            <h2 className="min-w-0 break-words text-base font-bold tracking-tight text-slate-900 sm:text-lg">
              {title}
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close dialog"
            title="Close"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2"
          >
            <FiX size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="min-h-0 overflow-y-auto overflow-x-hidden overscroll-contain p-5 sm:p-6">
          {children}
        </div>
      </div>
    </div>
  );
}
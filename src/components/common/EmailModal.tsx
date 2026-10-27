import React, { useState } from 'react';
import {
  Mail,
  X,
  Send,
  Check,
  Copy,
  AlertCircle,
  ExternalLink,
  Loader2,
  CheckCircle2,
  RotateCcw
} from 'lucide-react';

interface EmailModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultRecipient?: string;
}

export const EmailModal: React.FC<EmailModalProps> = ({
  isOpen,
  onClose,
  defaultRecipient = 'tctlts9@gmail.com',
}) => {
  const [recipient] = useState<string>(defaultRecipient);
  const [senderEmail, setSenderEmail] = useState<string>('');
  const [subject, setSubject] = useState<string>('Inquiry / Feedback regarding XAUUSD Trading');
  const [content, setContent] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isSent, setIsSent] = useState<boolean>(false);
  const [isCopied, setIsCopied] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  if (!isOpen) return null;

  const subjectPresets = [
    'Feedback & Suggestion',
    'XAUUSD Trading Inquiry',
    'Prop Firm Feature Request',
    'Partnership / Collaboration',
  ];

  const validateForm = (): boolean => {
    if (!senderEmail.trim()) {
      setError('Please enter your email address (Your Email).');
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(senderEmail.trim())) {
      setError('Please enter a valid email address (e.g. name@example.com).');
      return false;
    }
    if (!subject.trim()) {
      setError('Please enter an email subject.');
      return false;
    }
    if (!content.trim()) {
      setError('Please enter your message content.');
      return false;
    }
    setError('');
    return true;
  };

  const getFullBodyText = () => {
    return `Sender: ${senderEmail}\nPlatform: XAUUSD Trading Hub\n\nMessage:\n${content}`;
  };

  const getGmailUrl = () => {
    const fullBody = getFullBodyText();
    return `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(recipient)}&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(fullBody)}`;
  };

  // Primary submit: launches Gmail web composer directly (NO Outlook / mailto)
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setError('');
    setIsSubmitting(true);

    const fullBody = getFullBodyText();
    const gmailUrl = getGmailUrl();

    // 1. Open Gmail directly in new tab (synchronous user gesture)
    try {
      window.open(gmailUrl, '_blank', 'noopener,noreferrer');
    } catch (err) {
      console.warn('Could not open Gmail window directly', err);
    }

    // 2. Dispatch non-blocking background backup to FormSubmit API
    try {
      fetch(`https://formsubmit.co/ajax/${encodeURIComponent(recipient)}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          name: senderEmail,
          email: senderEmail,
          _replyto: senderEmail,
          _subject: `[XAUUSD Hub] ${subject}`,
          message: fullBody,
        }),
      }).catch(() => {});
    } catch {
      // Ignore background network error
    }

    // 3. Switch immediately to confirmation screen
    setIsSubmitting(false);
    setIsSent(true);
  };

  const handleCopy = () => {
    const fullText = `To: ${recipient}\nFrom: ${senderEmail}\nSubject: ${subject}\n\n${content}`;
    navigator.clipboard.writeText(fullText);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleResetForm = () => {
    setIsSent(false);
    setError('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl relative text-left max-h-[92vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-sky-500/15 border border-sky-500/30 flex items-center justify-center text-sky-400 shadow-lg shadow-sky-500/10 shrink-0">
            <Mail className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">Send Email via Gmail</h3>
            <p className="text-xs text-slate-400">Direct message to administrator at {recipient}</p>
          </div>
        </div>

        {/* Confirmation & Success View */}
        {isSent ? (
          <div className="my-6 space-y-4 animate-in fade-in zoom-in-95 duration-200">
            <div className="p-5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-center space-y-2">
              <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto shadow-md shadow-emerald-500/10">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h4 className="font-bold text-white text-base">
                Gmail Composer Ready!
              </h4>
              <p className="text-xs text-slate-300 max-w-sm mx-auto leading-relaxed">
                Your email draft has been prepared for <span className="text-sky-300 font-mono font-semibold">{recipient}</span>.
                Click the button below to review and send in Gmail:
              </p>
            </div>

            {/* Email Summary Details */}
            <div className="p-3.5 rounded-lg bg-slate-950 border border-slate-800 text-xs space-y-1.5 font-mono">
              <div className="flex justify-between text-slate-400">
                <span>To:</span>
                <span className="text-sky-300 font-semibold">{recipient}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>From:</span>
                <span className="text-slate-200">{senderEmail}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Subject:</span>
                <span className="text-slate-200 truncate max-w-[240px]">{subject}</span>
              </div>
              <div className="pt-2 border-t border-slate-800 text-slate-400">
                <span className="block mb-1 font-semibold text-slate-300">Message Content:</span>
                <p className="font-sans text-slate-200 bg-slate-900/80 p-2 rounded border border-slate-800 whitespace-pre-wrap max-h-24 overflow-y-auto">
                  {content}
                </p>
              </div>
            </div>

            {/* Direct Gmail Launch Action */}
            <div className="space-y-3 pt-1">
              <a
                href={getGmailUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2 px-4 py-3 text-sm font-bold rounded-xl bg-gradient-to-r from-sky-400 via-sky-500 to-blue-600 hover:from-sky-300 hover:to-blue-500 text-slate-950 shadow-lg shadow-sky-500/20 transition-all cursor-pointer active:scale-98"
              >
                <Mail className="w-4 h-4 text-slate-950" />
                <span>Open in Gmail (mail.google.com)</span>
                <ExternalLink className="w-4 h-4 opacity-80" />
              </a>

              <div className="flex items-center justify-between pt-2 border-t border-slate-800/80">
                <button
                  type="button"
                  onClick={handleCopy}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors cursor-pointer"
                >
                  {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-slate-400" />}
                  <span>{isCopied ? 'Copied!' : 'Copy Draft Text'}</span>
                </button>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleResetForm}
                    className="flex items-center gap-1 text-xs text-slate-400 hover:text-slate-200 cursor-pointer py-1 px-2"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Edit message</span>
                  </button>

                  <button
                    type="button"
                    onClick={onClose}
                    className="px-4 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 font-bold text-xs cursor-pointer transition-colors"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* Form View */
          <form onSubmit={handleSubmit} className="mt-5 space-y-3.5 text-xs">
            {error && (
              <div className="p-2.5 rounded-lg bg-rose-500/15 border border-rose-500/30 text-rose-300 flex items-center gap-2 animate-in fade-in">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Recipient Email (To) */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-slate-300 font-semibold block">
                  Recipient Email (To)
                </label>
                <span className="text-[10px] text-sky-400 bg-sky-500/10 border border-sky-500/20 px-2 py-0.5 rounded font-mono">
                  Official Contact
                </span>
              </div>
              <input
                type="email"
                value={recipient}
                readOnly
                className="w-full bg-slate-950/80 border border-slate-700/80 rounded-lg px-3 py-2 text-sky-300 font-mono focus:outline-none cursor-default select-all"
                placeholder="recipient@example.com"
              />
            </div>

            {/* Sender Email (From) */}
            <div>
              <label className="text-slate-300 font-semibold block mb-1">
                Your Email (From) <span className="text-rose-400">*</span>
              </label>
              <input
                type="email"
                value={senderEmail}
                onChange={(e) => setSenderEmail(e.target.value)}
                required
                className="w-full bg-slate-950 border border-slate-700/80 rounded-lg px-3 py-2 text-white font-mono focus:outline-none focus:border-sky-400 focus:ring-1 focus:ring-sky-400 transition-colors"
                placeholder="your.email@gmail.com"
              />
            </div>

            {/* Subject */}
            <div>
              <label className="text-slate-300 font-semibold block mb-1">
                Subject <span className="text-rose-400">*</span>
              </label>
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                required
                className="w-full bg-slate-950 border border-slate-700/80 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-sky-400 focus:ring-1 focus:ring-sky-400 transition-colors"
                placeholder="Enter subject here..."
              />

              {/* Subject Presets */}
              <div className="flex flex-wrap gap-1.5 mt-1.5">
                {subjectPresets.map((preset) => (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => setSubject(preset)}
                    className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition-colors cursor-pointer"
                  >
                    + {preset}
                  </button>
                ))}
              </div>
            </div>

            {/* Message Content */}
            <div>
              <label className="text-slate-300 font-semibold block mb-1">
                Message Content <span className="text-rose-400">*</span>
              </label>
              <textarea
                rows={4}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                required
                className="w-full bg-slate-950 border border-slate-700/80 rounded-lg p-3 text-white focus:outline-none focus:border-sky-400 focus:ring-1 focus:ring-sky-400 transition-colors resize-none leading-relaxed"
                placeholder="Type your message, questions, or comments here..."
              />
            </div>

            {/* Gmail Dispatch Info Badge (Eliminated Outlook) */}
            <div className="flex items-center justify-between text-[11px] text-slate-400 bg-slate-950/70 p-2.5 rounded-lg border border-slate-800/80">
              <span className="flex items-center gap-2 text-slate-300">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>Sends directly via Google Gmail (Web)</span>
              </span>
              <span className="text-[10px] text-sky-400 bg-sky-500/10 px-2 py-0.5 rounded font-medium border border-sky-500/20">
                No Outlook
              </span>
            </div>

            {/* Modal Actions */}
            <div className="pt-2 border-t border-slate-800 flex flex-wrap items-center justify-between gap-2.5">
              <button
                type="button"
                onClick={handleCopy}
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer text-xs"
                title="Copy entire email draft to clipboard"
              >
                {isCopied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-400">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-slate-400" />
                    <span>Copy Draft</span>
                  </>
                )}
              </button>

              <div className="flex items-center gap-2">
                {/* Primary Send via Gmail Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex items-center gap-2 px-5 py-2.5 text-xs font-bold text-slate-950 bg-gradient-to-r from-sky-400 to-blue-500 hover:from-sky-300 hover:to-blue-400 disabled:opacity-60 rounded-lg shadow-md shadow-sky-500/20 transition-all cursor-pointer active:scale-95"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Opening Gmail...</span>
                    </>
                  ) : (
                    <>
                      <Mail className="w-4 h-4 text-slate-950" />
                      <span>Send via Gmail</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

'use client';

import { useState, useEffect } from 'react';
import styles from './FeedbackModal.module.css';

const FEEDBACK_TYPES = [
  'UI/UX', 'Performance', 'Bug Report',
  'Feature Request', 'Call Quality', 'Other',
];

const STORAGE_KEY = 'hintro_feedback_list';

export function saveFeedback(entry) {
  try {
    const existing = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    existing.unshift(entry);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(existing));
  } catch (e) {
    console.error('Failed to save feedback', e);
  }
}

export function loadFeedback() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
  } catch {
    return [];
  }
}

export default function FeedbackModal({ isOpen, onClose }) {
  const [rating,   setRating]   = useState(0);
  const [hovered,  setHovered]  = useState(0);
  const [type,     setType]     = useState('');
  const [message,  setMessage]  = useState('');
  const [submitted, setSubmitted] = useState(false);

  // Reset form on open
  useEffect(() => {
    if (isOpen) {
      setRating(0);
      setHovered(0);
      setType('');
      setMessage('');
      setSubmitted(false);
    }
  }, [isOpen]);

  // Escape key
  useEffect(() => {
    if (!isOpen) return;
    const handler = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [isOpen, onClose]);

  // Body scroll lock
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  if (!isOpen) return null;

  const canSubmit = rating > 0 && message.trim().length > 0;

  const handleSubmit = () => {
    if (!canSubmit) return;
    const entry = {
      id:        Date.now(),
      rating,
      type:      type || 'General',
      message:   message.trim(),
      createdAt: new Date().toISOString(),
    };
    saveFeedback(entry);
    setSubmitted(true);
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>

        {submitted ? (
          /* ─── Success state ─── */
          <div className={styles.success}>
            <div className={styles.successIcon}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
            <p className={styles.successTitle}>Thanks for your feedback!</p>
            <p className={styles.successDesc}>Your response has been saved and helps us improve Hintro.</p>
            <button className={styles.successBtn} onClick={onClose}>Done</button>
          </div>
        ) : (
          <>
            {/* ─── Header ─── */}
            <div className={styles.header}>
              <div className={styles.headerText}>
                <h2>Share your feedback</h2>
                <p>Help us make Hintro better for you</p>
              </div>
              <button className={styles.closeBtn} onClick={onClose}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6"  y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>

            {/* ─── Star rating ─── */}
            <div className={styles.ratingSection}>
              <p className={styles.ratingLabel}>How would you rate your experience?</p>
              <div className={styles.stars}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    className={`${styles.star} ${star <= (hovered || rating) ? styles.filled : styles.empty}`}
                    onMouseEnter={() => setHovered(star)}
                    onMouseLeave={() => setHovered(0)}
                    onClick={() => setRating(star)}
                    aria-label={`Rate ${star} star${star > 1 ? 's' : ''}`}
                  >
                    <svg viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                    </svg>
                  </button>
                ))}
              </div>
            </div>

            {/* ─── Feedback type ─── */}
            <div className={styles.typeSection}>
              <p className={styles.typeLabel}>Category (optional)</p>
              <div className={styles.typePills}>
                {FEEDBACK_TYPES.map((t) => (
                  <button
                    key={t}
                    className={`${styles.pill} ${type === t ? styles.selected : ''}`}
                    onClick={() => setType(type === t ? '' : t)}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            {/* ─── Message ─── */}
            <div className={styles.textSection}>
              <p className={styles.textLabel}>Your feedback</p>
              <textarea
                className={styles.textarea}
                placeholder="Tell us what you think — what's working well or what could be improved..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                maxLength={500}
              />
            </div>

            {/* ─── Actions ─── */}
            <div className={styles.actions}>
              <button className={styles.cancelBtn} onClick={onClose}>Cancel</button>
              <button
                className={styles.submitBtn}
                onClick={handleSubmit}
                disabled={!canSubmit}
              >
                Submit Feedback
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
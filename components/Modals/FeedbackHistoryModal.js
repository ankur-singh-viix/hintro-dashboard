'use client';

import { useState, useEffect } from 'react';
import { loadFeedback }        from './FeedbackModal';
import styles                  from './FeedbackHistoryModal.module.css';

const STORAGE_KEY = 'hintro_feedback_list';

function StarDisplay({ rating }) {
  return (
    <div className={styles.entryStars}>
      {[1, 2, 3, 4, 5].map((s) => (
        <svg key={s} viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polygon
            className={s <= rating ? styles.filled : styles.empty}
            points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"
          />
        </svg>
      ))}
    </div>
  );
}

export default function FeedbackHistoryModal({ isOpen, onClose }) {
  const [entries, setEntries] = useState([]);

  useEffect(() => {
    if (isOpen) setEntries(loadFeedback());
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const handler = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [isOpen, onClose]);

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleClear = () => {
    localStorage.removeItem(STORAGE_KEY);
    setEntries([]);
  };

  const formatDate = (iso) => {
    return new Date(iso).toLocaleDateString('en-US', {
      month: 'short', day: 'numeric', year: 'numeric',
      hour: 'numeric', minute: '2-digit', hour12: true,
    });
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h2>Feedback History</h2>
          <button className={styles.closeBtn} onClick={onClose}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6"  y2="18" />
              <line x1="6"  y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <div className={styles.list}>
          {entries.length === 0 ? (
            <div className={styles.empty}>
              <div className={styles.emptyIcon}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                </svg>
              </div>
              <p className={styles.emptyTitle}>No feedback yet</p>
              <p className={styles.emptyDesc}>Feedback you submit will appear here.</p>
            </div>
          ) : (
            entries.map((entry) => (
              <div key={entry.id} className={styles.entry}>
                <div className={styles.entryTop}>
                  <StarDisplay rating={entry.rating} />
                  <div className={styles.entryMeta}>
                    {entry.type && (
                      <span className={styles.entryType}>{entry.type}</span>
                    )}
                    <span className={styles.entryDate}>{formatDate(entry.createdAt)}</span>
                  </div>
                </div>
                <p className={styles.entryMessage}>{entry.message}</p>
              </div>
            ))
          )}
        </div>

        {entries.length > 0 && (
          <div className={styles.modalFooter}>
            <button className={styles.clearBtn} onClick={handleClear}>
              Clear all feedback
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
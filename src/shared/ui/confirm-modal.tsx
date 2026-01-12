import { FlexColumn, FlexRow } from '@jigoooo/shared-ui';
import { AnimatePresence, motion } from 'framer-motion';

type ConfirmModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: 'default' | 'danger';
};

export function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmLabel = '확인',
  cancelLabel = '취소',
  variant = 'default',
}: ConfirmModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              width: '100vw',
              height: '100vh',
              backgroundColor: 'rgba(0, 0, 0, 0.6)',
              backdropFilter: 'blur(4px)',
              zIndex: 200,
            }}
          />
          {/* Modal Container for Centering */}
          <div
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              width: '100vw',
              height: '100vh',
              zIndex: 201,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              pointerEvents: 'none',
            }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              style={{
                width: '90%',
                maxWidth: '51.2rem',
                backgroundColor: '#1a1a1a',
                borderRadius: '3.2rem',
                padding: '3.84rem',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                display: 'flex',
                flexDirection: 'column',
                gap: '3.2rem',
                boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
                pointerEvents: 'auto',
              }}
            >
              <FlexColumn style={{ gap: '1.28rem', alignItems: 'center' }}>
                <h2 style={{ fontSize: '2.88rem', fontWeight: 700, color: '#fff', margin: 0 }}>
                  {title}
                </h2>
                <p
                  style={{
                    fontSize: '2.4rem',
                    color: '#888',
                    margin: 0,
                    textAlign: 'center',
                    whiteSpace: 'pre-wrap',
                  }}
                >
                  {description}
                </p>
              </FlexColumn>

              <FlexRow style={{ gap: '1.6rem' }}>
                <button
                  onClick={onClose}
                  style={{
                    flex: 1,
                    padding: '1.92rem',
                    borderRadius: '1.92rem',
                    backgroundColor: '#333',
                    color: '#fff',
                    fontSize: '2.4rem',
                    fontWeight: 600,
                    border: 'none',
                    cursor: 'pointer',
                  }}
                >
                  {cancelLabel}
                </button>
                <button
                  onClick={onConfirm}
                  style={{
                    flex: 1,
                    padding: '1.92rem',
                    borderRadius: '1.92rem',
                    backgroundColor: variant === 'danger' ? '#ff6b6b' : '#fff',
                    color: variant === 'danger' ? '#fff' : '#000',
                    fontSize: '2.4rem',
                    fontWeight: 600,
                    border: 'none',
                    cursor: 'pointer',
                  }}
                >
                  {confirmLabel}
                </button>
              </FlexRow>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}

import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';

const Modal = (props) => { 
  const { 
    isOpen, 
    onClose, 
    onConfirm, 
    title, 
    message, 
    type = 'info',
    size = 'md',
    showCancel = true 
  } = props;
  
  const confirmText = props.confirmText || 'Confirm';
  const cancelText = props.cancelText || 'Cancel';
  
  const modalRef = useRef(null);
  const confirmButtonRef = useRef(null);
  
  useEffect(() => {
    if (isOpen && confirmButtonRef.current) {
      setTimeout(() => confirmButtonRef.current.focus(), 100);
    }
  }, [isOpen]);
  
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    
    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      
      setTimeout(() => {
        if (modalRef.current) {
          const viewportHeight = window.innerHeight;
          const modalHeight = modalRef.current.offsetHeight;
          const modalRect = modalRef.current.getBoundingClientRect();
          
          if (modalRect.top < 20 || modalRect.bottom > viewportHeight - 20) {
            window.scrollTo({
              top: window.pageYOffset + modalRect.top - (viewportHeight - modalHeight) / 2,
              behavior: 'auto'
            });
          }
        }
      }, 50);
    } else {
      document.body.style.overflow = 'auto';
    }
    
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const getModalStyles = () => {
    switch (type) {
      case 'danger':
        return {
          header: 'bg-red-600',
          button: 'bg-red-600 hover:bg-red-700 focus:ring-red-300',
          icon: (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          )
        };
      case 'success':
        return {
          header: 'bg-green-600',
          button: 'bg-green-600 hover:bg-green-700 focus:ring-green-300',
          icon: (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          )
        };
      case 'warning':
        return {
          header: 'bg-yellow-600',
          button: 'bg-yellow-600 hover:bg-yellow-700 focus:ring-yellow-300',
          icon: (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          )
        };
      default:
        return {
          header: 'bg-blue-600',
          button: 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-300',
          icon: (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          )
        };
    }
  };

  const styles = getModalStyles();
  
  const sizeClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl',
    full: 'max-w-full mx-4'
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity animate-fadeIn"
        onClick={onClose}
      ></div>

      <div className="flex min-h-full items-center justify-center py-6 px-4 text-center sm:p-0">
        <div 
          ref={modalRef}
          className={`relative bg-white rounded-lg shadow-xl ${sizeClasses[size] || sizeClasses.md} w-full my-8 mx-auto overflow-hidden`}
          onClick={e => e.stopPropagation()}
          style={{
            animation: 'modalEnterAnimation 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
            maxHeight: 'calc(100vh - 40px)'
          }}
        >
          {/*header */}
          <div 
            className={`${styles.header} px-4 py-3 sm:px-6 flex items-center justify-between`}
            style={{animation: 'slideInFromTop 0.3s ease-out 0.1s both'}}
          >
            <div className="flex items-center">
              <span 
                className="mr-2 text-white"
                style={{animation: 'fadeInAndBounce 0.5s ease-out 0.2s both'}}
              >
                {styles.icon}
              </span>
              <h3 className="text-lg font-medium text-white" id="modal-title">
                {title}
              </h3>
            </div>
            <button 
              type="button" 
              className="text-white hover:text-gray-200 focus:outline-none focus:ring-2 focus:ring-white rounded-full transition-transform hover:rotate-90" 
              onClick={onClose}
              aria-label="Close"
            >
              <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/*body */}
          <div 
            className="px-4 pt-5 pb-4 sm:p-6 sm:pb-4"
            style={{animation: 'fadeIn 0.4s ease-out 0.3s both'}}
          >
            <div className="sm:flex sm:items-start">
              <div className="mt-3 text-center sm:mt-0 sm:text-left w-full">
                {typeof message === 'string' ? (
                  <div className="mt-2">
                    <p className="text-gray-700">{message}</p>
                  </div>
                ) : (
                  <div className="mt-2">{message}</div>
                )}
              </div>
            </div>
          </div>

          {/*footer */}
          <div 
            className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse gap-2 border-t border-gray-200"
            style={{animation: 'slideInFromBottom 0.3s ease-out 0.4s both'}}
          >
            <button
              ref={confirmButtonRef}
              type="button"
              className={`w-full sm:w-auto inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 text-base font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 sm:text-sm ${styles.button}`}
              onClick={() => {
                onConfirm();
                onClose();
              }}
              style={{animation: 'pulseAnimation 2s infinite'}}
            >
              {confirmText}
            </button>
            {showCancel && (
              <button
                type="button"
                className="mt-3 sm:mt-0 w-full sm:w-auto inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 sm:text-sm"
                onClick={onClose}
              >
                {cancelText}
              </button>
            )}
          </div>
        </div>
      </div>

      <style>
        {`
        @keyframes modalEnterAnimation {
          from {
            opacity: 0;
            transform: scale(0.95) translateY(10px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }
        
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes slideInFromTop {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes slideInFromBottom {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes fadeInAndBounce {
          0% {
            opacity: 0;
            transform: scale(0.8);
          }
          70% {
            opacity: 1;
            transform: scale(1.1);
          }
          100% {
            transform: scale(1);
          }
        }
        
        @keyframes pulseAnimation {
          0% {
            box-shadow: 0 0 0 0 rgba(66, 133, 244, 0.4);
          }
          70% {
            box-shadow: 0 0 0 10px rgba(66, 133, 244, 0);
          }
          100% {
            box-shadow: 0 0 0 0 rgba(66, 133, 244, 0);
          }
        }
      `}
      </style>
    </div>
  );
};

Modal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  message: PropTypes.oneOfType([PropTypes.string, PropTypes.node]).isRequired,
  confirmText: PropTypes.string,
  cancelText: PropTypes.string,
  type: PropTypes.oneOf(['info', 'success', 'warning', 'danger']),
  size: PropTypes.oneOf(['sm', 'md', 'lg', 'xl', '2xl', 'full']),
  showCancel: PropTypes.bool
};

export default Modal;
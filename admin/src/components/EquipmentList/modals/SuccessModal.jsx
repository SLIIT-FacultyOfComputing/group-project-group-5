import React, { Fragment, useRef, useEffect } from 'react';
import { Dialog, Transition } from "@headlessui/react";

const SuccessModal = ({ isOpen, onClose, modalMessage }) => {
  const modalRef = useRef(null);

  // Position modal in the viewport when opened
  useEffect(() => {
    if (isOpen && modalRef.current) {
      setTimeout(() => {
        const viewportHeight = window.innerHeight;
        const modalHeight = modalRef.current.offsetHeight;
        const modalRect = modalRef.current.getBoundingClientRect();
        
        // Check if modal is partially or completely out of viewport
        if (modalRect.top < 20 || modalRect.bottom > viewportHeight - 20) {
          window.scrollTo({
            top: window.pageYOffset + modalRect.top - (viewportHeight - modalHeight) / 2,
            behavior: 'auto'
          });
        }
      }, 50);
    }
  }, [isOpen]);

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel 
                ref={modalRef}
                className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all"
                style={{ maxHeight: 'calc(100vh - 40px)' }}
              >
                <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-green-600 to-green-400"></div>
                <div className="flex items-center justify-center my-4">
                  <div className="mx-auto flex-shrink-0 flex items-center justify-center h-16 w-16 rounded-full bg-green-100 text-green-600 animate-pulse">
                    <svg className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                </div>
                
                <div className="text-center mt-2">
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-medium leading-6 text-gray-900"
                  >
                    Success!
                  </Dialog.Title>
                  <div className="mt-2">
                    <p className="text-sm text-gray-500">
                      {modalMessage || "The operation was successful."}
                    </p>
                  </div>
                </div>

                <div className="mt-6">
                  <button
                    type="button"
                    className="w-full inline-flex justify-center rounded-md border border-transparent bg-green-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors"
                    onClick={onClose}
                  >
                    <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    Great!
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default SuccessModal;
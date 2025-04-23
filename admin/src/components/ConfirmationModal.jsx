"use client"
import PropTypes from "prop-types"

const ConfirmationModal = ({ isOpen, title, message, onConfirm, onCancel, confirmText, cancelText, type }) => {
  if (!isOpen) return null

  const getTypeStyles = () => {
    switch (type) {
      case "delete":
        return {
          icon: (
            <svg
              className="w-12 h-12 mx-auto text-red-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              ></path>
            </svg>
          ),
          confirmButton: "bg-red-600 hover:bg-red-700",
          title: "text-red-600",
        }
      case "update":
        return {
          icon: (
            <svg
              className="w-12 h-12 mx-auto text-blue-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
              ></path>
            </svg>
          ),
          confirmButton: "bg-blue-600 hover:bg-blue-700",
          title: "text-blue-600",
        }
      default:
        return {
          icon: (
            <svg
              className="w-12 h-12 mx-auto text-rose-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              ></path>
            </svg>
          ),
          confirmButton: "bg-rose-600 hover:bg-rose-700",
          title: "text-rose-600",
        }
    }
  }

  const styles = getTypeStyles()

return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
        <div className="fixed inset-0 bg-gray-200 bg-opacity-30 transition-opacity"></div>

        <div
            className="relative bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:max-w-lg sm:w-full animate-scaleIn"
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-headline"
        >
            <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                    <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                        <div className="mt-2 mb-4">{styles.icon}</div>
                        <h3 className={`text-lg leading-6 font-medium ${styles.title} text-center mb-2`} id="modal-headline">
                            {title}
                        </h3>
                        <div className="mt-2">
                            <p className="text-sm text-gray-500 text-center">{message}</p>
                        </div>
                    </div>
                </div>
            </div>
            <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                    type="button"
                    className={`w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 ${styles.confirmButton} text-base font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-rose-500 sm:ml-3 sm:w-auto sm:text-sm transition-all duration-200`}
                    onClick={onConfirm}
                >
                    {confirmText || "Confirm"}
                </button>
                <button
                    type="button"
                    className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm transition-all duration-200"
                    onClick={onCancel}
                >
                    {cancelText || "Cancel"}
                </button>
            </div>
        </div>
    </div>
)
}

ConfirmationModal.defaultProps = {
  confirmText: "Confirm",
  cancelText: "Cancel",
  type: "default",
}

export default ConfirmationModal

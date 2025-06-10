import React, { useState } from 'react';
import { ImCross } from "react-icons/im";

const ConfirmationModal = ({ isOpen, onClose, onConfirm, title, message, showDeleteContents = false }) => {
  const [deleteContents, setDeleteContents] = useState(false);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm" onClick={onClose}></div>
      <div className="modal modal-open">
        <div className="modal-box">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">{title}</h3>
            <button onClick={onClose} className="btn btn-ghost btn-sm">
              <ImCross size={20} />
            </button>
          </div>
          <p className="text-base-content/70 mb-6">{message}</p>
          {showDeleteContents && (
            <div className="mb-4">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={deleteContents}
                  onChange={(e) => setDeleteContents(e.target.checked)}
                  className="checkbox checkbox-sm mr-2"
                />
                <span className="text-sm">Delete all contents within this folder</span>
              </label>
            </div>
          )}
          <div className="modal-action">
            <button onClick={onClose} className="btn btn-ghost">
              Cancel
            </button>
            <button onClick={() => onConfirm(deleteContents)} className="btn btn-error">
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
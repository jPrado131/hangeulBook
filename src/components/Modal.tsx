import React from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-[99999]">
      <div className="fixed inset-0 bg-black opacity-50" onClick={onClose}></div>
      <div className="bg-black p-1 rounded-md shadow-lg z-10 overflow-auto w-full">
        {children}
        <button onClick={onClose} className=" text-white rounded-md absolute top-0 right-0 text-vw-36 cursor-pointer bg-black px-8 py-2">x</button>
      </div>
    </div>
  );
};

export default Modal;

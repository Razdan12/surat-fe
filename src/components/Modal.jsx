import React from 'react';

const openModal = (id, fun) => {
  const modal = document.getElementById(id);
  if (modal) {
    modal.showModal();
    if (fun) fun();
  }
};

const closeModal = (id, fun) => {
  const modal = document.getElementById(id);
  if (modal) {
    modal.close();
    if (fun) fun();
  }
};

const Modal = ({ id, children, width, onClose = () => {} }) => {
  return (
    <div>
      <dialog id={id} onClose={onClose} className="modal modal-middle">
        <div className={`modal-box ${width || ''}`}>
          <div>{children}</div>
        </div>
        <form method="dialog" className="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>
    </div>
  );
};

export { closeModal, openModal };
export default Modal;

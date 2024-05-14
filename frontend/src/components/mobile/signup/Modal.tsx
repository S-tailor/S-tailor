import React, { ReactNode } from 'react';
import styles from '../../../scss/modal.module.scss';

interface ModalProps {
  children: ReactNode
  closeModal: () => void
}

const Modal: React.FC<ModalProps> = ({ children, closeModal }) => {
  return (
    <div className={styles.modalBackground}>
      <div className={styles.modalContent}>
        {children}
        <button className={styles.closeBtn} onClick={closeModal}>확인했습니다</button>
      </div>
    </div>
  );
}

export default Modal;

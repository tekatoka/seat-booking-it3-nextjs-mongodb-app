import { FC, ReactNode, useEffect, useCallback } from 'react'
import styles from './Modal.module.css'

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  children: ReactNode
  title?: string
}

const Modal: FC<ModalProps> = ({ isOpen, onClose, children, title }) => {
  const handleOutsideClick = useCallback(
    (event: any) => {
      if (event.target.classList.contains(styles.modalOverlay)) {
        onClose()
      }
    },
    [onClose]
  )

  const handleEscapePress = useCallback(
    (event: any) => {
      if (event.key === 'Escape') {
        onClose()
      }
    },
    [onClose]
  )

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleEscapePress)
    }
    return () => {
      document.removeEventListener('keydown', handleEscapePress)
    }
  }, [isOpen, handleEscapePress])

  if (!isOpen) return null

  return (
    <div
      className={`${styles.modalOverlay} fixed inset-0 z-10 flex items-center justify-center bg-black bg-opacity-50 overflow-y-auto`}
      onClick={handleOutsideClick}
      onKeyDown={handleEscapePress}
      role='button'
      aria-label='Close modal'
      tabIndex={0}
    >
      <div
        className={`${styles.modalContainer} bg-white rounded-lg shadow-lg relative w-full mx-auto my-6 sm:my-10`}
      >
        <div className='sticky top-0 bg-white p-4 rounded-t-lg'>
          {title && <h2 className='text-lg font-semibold mb-4'>{title}</h2>}
          <button
            onClick={onClose}
            className={`${styles.closeButton} absolute top-2 right-2 text-gray-600 hover:text-gray-900`}
            aria-label='Close modal'
          >
            &times;
          </button>
        </div>
        <div className='p-2 overflow-y-auto max-h-[calc(100vh-8rem)]'>
          {children}
        </div>
      </div>
    </div>
  )
}

export default Modal

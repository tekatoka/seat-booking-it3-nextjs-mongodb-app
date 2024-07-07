import { FC, ReactNode, useEffect } from 'react'

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  children: ReactNode
}

const Modal: FC<ModalProps> = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null

  const handleOutsideClick = (event: any) => {
    if (event.target.classList.contains('modal-overlay')) {
      onClose()
    }
  }

  const handleEscapePress = (event: any) => {
    if (event.key === 'Escape') {
      onClose()
    }
  }

  useEffect(() => {
    document.addEventListener('keydown', handleEscapePress)
    return () => {
      document.removeEventListener('keydown', handleEscapePress)
    }
  }, [])

  return (
    <div
      className='fixed inset-0 z-10 flex items-center justify-center bg-black bg-opacity-50 overflow-y-auto modal-overlay'
      onClick={handleOutsideClick}
    >
      <div className='bg-white rounded-lg shadow-lg relative w-full max-w-md sm:max-w-lg md:max-w-xl lg:max-w-3xl mx-auto my-6 sm:my-10'>
        <div className='sticky top-0 bg-white p-4 rounded-t-lg'>
          <button
            onClick={onClose}
            className='absolute top-2 right-2 text-gray-600 hover:text-gray-900'
          >
            &times;
          </button>
        </div>
        <div className='px-6 py-2 overflow-y-auto max-h-[calc(100vh-8rem)]'>
          {children}
        </div>
      </div>
    </div>
  )
}

export default Modal

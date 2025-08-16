const ImageModal = ({ isOpen, imageSrc, onClose }) => {
  if (!isOpen) return null

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed',
        top: 0, left: 0, right: 0, bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.8)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 9999,
        cursor: 'zoom-out',
      }}
    >
      <img
        src={imageSrc}
        alt="Zoomed"
        style={{
          maxWidth: '90%',
          maxHeight: '90%',
          borderRadius: '8px',
          boxShadow: '0 0 10px #fff',
        }}
        onClick={e => e.stopPropagation()} // Prevent modal close on image click
      />
    </div>
  )
}

export default ImageModal

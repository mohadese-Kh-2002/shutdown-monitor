import Modal from "react-modal";
import Button from "./Button";

const customStyles = {
  overlay: {
    backgroundColor: "rgba(0, 0, 0, 0.75)",
    zIndex: 1000,
  },
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
    background: `oklch(69.6% 0.17 162.48)`,
  },
};
const ModalComponent = ({
  modalIsOpen,
  closeModal,
  title = "اطلاعات",
  message = "پیام مودال.",
  textBtnConfirm,
  textBtnCancel,
  onConfirm,
  onCancel,
}) => {
  const handleCancelClick = () => {
    closeModal();
  };

  return (
    <Modal
      isOpen={modalIsOpen}
      onRequestClose={handleCancelClick} 
      style={customStyles}
      contentLabel={`Modal: ${title}`}
      ariaHideApp={false}
    >
      <h2 className="text-2xl font-bold mb-4 text-white text-center">
        {title}
      </h2>
      <p className="text-white mb-6 text-center">{message}</p>
      <div className="flex flex-row gap-5 items-center justify-center">
        {textBtnCancel && <Button text={textBtnCancel} onClick={onCancel} style={`hover:bg-blue-600`}/>}
        {textBtnConfirm && <Button text={textBtnConfirm} onClick={onConfirm} style={`hover:bg-blue-600`}/>}
      </div>
    </Modal>
  );
};

export default ModalComponent;

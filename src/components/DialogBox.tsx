import { ReactNode } from "react";
import { AiOutlineInfo, AiOutlineWarning } from "react-icons/ai";

interface DialogProps {
  onClose: () => void;
  onConfirm: () => void;
  show: boolean;
  type: "info" | "warning";
  children: ReactNode;
}

const DialogBox = ({
  onClose,
  onConfirm,
  show,
  type,
  children,
}: DialogProps) => {
  const iconClasses = "flex-1 mx-auto w-16";
  const icon = {
    info: <AiOutlineInfo className={iconClasses} />,
    warning: <AiOutlineWarning className={iconClasses} />,
  };

  const confirmClasses = "btn w-24";
  const confirmButton = {
    info: (
      <button onClick={onConfirm} className={confirmClasses}>
        Confirm
      </button>
    ),
    warning: (
      <button
        onClick={onConfirm}
        className={confirmClasses.concat(" destructive")}
      >
        Confirm
      </button>
    ),
  };

  return show ? (
    <div className="fade-in fixed flex flex-col justify-center bg-gray-700 bg-opacity-70 top-0 left-0 right-0 bottom-0 p-14">
      <div className="fade-in bg-black border border-gray-500 flex flex-col rounded-lg p-4 mx-auto my-0 max-w-lg min-h-lg ">
        {icon[type]}
        {children}
        <div className="flex-1 flex flex-grow-0 justify-between px-8">
          <button onClick={onClose} className="btn w-24">
            Cancel
          </button>
          {confirmButton[type]}
        </div>
      </div>
    </div>
  ) : (
    <></>
  );
};

export default DialogBox;

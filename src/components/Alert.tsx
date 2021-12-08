import React from "react";
import { AiOutlineCheckCircle, AiOutlineCloseSquare, AiOutlineWarning } from "react-icons/ai";
import { MdErrorOutline, MdInfoOutline } from "react-icons/md";

interface IAlertProps extends Object {
  type: "error" | "info" | "success" | "warning";
  message: string;
  fade: boolean;
  onClose: () => void;
}

export const Alert: React.FC<IAlertProps> = ({ type, message, fade, onClose }) => {
  const alertClass = {
    error: "alert-error",
    warning: "alert-warning",
    info: "alert-info",
    success: "alert-success",
  };

  const iconClasses = "icon-sm mx-2";

  const alertIcon = {
    error: <MdErrorOutline className={iconClasses} />,
    warning: <AiOutlineWarning className={iconClasses} />,
    info: <MdInfoOutline className={iconClasses} />,
    success: <AiOutlineCheckCircle className={iconClasses} />,
  };

  const fadeClass = fade ? "fade-out" : "";

  return (
    <div className={`fade-in alert ${alertClass[type]} ${fadeClass}`} role="alertdialog">
      <div className="flex-1">
        {alertIcon[type]}
        <label className="mx-3">{message}</label>
      </div>

      <div className="flex-none">
        <button className="btn btn-ghost btn-sm" onClick={onClose}>
          <AiOutlineCloseSquare className="icon-sm" />
        </button>
      </div>
    </div>
  );
};

import { AlertType } from "../services/alert.service";
import {
  AiOutlineCheckCircle,
  AiOutlineCloseSquare,
  AiOutlineWarning,
} from "react-icons/ai";
import { MdErrorOutline, MdInfoOutline } from "react-icons/md";

interface Props {
  type: string;
  message: string;
  fade: boolean;
  onClose: () => void;
}

export function Alert({ type, message, fade, onClose }: Props) {
  const alertClass = {
    [AlertType.Error]: "alert-error",
    [AlertType.Warn]: "alert-warning",
    [AlertType.Info]: "alert-info",
    [AlertType.Success]: "alert-success",
  };

  const iconClasses = "w-6 h-6 mx-2 stroke-current";

  const alertIcon = {
    [AlertType.Error]: <MdErrorOutline className={iconClasses} />,
    [AlertType.Warn]: <AiOutlineWarning className={iconClasses} />,
    [AlertType.Info]: <MdInfoOutline className={iconClasses} />,
    [AlertType.Success]: <AiOutlineCheckCircle className={iconClasses} />,
  };

  const fadeClass = fade ? "fade-out" : "";

  return (
    <div className={`fade-in alert ${alertClass[type]} ${fadeClass}`}>
      <div className="flex-1">
        {alertIcon[type]}
        <label className="mx-3">{message}</label>
      </div>

      <div className="flex-none">
        <button className="btn btn-ghost btn-sm" onClick={onClose}>
          <AiOutlineCloseSquare className="inline-block w-6 h-6 stroke-current" />
        </button>
      </div>
    </div>
  );
}

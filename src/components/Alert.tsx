import { AlertType } from "../services/alert.service";
import {
  AiOutlineCheckCircle,
  AiOutlineCloseSquare,
  AiOutlineWarning,
} from "react-icons/ai";
import { MdErrorOutline, MdInfoOutline } from "react-icons/md";

interface AlertProps {
  type: string;
  message: string;
  fade: boolean;
  onClose: () => void;
}

const Alert = (props: AlertProps) => {
  const { type, message, fade, onClose } = props;

  const alertColor = {
    [AlertType.Error]: "bg-red-200",
    [AlertType.Warn]: "bg-yellow-200",
    [AlertType.Info]: "bg-blue-200",
    [AlertType.Success]: "bg-green-200",
  };

  const alertFg = {
    [AlertType.Error]: "text-red-800",
    [AlertType.Warn]: "text-yellow-800",
    [AlertType.Info]: "text-blue-800",
    [AlertType.Success]: "text-green-800",
  };

  const iconClasses = [
    "inline-block",
    "fill-current",
    "flex-shrink-0",
    "select-none",
  ];
  iconClasses.push(alertColor[type], alertFg[type]);

  const alertIcon = {
    [AlertType.Error]: <MdErrorOutline className={iconClasses.join(" ")} />,
    [AlertType.Warn]: <AiOutlineWarning className={iconClasses.join(" ")} />,
    [AlertType.Info]: <MdInfoOutline className={iconClasses.join(" ")} />,
    [AlertType.Success]: (
      <AiOutlineCheckCircle className={iconClasses.join(" ")} />
    ),
  };

  const fadeClass = fade ? "fade-out" : "";

  return (
    <div
      className={`fade-in flex rounded px-4 py-2 m-2 text-center ${alertColor[type]} ${fadeClass}`}
    >
      <div className={`${alertFg[type]} flex text-2xl opacity-90 py-2 mr-3`}>
        {alertIcon[type]}
      </div>
      <div className="px-0 py-2 text-lg text-black">{message}</div>
      <div
        className={`${alertFg[type]} flex cursor-pointer text-2xl opacity-90 p-2 ml-auto`}
        onClick={onClose}
      >
        <AiOutlineCloseSquare className="inline-block fill-current flex-shrink-0 select-none" />
      </div>
    </div>
  );
};

export default Alert;

import { ReactNode } from "react";

interface IconButtonProps {
  onClick?: () => void;
  icon: ReactNode;
  text: string;
  type?: "button" | "submit" | "reset" | undefined;
  name?: string;
}

export const DestructiveButton = ({ icon, text, ...rest }: IconButtonProps) => {
  return (
    <button {...rest} className="btn btn-outline">
      {icon}
      <span>{text}</span>
    </button>
  );
};

const IconButton = ({ icon, text, ...rest }: IconButtonProps) => {
  return (
    <button {...rest} className="btn">
      {icon}
      <span>{text}</span>
    </button>
  );
};

export default IconButton;

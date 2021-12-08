import React from "react";

interface IModalProps extends Object {
  id: string;
  destructive?: boolean;
  ghost?: boolean;
  openIcon?: React.ReactNode;
  openText?: string;
  primaryText: string;
  secondaryText: string;
  title: string;
  onConfirm?: React.MouseEventHandler<HTMLLabelElement>;
}

export const Modal: React.FC<IModalProps> = ({
  children,
  destructive,
  ghost,
  openIcon,
  openText,
  onConfirm,
  id,
  primaryText,
  secondaryText,
  title,
}) => {
  const openClasses = ghost ? "btn btn-ghost btn-sm modal-open" : "btn btn-outline btn-secondary modal-open";
  const primaryClasses = destructive ? "btn btn-outline btn-secondary" : "btn btn-outline btn-primary";

  return (
    <>
      <label htmlFor={id} className={openClasses}>
        {openIcon}
        {openText}
      </label>
      <input type="checkbox" id={id} className="modal-toggle" />
      <div className="modal">
        <div className="modal-box">
          <h2 className="font-bold text-xl">{title}</h2>
          <br />
          {children}

          <div className="modal-action">
            <label htmlFor={id} onClick={onConfirm} className={primaryClasses}>
              {primaryText}
            </label>
            <label htmlFor={id} className="btn">
              {secondaryText}
            </label>
          </div>
        </div>
      </div>
    </>
  );
};

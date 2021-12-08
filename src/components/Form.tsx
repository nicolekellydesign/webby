import React from "react";

interface IFormProps extends React.DetailedHTMLProps<React.FormHTMLAttributes<HTMLFormElement>, HTMLFormElement> {
  disabled?: boolean;
  hasReset?: boolean;
  header?: string;
  resetText?: string;
  submitText: string;
}

export const Form: React.FC<IFormProps> = ({
  children,
  disabled,
  hasReset,
  header,
  resetText,
  submitText,
  ...rest
}) => {
  const controls = hasReset ? (
    <div className="input-group">
      <button type="reset" disabled={disabled} className="btn btn-outline">
        {resetText}
      </button>
      <button id="submit" type="submit" disabled={disabled} className="btn btn-outline btn-primary">
        {submitText}
      </button>
    </div>
  ) : (
    <button id="submit" type="submit" disabled={disabled} className="btn btn-outline btn-primary">
      {submitText}
    </button>
  );

  return (
    <form {...rest}>
      {header && <h2 className="card-title">{header}</h2>}

      {children}

      <div className="card-actions">{controls}</div>
    </form>
  );
};

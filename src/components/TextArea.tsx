import React from "react";

interface ITextAreaProps extends Object {
  defaultValue?: string;
  id?: string;
  label: string;
  name?: string;
  placeholder?: string;
  required?: boolean;
  title?: string;
}

export const TextArea: React.FC<ITextAreaProps> = ({ id, label, ...rest }) => {
  return (
    <div className="form-control">
      <label htmlFor={id} className="label">
        <span className="label-text">{label}</span>
      </label>
      <textarea id={id} {...rest} className="textarea textarea-bordered h-64" />
    </div>
  );
};

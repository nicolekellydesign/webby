import React from "react";

interface ITextInputProps extends Object {
  defaultValue?: string;
  id?: string;
  label: string;
  name?: string;
  pattern?: string;
  placeholder?: string;
  required?: boolean;
  title?: string;
}

export const TextInput: React.FC<ITextInputProps> = ({ id, label, ...rest }) => {
  return (
    <div className="form-control">
      <label htmlFor={id} className="label">
        <span className="label-text">{label}</span>
      </label>
      <input id={id} type="text" {...rest} className="input input-bordered" />
    </div>
  );
};

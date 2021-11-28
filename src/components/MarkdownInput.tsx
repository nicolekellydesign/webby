import { useEffect, useState } from "react";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface IMarkdownInputProps extends Object {
  inputId?: string;
  inputName?: string;
  title?: string;
  label?: string;
  startingText?: string;
}

export const MarkdownInput: React.FC<IMarkdownInputProps> = ({ inputId, inputName, title, label, startingText }) => {
  const [currentText, setCurrentText] = useState("");

  const titleElement = title && <div className="card-title mb-0">{title}</div>;
  const labelElement = label && <div className="label-text">{label}</div>;

  useEffect(() => {
    setCurrentText(startingText || "");
  }, [setCurrentText, startingText]);

  return (
    <div className="form-control">
      <label htmlFor={inputId} className="label">
        {titleElement}
        {labelElement}
      </label>
      <label htmlFor={inputId} className="label">
        <div className="label-text-alt">
          You can use{" "}
          <a
            href="https://docs.github.com/en/github/writing-on-github/getting-started-with-writing-and-formatting-on-github/basic-writing-and-formatting-syntax"
            className="link"
          >
            Github Flavored Markdown
          </a>{" "}
          here.
        </div>
      </label>
      <textarea
        id={inputId}
        name={inputName}
        defaultValue={startingText}
        className="textarea textarea-bordered break-words resize-none mt-2 h-96"
        required
        onChange={(e) => {
          setCurrentText(e.target.value);
        }}
        onScroll={(e) => {
          const preview = document.getElementById("preview");
          if (preview) {
            preview.scrollTop = e.currentTarget.scrollTop;
          }
        }}
      />
      {currentText && (
        <div className="bg-base-200 bg-opacity-20 rounded-lg mt-4">
          <div className="card-title text-neutral px-4 pt-2">Preview</div>
          <div id="preview" className="overflow-y-hidden">
            <ReactMarkdown
              className="bg-opacity-10 prose textarea text-gray-600 max-w-fit max-h-96"
              remarkPlugins={[remarkGfm]}
            >
              {currentText}
            </ReactMarkdown>
          </div>
        </div>
      )}
    </div>
  );
};

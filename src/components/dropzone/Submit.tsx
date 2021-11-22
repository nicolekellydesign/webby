import { ISubmitButtonProps } from "react-dropzone-uploader";
import { AiOutlineUpload } from "react-icons/ai";

export default function Submit({ disabled, onSubmit, files }: ISubmitButtonProps) {
  const _disabled =
    files.some((f) => ["preparing", "getting_upload_params", "uploading"].includes(f.meta.status)) ||
    !files.some((f) => ["headers_received", "done"].includes(f.meta.status));

  const handleSubmit = () => {
    onSubmit(files.filter((f) => ["headers_received", "done"].includes(f.meta.status)));
  };

  return (
    <div>
      <button className="btn" onClick={handleSubmit} disabled={disabled || _disabled}>
        <AiOutlineUpload className="btn-icon" />
        Upload files
      </button>
    </div>
  );
}

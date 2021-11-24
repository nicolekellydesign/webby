import {
  formatBytes,
  formatDuration,
  IInputProps,
  ILayoutProps,
  IPreviewProps,
  ISubmitButtonProps,
} from "react-dropzone-uploader";
import { AiOutlineClose, AiOutlinePause, AiOutlinePlayCircle, AiOutlineUpload } from "react-icons/ai";

export function Input({
  getFilesFromEvent,
  accept,
  multiple,
  disabled,
  content,
  withFilesContent,
  onFiles,
  files,
}: IInputProps) {
  const input = (
    <input
      className="hidden"
      type="file"
      accept={accept}
      multiple={multiple}
      disabled={disabled}
      onChange={async (e) => {
        const target = e.target;
        const chosenFiles = await getFilesFromEvent(e);
        onFiles(chosenFiles);
        //@ts-ignore
        target.value = null;
      }}
    />
  );

  if (files.length > 0) {
    if (multiple) {
      return (
        <label className="btn btn-primary self-start">
          {withFilesContent}
          {input}
        </label>
      );
    } else {
      return <>{input}</>;
    }
  }

  return (
    <label className="btn btn-outline flex flex-grow justify-center items-center text-2xl link h-auto">
      {content}
      {input}
    </label>
  );
}

export function Layout({ input, previews, submitButton, dropzoneProps, files, extra: { maxFiles } }: ILayoutProps) {
  return (
    <div {...dropzoneProps}>
      {previews && previews.length > 0 && (
        <div className="flex flex-col bg-base-200 bg-opacity-20 rounded-lg overflow-y-scroll px-4 mb-4 max-h-64">
          {previews}
        </div>
      )}

      <div className="flex flex-row flex-grow gap-4">
        {files.length < maxFiles && input}
        {files.length > 0 && submitButton}
      </div>
    </div>
  );
}

export function Preview({
  fileWithMeta: { cancel, remove, restart },
  meta: { name = "", percent = 0, size = 0, previewUrl, status, duration, validationError },
  isUpload,
  canCancel,
  canRemove,
  canRestart,
  extra: { minSizeBytes },
}: IPreviewProps) {
  let title = `${name || "?"}, ${formatBytes(size)}`;
  if (duration) title = `${title}, ${formatDuration(duration)}`;

  const classes = "flex flex-row justify-between relative py-4 w-full";

  if (status === "error_file_size" || status === "error_validation") {
    return (
      <div className={classes}>
        <span className="text-sm text-error">{title}</span>
        {status === "error_file_size" && <span>{size < minSizeBytes ? "File too small" : "File too big"}</span>}
        {status === "error_validation" && <span>{String(validationError)}</span>}
        {canRemove && (
          <button className="btn btn-sm btn-ghost" onClick={remove}>
            <AiOutlineClose className="icon-sm" />
          </button>
        )}
      </div>
    );
  }

  if (status === "error_upload_params" || status === "exception_upload" || status === "error_upload") {
    title = `${title} (upload failed)`;
  }
  if (status === "aborted") title = `${title} (cancelled)`;

  return (
    <div className={classes}>
      {previewUrl && <img className="w-16 h-16" src={previewUrl} alt={title} title={title} />}
      {!previewUrl && <span className="text-sm">{title}</span>}

      <div className="flex items-center w-96">
        {isUpload && (
          <progress
            className="progress progress-info mx-4"
            max={100}
            value={status === "done" || status === "headers_received" ? 100 : percent}
          />
        )}

        {status === "uploading" && canCancel && (
          <button className="btn btn-sm btn-ghost" onClick={cancel}>
            <AiOutlinePause className="icon-sm" />
          </button>
        )}
        {status !== "preparing" && status !== "getting_upload_params" && status !== "uploading" && canRemove && (
          <button className="btn btn-sm btn-ghost" onClick={remove}>
            <AiOutlineClose className="icon-sm" />
          </button>
        )}
        {["error_upload_params", "exception_upload", "error_upload", "aborted", "ready"].includes(status) &&
          canRestart && (
            <button className="btn btn-sm btn-ghost" onClick={restart}>
              <AiOutlinePlayCircle className="icon-sm" />
            </button>
          )}
      </div>
    </div>
  );
}

export function Submit({ disabled, onSubmit, files }: ISubmitButtonProps) {
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

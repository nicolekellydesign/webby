import { formatBytes, formatDuration, IPreviewProps } from "react-dropzone-uploader";
import { AiOutlineClose, AiOutlinePause, AiOutlinePlayCircle } from "react-icons/ai";

export default function Preview({
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
            className="progress progress-info mr-4"
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

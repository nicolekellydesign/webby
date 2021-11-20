import { ProgressInfo } from "../services/upload.service";

export default function ProgressInfoDisplay({ percentage, fileName, errored }: ProgressInfo) {
  const classes = errored ? "progress progress-error" : "progress progress-info";

  return (
    <div className="my-4 w-96">
      {fileName && <span className="ml-2">{fileName}</span>}
      <progress className={classes} value={percentage} max="100" title="Upload progress" />
    </div>
  );
}

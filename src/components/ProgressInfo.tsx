import { ProgressInfo } from "../services/upload.service";

export default function ProgressInfoDisplay({
  percentage,
  fileName,
}: ProgressInfo) {
  return (
    <div className="mb-6 w-96">
      <span className="ml-2">{fileName}</span>
      <progress
        className="progress progress-info"
        value={percentage}
        max="100"
        title="Upload progress"
      />
    </div>
  );
}

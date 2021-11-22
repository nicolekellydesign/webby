import { useEffect, useState } from "react";

interface Props {
  percentage: number;
  fileName?: string;
  errored: boolean;
}

export default function ProgressBar({ percentage, fileName, errored }: Props) {
  const [percent, setPercent] = useState(0);
  const [hasError, setHasError] = useState(false);

  const classes = hasError ? "progress progress-error" : "progress progress-info";

  console.info(percent);

  useEffect(() => {
    setPercent(percentage);
    setHasError(errored);
  }, [percentage, setPercent, errored, setHasError]);

  return (
    <div className="my-4 w-96">
      {fileName && <span className="ml-2">{fileName}</span>}
      <progress className={classes} value={percent} max="100" title="Upload progress" />
    </div>
  );
}

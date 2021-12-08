import { alertService } from "@Services/alert.service";
import axios, { AxiosError, AxiosRequestConfig } from "axios";
import React, { useCallback, useEffect, useState } from "react";
import { DropzoneProps, FileRejection, FileWithPath, useDropzone } from "react-dropzone";
import { AiOutlineClose, AiOutlineFile, AiOutlineUpload } from "react-icons/ai";

interface IDropzoneProps extends DropzoneProps {
  onSubmit: (files: FileWithPath[]) => void;
}

interface IPreviewProps extends Object {
  file: FileWithPath;
  percentage: number;
  preview?: string;
  state: "errored" | "finished" | "starting" | "uploading";
  remove: () => void;
}

const Preview: React.FC<IPreviewProps> = ({ file: { name }, percentage = 0, preview, state, remove }) => {
  const barColor = {
    errored: "progress-errror",
    finished: "progress-success",
    starting: "progress-info",
    uploading: "progress-info",
  };

  return (
    <li className="flex flex-row relative py-4 w-full">
      {state === "finished" && preview ? (
        <img className="w-24 h-24" src={`/images/${preview}`} />
      ) : (
        <AiOutlineFile className="w-24 h-24 stroke-current" />
      )}

      <div className="flex items-center">
        <div className="flex flex-col mx-4 w-96">
          <div className="font-bold">{name}</div>
          <div className="font-bold">{percentage}%</div>
          <progress className={`progress ${barColor[state]}`} max={100} value={percentage} />
        </div>

        {state === "finished" && (
          <div data-tip="Remove file" className="tooltip">
            <button className="btn btn-sm btn-ghost" onClick={remove}>
              <AiOutlineClose className="icon-sm" />
            </button>
          </div>
        )}
      </div>
    </li>
  );
};

export const Dropzone: React.FC<IDropzoneProps> = ({ onSubmit: onUpload, disabled, maxFiles, multiple, ...rest }) => {
  const [files, setFiles] = useState<FileWithPath[]>([]);
  const [previews, setPreviews] = useState<IPreviewProps[]>([]);
  const [allFinished, setAllFinished] = useState(false);

  // Called when there's a progress update to a file upload.
  const onProgress = useCallback(
    (event: ProgressEvent, idx: number) => {
      const percentCompleted = Math.round((event.loaded * 100) / event.total);
      console.log(percentCompleted, event);

      // Clone our previews state slice
      const clone = previews.slice();
      // Get the existing preview
      const preview = clone[idx];
      // Update our preview object
      preview.percentage = percentCompleted;
      // Set our state with the updated preview
      setPreviews(clone);
    },
    [previews]
  );

  // Called when files are added to the uploader
  const onDropAccepted = useCallback(
    (acceptedFiles: FileWithPath[]) => {
      acceptedFiles.forEach((file) => {
        const preview: IPreviewProps = {
          file: file,
          percentage: 0,
          state: "starting",
          remove: () => {
            setFiles(files.filter((f) => f.name !== preview.file.name));
            setPreviews(previews.filter((p) => p !== preview));
          },
        };
        setPreviews((previews) => previews.concat(preview));
      });
    },
    [files, previews]
  );

  // Called when added files are rejected.
  const onDropRejected = useCallback((fileRejections: FileRejection[]) => {
    fileRejections.forEach((rejection) => {
      alertService.error(`Rejected ${rejection.file.name} for: ${rejection.errors[0].message}`, false);
    });
  }, []);

  // Kicks off the file uploads when a new preview object is added to the state.
  useEffect(() => {
    const clone = previews.slice();
    clone.forEach((preview, idx) => {
      // Only start an upload if the upload state hasn't started yet
      if (preview.state === "starting") {
        preview.state = "uploading";

        const { file } = preview;
        const data = new FormData();
        data.append("file", file, file.name);

        // Create an Axios config object that has an event handler to update our
        // upload progress.
        const config: AxiosRequestConfig<FormData> = {
          onUploadProgress: (event: ProgressEvent) => {
            onProgress(event, idx);
          },
        };

        axios
          .post("/api/v1/admin/upload", data, config)
          .then((res) => {
            if (res.status === 200) {
              const clone = previews.slice();
              clone[idx].state = "finished";
              clone[idx].preview = file.name;
              setPreviews(clone);
              setFiles((files) => files.concat(file));
            }
          })
          .catch((error: AxiosError) => {
            console.log(`error uploading file'${file.name}'`, { error });
            alertService.error(`Error uploading '${file.name}': ${error.message}`, false);

            const clone = previews.slice();
            clone[idx].state = "errored";
            setPreviews(clone);
          });

        setPreviews(clone);
      }
    });

    if (previews.filter((p) => p.state !== "finished").length > 0) {
      setAllFinished(false);
    } else {
      setAllFinished(true);
    }
  }, [previews, onProgress]);

  if (!disabled) {
    if (multiple === false && previews.length > 0) {
      disabled = true;
    }

    if (maxFiles && maxFiles >= 0 && previews.length >= maxFiles) {
      disabled = true;
    }
  }

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDropAccepted,
    onDropRejected,
    disabled,
    maxFiles,
    multiple,
    ...rest,
  });

  const dropzoneClasses = isDragActive ? "dropzone dropzone-dragging" : "dropzone";

  return (
    <section className="container flex flex-col">
      <button {...getRootProps({ className: dropzoneClasses, disabled: disabled })}>
        <input {...getInputProps({ disabled: disabled })} />
        {isDragActive ? <p>Drop files here</p> : <p>Drag files here or click to select</p>}
      </button>

      {previews.length > 0 && (
        <aside>
          <h4 className="py-4 text-lg">File Uploads</h4>
          <ul className="flex flex-wrap gap-4">
            {previews.map((preview, idx) => (
              <Preview key={idx} {...preview} />
            ))}
          </ul>

          <button
            onClick={() => {
              onUpload(files);
            }}
            className="btn btn-outline btn-primary mt-4"
            disabled={!allFinished}
          >
            <AiOutlineUpload className="btn-icon" />
            Finish upload
          </button>
        </aside>
      )}
    </section>
  );
};

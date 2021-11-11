import { useRef, useState } from "react";
import {
  AiOutlineCheck,
  AiOutlineCheckCircle,
  AiOutlineDelete,
  AiOutlineUpload,
} from "react-icons/ai";
import { alertService } from "../services/alert.service";
import UploadService, { ProgressInfo } from "../services/upload.service";
import ProgressInfoDisplay from "./ProgressInfo";
import "./ImageManager.css";

interface UploadImageElements extends HTMLFormControlsCollection {
  image: HTMLInputElement;
  submit: HTMLInputElement;
}

export interface UploadImageFormElement extends HTMLFormElement {
  readonly elements: UploadImageElements;
}

interface ImageManagerProps {
  images?: string[];
  label: string;
  title: string;
  uploadFunc: (images: string[]) => void;
  deleteImages: (images: string[]) => void;
}

const ImageManager = ({
  deleteImages,
  images,
  label,
  title,
  uploadFunc,
}: ImageManagerProps) => {
  const [selected, setSelected] = useState<string[]>([]);

  const [imageFiles, setImageFiles] = useState<FileList | undefined>(undefined);

  const [progressInfos, setProgressInfos] = useState<ProgressInfo[]>([]);

  const progressInfosRef = useRef<any>(null);

  const imageChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { files } = event.target;

    setImageFiles(files || undefined);
    setProgressInfos([]);
  };

  const handleUpload = (event: React.FormEvent<UploadImageFormElement>) => {
    event.preventDefault();

    if (!imageFiles || imageFiles.length === 0) {
      return;
    }

    const form = event.currentTarget;
    const { submit } = form.elements;
    submit.disabled = true;

    const files = Array.from(imageFiles);

    let _progressInfos = files.map((file) => ({
      percentage: 0,
      fileName: file.name,
      errored: false,
    }));

    progressInfosRef.current = {
      val: _progressInfos,
    };

    const uploadPromises = files.map((file, i) => upload(i, file));

    Promise.all(uploadPromises)
      .then((uploaded) => {
        uploadFunc(uploaded);
      })
      .then(() => {
        setImageFiles(undefined);
        form.reset();
        submit.disabled = false;
      })
      .catch((error) => {
        console.error(`error uploading files: ${error}`);
        alertService.error(`Error uploading files: ${error}`, false);
      });
  };

  const upload = (i: number, file: File): Promise<string> => {
    let _progressInfos = [...progressInfosRef.current.val];

    return new Promise((resolve, reject) => {
      UploadService.upload(
        file,
        (percentage) => {
          _progressInfos[i].percentage = percentage;
          setProgressInfos(_progressInfos);
        },
        (status, response) => {
          if (status !== 200) {
            _progressInfos[i].errored = true;
            setProgressInfos(_progressInfos);
            reject(response.statusText);
          } else {
            resolve(_progressInfos[i].fileName);
          }
        }
      );
    });
  };

  return (
    <div className="card lg:card-side bordered mt-8 w-7xl">
      <div className="card-body">
        <h2 className="card-title">{title}</h2>
        <ul className="max-w-6xl max-h-80 gap-4 image-scroller carousel-center rounded-box p-4">
          {images?.map((image) => (
            <li
              className="carousel-item rounded-box bg-cover bg-center bg-no-repeat cursor-pointer justify-center w-64 h-64"
              data-src={`/images/${image}`}
              style={{
                backgroundImage: `url("/images/${image}")`,
              }}
            >
              {selected.some((name) => name === image) ? (
                <div
                  className="opacity-70 bg-black hover:text-blue-400 rounded-box relative flex-1 flex flex-col justify-center align-middle overflow-hidden transition"
                  onClick={() => {
                    setSelected((selected) =>
                      selected.filter((name) => name !== image)
                    );
                  }}
                >
                  <div data-tip="Unselect image" className="tooltip">
                    <div className="box-border font-bold text-lg mx-auto w-max">
                      <div className="w-max">
                        <AiOutlineCheckCircle className="w-12 h-12" />
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div
                  className="opacity-0 hover:opacity-70 hover:bg-black rounded-box relative flex-1 flex flex-col justify-center align-middle overflow-hidden transition"
                  onClick={() => {
                    setSelected((selected) => selected.concat(image));
                  }}
                >
                  <div data-tip="Select image" className="tooltip">
                    <div className="box-border font-bold text-lg mx-auto w-max">
                      <div className="w-max">
                        <AiOutlineCheck className="mx-auto w-12 h-12" />
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </li>
          ))}
        </ul>

        <div className="mt-4">
          <form
            id="image-upload-form"
            onSubmit={handleUpload}
            className="card-body"
          >
            <div className="form-control">
              <label htmlFor="image" className="card-title">
                {label}
              </label>
              <div className="text-xs">
                <p>Max file size: 8 MB</p>
              </div>

              <input
                type="file"
                accept="image/*"
                name="image"
                multiple
                title="Only images allowed."
                onChange={imageChangeHandler}
                className="btn btn-ghost mt-4"
              />

              {progressInfos.map((info, idx) => (
                <ProgressInfoDisplay
                  key={idx}
                  fileName={info.fileName}
                  percentage={info.percentage}
                  errored={info.errored}
                />
              ))}
            </div>

            <div className="card-actions">
              <button type="submit" name="submit" className="btn btn-primary">
                <AiOutlineUpload className="inline-block w-6 h-6 mr-2 stroke-current" />
                Upload images
              </button>
              {selected.length > 0 && (
                <>
                  <label
                    htmlFor="delete-images-modal"
                    className="btn btn-secondary btn-outline modal-open"
                  >
                    <AiOutlineDelete className="inline-block w-6 h-6 mr-2 stroke-current" />
                    Delete selected
                  </label>
                  <input
                    type="checkbox"
                    id="delete-images-modal"
                    className="modal-toggle"
                  />
                  <div className="modal">
                    <div className="modal-box">
                      <h2 className="font-bold text-xl">
                        Are you sure you want to delete these images?
                      </h2>
                      <br />
                      <p>Images selected: {selected.length}</p>
                      <p>This action cannot be reversed.</p>

                      <div className="modal-action">
                        <label
                          htmlFor="delete-images-modal"
                          className="btn btn-secondary"
                          onClick={() => {
                            deleteImages(selected);
                            setSelected([]);
                          }}
                        >
                          Delete
                        </label>
                        <label htmlFor="delete-images-modal" className="btn">
                          Cancel
                        </label>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ImageManager;

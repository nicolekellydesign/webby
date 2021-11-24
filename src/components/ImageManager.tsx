import { useState } from "react";
import { AiOutlineCheck, AiOutlineCheckCircle, AiOutlineDelete } from "react-icons/ai";
import Dropzone from "react-dropzone-uploader";
import "react-dropzone-uploader/dist/styles.css";
import "@Components/ImageManager.css";
import { Input, Layout, Preview, Submit } from "@Components/dropzone/DropzoneOverrides";

interface Props {
  images?: string[];
  title: string;
  uploadFunc: (images: string[]) => void;
  deleteImages: (images: string[]) => void;
}

export function ImageManager({ deleteImages, images, title, uploadFunc }: Props) {
  const [selected, setSelected] = useState<string[]>([]);

  return (
    <div className="card lg:card-side bordered mt-8 w-7xl">
      <div className="card-body">
        <h2 className="card-title">{title}</h2>
        <ul className="webby-carousel">
          {images?.map((image) => (
            <li
              className="webby-carousel-item"
              data-src={`/images/${image}`}
              style={{
                backgroundImage: `url("/images/${image}")`,
              }}
            >
              {selected.some((name) => name === image) ? (
                <div
                  className="selected"
                  onClick={() => {
                    setSelected((selected) => selected.filter((name) => name !== image));
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
                  className="unselected"
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

        {selected.length > 0 && (
          <div className="mt-8">
            <label htmlFor="delete-images-modal" className="btn btn-secondary btn-outline modal-open">
              <AiOutlineDelete className="btn-icon" />
              Delete selected
            </label>
            <input type="checkbox" id="delete-images-modal" className="modal-toggle" />
            <div className="modal">
              <div className="modal-box">
                <h2 className="font-bold text-xl">Are you sure you want to delete these images?</h2>
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
          </div>
        )}

        <div className="mt-8">
          <Dropzone
            getUploadParams={() => {
              return { method: "POST", url: "/api/v1/admin/upload" };
            }}
            onChangeStatus={({ meta, file }, status) => {
              console.log(status, meta, file);
            }}
            onSubmit={(files) => {
              uploadFunc(files.flatMap((file) => file.meta.name));
            }}
            accept="image/*"
            maxSizeBytes={8 * 1024 * 1024}
            LayoutComponent={Layout}
            PreviewComponent={Preview}
            InputComponent={Input}
            SubmitButtonComponent={Submit}
            classNames={{ dropzone: "dropzone dropzone-lg" }}
          />
        </div>
      </div>
    </div>
  );
}

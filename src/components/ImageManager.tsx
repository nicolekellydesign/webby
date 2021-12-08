import React, { useState } from "react";
import { AiOutlineCheck, AiOutlineCheckCircle, AiOutlineDelete } from "react-icons/ai";

import { Dropzone } from "@Components/Dropzone";
import { Modal } from "@Components/Modal";
import "@Components/ImageManager.css";

interface IImageManagerProps extends Object {
  images?: string[];
  title: string;
  uploadFunc: (images: string[]) => void;
  deleteImages: (images: string[]) => void;
}

export const ImageManager: React.FC<IImageManagerProps> = ({ deleteImages, images, title, uploadFunc }) => {
  const [selected, setSelected] = useState<string[]>([]);

  return (
    <div className="card lg:card-side bordered mt-8 w-7xl">
      <div className="card-body">
        <h2 className="card-title">{title}</h2>
        <ul className="webby-carousel">
          {images?.map((image, idx) => (
            <li
              key={idx}
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
            <Modal
              id="delete-images-modal"
              openIcon={<AiOutlineDelete className="btn-icon" />}
              openText="Delete selected"
              title="Are you sure you want to delete these images?"
              primaryText="Delete"
              secondaryText="Cancel"
              onConfirm={() => {
                deleteImages(selected);
                setSelected([]);
              }}
              destructive
            >
              <p>Images selected: {selected.length}</p>
              <p>This action cannot be reversed.</p>
            </Modal>
          </div>
        )}

        <div className="mt-8">
          <Dropzone
            onSubmit={(files) => {
              uploadFunc(files.flatMap((file) => file.name));
            }}
            accept="image/*"
            maxSize={8 * 1024 * 1024}
          />
        </div>
      </div>
    </div>
  );
};

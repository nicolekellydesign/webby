import { ILayoutProps } from "react-dropzone-uploader";

export default function Layout({
  input,
  previews,
  submitButton,
  dropzoneProps,
  files,
  extra: { maxFiles },
}: ILayoutProps) {
  return (
    <div {...dropzoneProps} className="flex flex-col w-6xl min-h-36 relative transition rounded-box">
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

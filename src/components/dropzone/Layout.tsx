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
    <div
      {...dropzoneProps}
      className="flex flex-col p-4 w-6xl min-h-36 relative transition border border-base-200 rounded-box"
    >
      <div className="flex flex-col overflow-y-scroll max-h-64">{previews}</div>

      <div className="flex flex-row flex-grow gap-4 mt-4">
        {files.length < maxFiles && input}
        {files.length > 0 && submitButton}
      </div>
    </div>
  );
}

import { IInputProps } from "react-dropzone-uploader";

export default function Input({
  getFilesFromEvent,
  accept,
  multiple,
  disabled,
  content,
  withFilesContent,
  onFiles,
  files,
}: IInputProps) {
  const input = (
    <input
      className="hidden"
      type="file"
      accept={accept}
      multiple={multiple}
      disabled={disabled}
      onChange={async (e) => {
        const target = e.target;
        const chosenFiles = await getFilesFromEvent(e);
        onFiles(chosenFiles);
        //@ts-ignore
        target.value = null;
      }}
    />
  );

  if (files.length > 0) {
    return (
      <label className="btn btn-primary self-start">
        {withFilesContent}
        {input}
      </label>
    );
  }

  return (
    <label className="flex flex-grow justify-center items-center text-2xl link">
      {content}
      {input}
    </label>
  );
}

import React, { useCallback, useEffect, useState } from "react";
import { AiOutlineFile, AiOutlineUpload } from "react-icons/ai";
import axios, { AxiosError, AxiosRequestConfig } from "axios";

import {
  Box,
  Button,
  CloseButton,
  Container,
  Flex,
  Heading,
  Icon,
  Image,
  ListItem,
  Progress,
  Text,
  Tooltip,
  UnorderedList,
} from "@chakra-ui/react";

import { DropzoneProps, FileRejection, FileWithPath, useDropzone } from "react-dropzone";

import { alertService } from "@Services/alert.service";

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
    errored: "red",
    finished: "green",
    starting: "blue",
    uploading: "blue",
  };

  return (
    <ListItem display="flex" flexDirection="row" position="relative" paddingY={4} width="full">
      {state === "finished" && preview ? (
        <Image
          width={24}
          height={24}
          alt={preview}
          src={`/images/${preview}`}
          fallback={<Icon as={AiOutlineFile} width={24} height={24} />}
        />
      ) : (
        <Icon as={AiOutlineFile} width={24} height={24} />
      )}

      <Flex align="center">
        <Flex direction="column" marginX={4} width={64}>
          <Text fontWeight="bold">{name}</Text>
          <Text fontWeight="bold">{percentage}</Text>
          <Progress hasStripe value={percentage} colorScheme={barColor[state]} />
        </Flex>

        {state === "finished" && (
          <Tooltip label="Remove file">
            <CloseButton aria-label="Remove file" size="md" onClick={remove} />
          </Tooltip>
        )}
      </Flex>
    </ListItem>
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
      const p: IPreviewProps[] = [];

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

        p.push(preview);
      });

      setPreviews(p);
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

    if (maxFiles !== undefined && maxFiles >= 0 && previews.length >= maxFiles) {
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
    <Container>
      <Flex direction="column">
        <Button {...getRootProps({ className: dropzoneClasses, disabled: disabled })} variant="outline">
          <input {...getInputProps({ disabled: disabled })} />
          <Text fontSize="xl" lineHeight={8}>
            {isDragActive ? "Drop files here" : "Drag files here or click to select"}
          </Text>
        </Button>

        {previews.length > 0 && (
          <Box marginTop={4}>
            <Heading as="h4" fontSize="lg">
              File Uploads
            </Heading>
            <UnorderedList display="flex" flexWrap="wrap" gap={4}>
              {previews.map((preview, idx) => (
                <Preview key={idx} {...preview} />
              ))}
            </UnorderedList>

            <Button
              leftIcon={<Icon as={AiOutlineUpload} />}
              variant="outline"
              marginTop={4}
              isLoading={!allFinished}
              onClick={() => {
                onUpload(files);
                setFiles([]);
                setPreviews([]);
              }}
            >
              Finish upload
            </Button>
          </Box>
        )}
      </Flex>
    </Container>
  );
};

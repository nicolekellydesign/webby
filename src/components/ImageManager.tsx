import React, { useState } from "react";

import {
  Box,
  Button,
  Heading,
  List,
  ListItem,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  Tooltip,
  useDisclosure,
} from "@chakra-ui/react";
import { CheckIcon, CloseIcon } from "@chakra-ui/icons";

import { Card, CardBody } from "@Components/Card";
import { Dropzone } from "@Components/Dropzone";
import "@Components/ImageManager.css";

interface IImageManagerProps extends Object {
  images?: string[];
  title: string;
  uploadFunc: (images: string[]) => void;
  deleteImages: (images: string[]) => void;
}

export const ImageManager: React.FC<IImageManagerProps> = ({ deleteImages, images, title, uploadFunc }) => {
  const [selected, setSelected] = useState<string[]>([]);
  const { isOpen, onOpen, onClose } = useDisclosure();

  const overlay = (image: string, selected: boolean) => (
    <Box
      borderRadius="1rem"
      position="relative"
      flex="1 1 0%"
      display="flex"
      flexDirection="column"
      justifyContent="center"
      verticalAlign="middle"
      overflow="hidden"
      transitionProperty="background-color, border-color, color, fill, stroke, opacity, box-shadow, transform, filter, backdrop-filter"
      transitionTimingFunction="cubic-bezier(0.4, 0, 0.2, 1)"
      transitionDuration="150ms"
      opacity={selected ? 0.7 : 0}
      backgroundColor={selected ? "black" : undefined}
      _hover={!selected ? { backgroundColor: "black", opacity: 0.7 } : undefined}
      onClick={() => {
        if (selected) {
          setSelected((selected) => selected.filter((name) => name !== image));
        } else {
          setSelected((selected) => selected.concat(image));
        }
      }}
    >
      <Tooltip label={selected ? "Unselect image" : "Select image"}>
        <Box
          boxSizing="border-box"
          display="flex"
          flexDirection="column"
          fontSize="lg"
          fontWeight="bold"
          marginX="auto"
          width="max-content"
        >
          <CheckIcon width="3rem" height="3rem" />
        </Box>
      </Tooltip>
    </Box>
  );

  return (
    <Card marginTop="2rem">
      <CardBody>
        <Heading as="h2" size="md">
          {title}
        </Heading>

        <List
          display="flex"
          borderRadius="1rem"
          maxWidth="72rem"
          maxHeight="20rem"
          gap="1rem"
          padding="1rem"
          className="image-scroller"
        >
          {images?.map((image, idx) => (
            <ListItem
              key={idx}
              boxSizing="content-box"
              display="flex"
              flex="none"
              borderRadius="1rem"
              backgroundImage={`url("/images/${image}")`}
              backgroundSize="cover"
              backgroundPosition="center"
              backgroundRepeat="no-repeat"
              cursor="pointer"
              justifyContent="center"
              width="12rem"
              height="12rem"
            >
              {overlay(
                image,
                selected.some((name) => name === image)
              )}
            </ListItem>
          ))}
        </List>

        {selected.length > 0 && (
          <Box marginTop="2rem">
            <Button onClick={onOpen} leftIcon={<CloseIcon />} colorScheme="red" variant="outline">
              Delete selected
            </Button>
            <Modal isOpen={isOpen} onClose={onClose} isCentered>
              <ModalOverlay />
              <ModalContent>
                <ModalHeader>Are you sure you want to delete these images?</ModalHeader>
                <ModalBody>
                  <Text>Images selected: {selected.length}</Text>
                  <Text>This action cannot be reversed.</Text>
                </ModalBody>
                <ModalFooter>
                  <Button onClick={onClose} marginRight="1rem" variant="outline">
                    Close
                  </Button>
                  <Button
                    onClick={() => {
                      deleteImages(selected);
                      setSelected([]);
                      onClose();
                    }}
                    colorScheme="red"
                    variant="outline"
                  >
                    Delete
                  </Button>
                </ModalFooter>
              </ModalContent>
            </Modal>
          </Box>
        )}

        <Box marginTop="2rem">
          <Dropzone
            onSubmit={(files) => {
              uploadFunc(files.flatMap((file) => file.name));
            }}
            accept="image/*"
            maxSize={8 * 1024 * 1024}
            multiple
          />
        </Box>
      </CardBody>
    </Card>
  );
};

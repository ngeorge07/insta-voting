import FileSelectInput from "./FileSelectInput";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, storage } from "../createFirebase";
import { Form, Formik, Field, FieldProps, FormikHelpers } from "formik";
import {
  Button,
  FormControl,
  FormLabel,
  FormErrorMessage,
  Select,
  Textarea,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalCloseButton,
  ModalBody,
  Text,
} from "@chakra-ui/react";
import { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { FormikActions } from "../types/FormikTypes";

export default function PostForm() {
  // inputKey is used to reset the input field after the form is submitted
  const [inputKey, setInputKey] = useState(Date.now());
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [fetchError, setFetchError] = useState("none");

  async function createPost(
    form_username: string,
    form_reason: string,
    images: FileList | undefined,
    actions: FormikHelpers<FormikActions>
  ) {
    let urls: string[] = [];

    if (images) {
      const imagesArray = Array.from(images);

      // Upload each image and get its download URL
      urls = await Promise.all(
        imagesArray.map(async (image) => {
          actions.setSubmitting(true);

          const imageName = `${uuidv4()}-${image.name}`;

          const imageRef = ref(storage, `images/${imageName}`);

          // Upload the image
          await uploadBytes(imageRef, image);

          // Get the download URL of the uploaded image
          return getDownloadURL(imageRef);
        })
      ).catch((error) => {
        console.error("Error uploading images:", error);

        // Reset file selector field
        actions.setSubmitting(false);
        setFetchError("image");

        return []; // Return an empty array in case of error
      });
    }

    // Add the document to the "posts" collection
    addDoc(collection(db, "posts"), {
      createdAt: serverTimestamp(),
      images: urls,
      text: form_reason,
      userToKick: form_username,
      counter: 0,
      votesUp: [],
      votesDown: [],
    })
      .then((docRef) => {
        console.log("Document written with ID: ", docRef.id);

        // Reset file selector field
        actions.setSubmitting(false);
        actions.setFieldValue("files", undefined);
        setInputKey(Date.now());

        // onOpen is a function that opens the modal
        onOpen();

        // Reset form values
        actions.resetForm();
      })
      .catch((e) => {
        console.error("Error adding document: ", e);
        actions.setSubmitting(false);
        setFetchError("document");
        onOpen();
      });
  }
  return (
    <>
      <Formik
        initialValues={{
          files: undefined,
          form_reason: "",
          form_username: "soopereni",
        }}
        onSubmit={(values, actions) => {
          actions.setSubmitting(false);

          createPost(
            values.form_username,
            values.form_reason,
            values.files,
            actions
          );
        }}
      >
        {(props) => (
          <Form className="w-full flex flex-col gap-6">
            <FormControl>
              <FormLabel>Cu cine ai beef?</FormLabel>
              <Select
                onChange={(event) => {
                  props.handleChange(event);
                }}
                name="form_username"
              >
                <option value="soopereni">soopereni</option>
                <option value="andrada.bonnie">andrada.bonnie</option>
                <option value="greenvali">greenvali</option>
              </Select>
            </FormControl>

            <Field
              name="form_reason"
              validate={() => {
                let error;
                if (!props.values.form_reason) {
                  error =
                    "Sa acuzi pe cineva fara motiv e ca si cum ai plesni un bebelus. Nu se face!";
                }
                return error;
              }}
            >
              {({ field, form }: FieldProps) => (
                <FormControl
                  isInvalid={
                    form.errors.form_reason && form.touched.form_reason
                      ? true
                      : false
                  }
                >
                  <FormLabel>Zi de la ce v-ati luat</FormLabel>
                  <Textarea
                    required
                    {...field}
                    placeholder="M-a injurat de mama"
                  />
                  <FormErrorMessage>
                    {typeof form.errors.form_reason === "string"
                      ? form.errors.form_reason
                      : ""}
                  </FormErrorMessage>
                </FormControl>
              )}
            </Field>

            <FileSelectInput inputKey={inputKey} />

            <Button
              type="submit"
              mt={4}
              colorScheme="teal"
              isLoading={props.isSubmitting}
              w="50%"
              alignSelf="center"
              isDisabled={
                props.isSubmitting ||
                !props.isValid ||
                props.values.form_reason === ""
              }
            >
              Submit
            </Button>
          </Form>
        )}
      </Formik>

      <Modal
        isOpen={isOpen}
        onClose={() => {
          setFetchError("none");
          onClose();
        }}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            {fetchError !== "none" ? "Tsaaaaa eroare ❌" : "Bravo 👏"}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text>
              {fetchError === "image"
                ? "Se pare ca s-a intamplat o nefacuta cu imaginile. Nu se stie ce, aia e. Textul s-a trimis cu succes, timite dovezile la fraieru care a facut siteul @georgenicolae_ si zi sa rezolve CA NU SE POATE TRAI ASA MA NENE!!!!!"
                : fetchError === "document"
                ? "Se pare ca s-a intamplat o nefacuta cu documentul. Nu se stie ce, aia e. Mai incearca o data si daca nu si nu trimtie plangere oficiala la @georgenicolae_"
                : "Felicitari, ai acuzat pe cineva cu succes. Sper sa dormi bine la noapte."}
            </Text>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={onClose}>
              Hai pa
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}

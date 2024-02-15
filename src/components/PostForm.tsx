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
} from "@chakra-ui/react";
import { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { FormikActions } from "../types/FormikTypes";

export default function PostForm() {
  // inputKey is used to reset the input field after the form is submitted
  const [inputKey, setInputKey] = useState(Date.now());

  console.log(inputKey);

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
        actions.setFieldValue("files", undefined);
        setInputKey(Date.now());

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
      })
      .catch((e) => {
        console.error("Error adding document: ", e);
      });
  }
  return (
    <Formik
      initialValues={{
        files: undefined,
        form_reason: "",
        form_username: "soopereni",
      }}
      onSubmit={(values, actions) => {
        actions.setSubmitting(false);

        // uploadImage(values, actions);
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

          <Field name="form_reason">
            {({ field }: FieldProps) => (
              <FormControl>
                <FormLabel>Zi de la ce v-ati luat</FormLabel>
                <Textarea
                  required
                  {...field}
                  placeholder="M-a injurat de mama"
                />
                <FormErrorMessage></FormErrorMessage>
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
            isDisabled={props.isSubmitting || !props.isValid}
          >
            Submit
          </Button>
        </Form>
      )}
    </Formik>
  );
}

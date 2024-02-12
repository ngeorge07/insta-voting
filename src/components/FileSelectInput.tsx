import {
  Input,
  FormControl,
  FormLabel,
  Button,
  FormErrorMessage,
} from "@chakra-ui/react";
import { Field, FieldProps, FormikProps, FormikHelpers } from "formik";
import { useState } from "react";
import { storage } from "../createFirebase";
import { ref, uploadBytes } from "firebase/storage";
import { v4 as uuidv4 } from "uuid";

export default function FileSelectInput({
  formProps,
}: {
  formProps: FormikProps<{ files: undefined }>;
}) {
  const [inputKey, setInputKey] = useState(Date.now());

  function uploadImage(
    values: { files: FileList | undefined },
    actions: FormikHelpers<{ files: undefined }>
  ) {
    if (values.files && values.files.length > 0) {
      actions.setSubmitting(true);
      const uploadPromises = Array.from(values.files).map(
        async (file, index) => {
          const imageRef = ref(storage, "images/" + `${uuidv4()}_${file.name}`);
          return uploadBytes(imageRef, file).then(() => {
            console.log(`Uploaded file ${index + 1}!`);
          });
        }
      );

      Promise.all(uploadPromises)
        .then(() => {
          console.log("All files uploaded");
          actions.setSubmitting(false);
          actions.setFieldValue("files", undefined);
          setInputKey(Date.now()); // Update the key to reset the input field
        })
        .catch((error) => {
          console.error("Error uploading files:", error);
          actions.setSubmitting(false);
        });
    }
  }

  function validateImageFile(files: FileList | undefined) {
    let error;
    if (
      files &&
      Array.from(files).some((file) => !file.type.startsWith("image/"))
    ) {
      error = "Invalid file type. Please upload an image file.";
    }

    return error;
  }

  return (
    <>
      <Field name="files" validate={validateImageFile}>
        {({ form }: FieldProps) => {
          return (
            <FormControl isInvalid={!!form.errors.files}>
              <FormLabel>File</FormLabel>
              <Input
                key={inputKey}
                type="file"
                accept="image/*"
                multiple
                required
                onChange={(event) => {
                  form.setFieldValue("files", event.target.files);
                }}
              />
              <FormErrorMessage>
                {typeof form.errors.files === "string" ? form.errors.files : ""}
              </FormErrorMessage>
            </FormControl>
          );
        }}
      </Field>

      <Button
        mt={4}
        colorScheme="teal"
        isLoading={formProps.isSubmitting}
        w="50%"
        alignSelf="center"
        onClick={() => {
          uploadImage(formProps.values, formProps);
        }}
        isDisabled={
          formProps.isSubmitting ||
          formProps.values.files === undefined ||
          !formProps.isValid
        }
      >
        Upload image
      </Button>
    </>
  );
}

import { Input, FormControl, FormLabel, Button } from "@chakra-ui/react";
import { Field, Form, Formik, FormikHelpers, FieldProps } from "formik";
import { signOut } from "firebase/auth";
import { auth } from "../createFirebase";
import { useState } from "react";
import { storage } from "../createFirebase";
import { ref, uploadBytes } from "firebase/storage";

export default function VotingSection() {
  // inputKey is used to reset the input field after the form is submitted
  const [inputKey, setInputKey] = useState(Date.now());

  function uploadImage(
    values: { files: FileList | undefined },
    actions: FormikHelpers<{ files: undefined }>
  ) {
    if (values.files) {
      const uploadPromises = Array.from(values.files).map(
        async (file, index) => {
          const imageRef = ref(storage, "images/" + file.name);
          return uploadBytes(imageRef, file).then(() => {
            console.log(`Uploaded file ${index + 1}!`);
          });
        }
      );

      Promise.all(uploadPromises)
        .then(() => {
          console.log("All files uploaded");
          actions.setSubmitting(false);
          setInputKey(Date.now()); // Update the key to reset the input field
        })
        .catch((error) => {
          console.error("Error uploading files:", error);
          actions.setSubmitting(false);
        });
    }
  }

  return (
    <div>
      <Formik
        initialValues={{ files: undefined }}
        onSubmit={(values, actions) => {
          uploadImage(values, actions);
        }}
      >
        {(props) => (
          <Form className="w-full flex flex-col">
            <Field name="file" validate={() => console.log("validated")}>
              {({ form }: FieldProps) => (
                <FormControl>
                  <FormLabel>File</FormLabel>
                  <Input
                    key={inputKey}
                    type="file"
                    multiple
                    required
                    onChange={(event) => {
                      form.setFieldValue("files", event.target.files);
                    }}
                  />
                </FormControl>
              )}
            </Field>

            <Button
              mt={4}
              colorScheme="teal"
              isLoading={props.isSubmitting}
              type="submit"
              w="50%"
              alignSelf="center"
              isDisabled={props.isSubmitting || !props.isValid}
            >
              Upload image
            </Button>
          </Form>
        )}
      </Formik>

      <Button
        onClick={() => {
          signOut(auth)
            .then(() => {
              console.log("Sign-out successful");
            })
            .catch((error) => {
              console.log(error);
            });
        }}
      >
        Sign out
      </Button>
    </div>
  );
}

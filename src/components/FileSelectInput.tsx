import {
  Input,
  FormControl,
  FormLabel,
  FormErrorMessage,
} from "@chakra-ui/react";
import { Field, FieldProps } from "formik";

export default function FileSelectInput({ inputKey }: { inputKey: number }) {
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
  );
}

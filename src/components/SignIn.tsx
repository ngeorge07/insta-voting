import { signInWithEmailAndPassword } from "firebase/auth";
import {
  Input,
  FormControl,
  FormLabel,
  FormErrorMessage,
  Button,
} from "@chakra-ui/react";
import { Field, Form, Formik, FieldProps } from "formik";
import { auth } from "../createFirebase";

export default function SignIn() {
  function validateEmail(value: string) {
    let error;
    if (!value) {
      error = "Email is required";
    }
    return error;
  }

  return (
    <Formik
      initialValues={{ email: "", password: "" }}
      onSubmit={(values, actions) => {
        actions.setSubmitting(false);
        signInWithEmailAndPassword(auth, values.email, values.password).catch(
          (error) => {
            console.log(error);
          }
        );
      }}
    >
      {(props) => (
        <Form className="w-full flex flex-col">
          <Field type="email" name="email" validate={validateEmail}>
            {({ field, form }: FieldProps) => (
              <FormControl
                isInvalid={!!(form.errors.email && form.touched.email)}
              >
                <FormLabel>Email</FormLabel>
                <Input required {...field} placeholder="username@insta.com" />
                <FormErrorMessage>
                  {typeof form.errors.email === "string"
                    ? form.errors.email
                    : ""}
                </FormErrorMessage>
              </FormControl>
            )}
          </Field>

          <Field name="password">
            {({ field, form }: FieldProps) => (
              <FormControl
                isInvalid={!!(form.errors.password && form.touched.password)}
              >
                <FormLabel mt={4}>Password</FormLabel>
                <Input
                  required
                  {...field}
                  type="password"
                  placeholder="password"
                />
                <FormErrorMessage>
                  {typeof form.errors.password === "string"
                    ? form.errors.password
                    : ""}
                </FormErrorMessage>
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
          >
            Submit
          </Button>
        </Form>
      )}
    </Formik>
  );
}

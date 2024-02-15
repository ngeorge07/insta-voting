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
  function validateValue(value: string, type: string) {
    let error;
    if (!value) {
      error = `${type} can't be empty`;
    } else if (
      type === "Email" &&
      !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(value)
    ) {
      error = "Invalid email address";
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
          <Field
            name="email"
            validate={(value: string) => validateValue(value, "Email")}
          >
            {({ field, form }: FieldProps) => (
              <FormControl
                isInvalid={
                  form.errors.email && form.touched.email ? true : false
                }
              >
                <FormLabel>Email</FormLabel>
                <Input
                  type="email"
                  required
                  {...field}
                  placeholder="username@insta.com"
                />
                <FormErrorMessage>
                  {typeof form.errors.email === "string"
                    ? form.errors.email
                    : ""}
                </FormErrorMessage>
              </FormControl>
            )}
          </Field>

          <Field
            name="password"
            validate={(value: string) => validateValue(value, "Password")}
          >
            {({ field, form }: FieldProps) => (
              <FormControl
                isInvalid={
                  form.errors.password && form.touched.password ? true : false
                }
              >
                <FormLabel mt={4}>Password</FormLabel>
                <Input {...field} type="password" placeholder="password" />
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
            isDisabled={
              props.values.email === "" ||
              props.values.password === "" ||
              props.isSubmitting ||
              !props.isValid
            }
          >
            Submit
          </Button>
        </Form>
      )}
    </Formik>
  );
}

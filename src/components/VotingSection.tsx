import { Form, Formik } from "formik";
import { signOut } from "firebase/auth";
import { auth } from "../createFirebase";
import { Button } from "@chakra-ui/react";
import FileSelectInput from "./FileSelectInput";

export default function VotingSection() {
  // inputKey is used to reset the input field after the form is submitted

  return (
    <div>
      <Formik
        initialValues={{ files: undefined }}
        onSubmit={() => {
          console.log("Submitted");
        }}
      >
        {(props) => (
          <Form className="w-full flex flex-col">
            <FileSelectInput formProps={props} />
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

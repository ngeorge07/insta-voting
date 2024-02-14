import { Form, Formik } from "formik";
import { signOut } from "firebase/auth";
import { auth } from "../createFirebase";
import { Button } from "@chakra-ui/react";
import FileSelectInput from "./FileSelectInput";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "../createFirebase";

export default function VotingSection() {
  async function createPost() {
    try {
      const docRef = await addDoc(collection(db, "posts"), {
        counter: 1,
        createdAt: serverTimestamp(),
        imageUrl:
          "https://firebasestorage.googleapis.com/v0/b/voting-insta.appspot.com/o/images%2Fcbefd4ba-ba8f-401f-ba15-c87c4c2ed1a8_Capture.PNG?alt=media&token=d1334809-4494-483b-a829-f3c4e413c704",
        text: "first first first",
        title: "dasdasasd",
        votesUp: [],
        votesDown: [],
      });

      console.log("Document written with ID: ", docRef.id);
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  }
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

      <Button onClick={() => createPost()}>Submit</Button>
    </div>
  );
}

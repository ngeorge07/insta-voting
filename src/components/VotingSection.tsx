import { signOut } from "firebase/auth";
import { auth } from "../createFirebase";
import { Button } from "@chakra-ui/react";
import PostForm from "./PostForm";

export default function VotingSection() {
  return (
    <div>
      <PostForm />

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

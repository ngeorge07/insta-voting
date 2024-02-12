import { Button } from "@chakra-ui/react";
import { signOut } from "firebase/auth";
import { auth } from "./createFirebase";

export default function VotingSection() {
  return (
    <div>
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

import { signOut } from "firebase/auth";
import { auth, db } from "../createFirebase";
import { Button } from "@chakra-ui/react";
import PostForm from "./PostForm";
import { collection, orderBy, query } from "firebase/firestore";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { Spinner } from "@chakra-ui/react";
import Post from "./Post";

export default function VotingSection() {
  const postsRef = collection(db, "posts");
  const q = query(postsRef, orderBy("createdAt"));
  const [posts, loading] = useCollectionData(q);
  console.log(posts);

  return (
    <>
      {loading ? (
        <Spinner
          thickness="4px"
          speed="0.65s"
          emptyColor="gray.200"
          color="blue.500"
          size="xl"
          mx="auto"
        />
      ) : (
        posts?.map(() => <Post />)
      )}

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
    </>
  );
}

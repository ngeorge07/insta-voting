import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "./createFirebase";
import SignIn from "./components/SignIn";
import VotingSection from "./components/VotingSection";
import { Spinner, Flex } from "@chakra-ui/react";
import Header from "./components/Header";
import "./index.css";

function App() {
  const [user, loading] = useAuthState(auth);

  return (
    <>
      <Header />

      <main>
        <Flex
          as="section"
          flexDirection="column"
          gap="10"
          align="center"
          maxW="md"
          w={["80%", 400, 600]}
          mx="auto"
        >
          {loading ? (
            <Spinner
              thickness="4px"
              speed="0.65s"
              emptyColor="gray.200"
              color="blue.500"
              size="xl"
              mx="auto"
            />
          ) : user ? (
            <VotingSection />
          ) : (
            <SignIn />
          )}
        </Flex>
      </main>
    </>
  );
}

export default App;

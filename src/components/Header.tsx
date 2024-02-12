import { Heading } from "@chakra-ui/react";
import { useColorMode, Button } from "@chakra-ui/react";
import { SunIcon, MoonIcon } from "@chakra-ui/icons";

export default function Header() {
  const { colorMode, toggleColorMode } = useColorMode();

  return (
    <header className="my-8 flex justify-center items-center gap-6 mx-auto max-w-[80%] sm:max-w-full sm:mx-0">
      <Heading as="h1" size="xl">
        Inalta Curte de Justitie Maria Ungii
      </Heading>

      <Button onClick={toggleColorMode}>
        {colorMode === "light" ? <MoonIcon /> : <SunIcon />}
      </Button>
    </header>
  );
}

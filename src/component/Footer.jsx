import {Box, Stack, Text, VStack } from "@chakra-ui/react";
import React from "react";

const Footer = () => {
  return (
    <Box
      bgColor={"#191c29"}
      color={"whiteAlpha.700"}
      minH={"48"}
      px={"16"}
      py={["16", "8"]}
    >
      <Stack direction={["column", "row"]} h={"full"} alignItems={"center"}>
        <VStack w={"full"} alignItems={["center", "flex-start"]}>
          <Text fontWeight={"bold"}>About Us</Text>
          <Text
            fontSize={"sm"}
            letterSpacing={"widest"}
            textAlign={["center", "left"]}
          >
            Just a normal College Students Works on Projects.
          </Text>
          <Text fontWeight={"bold"} textAlign={"center"} justifyContent={"center"}>Made with Love 😍</Text>
        </VStack>
      </Stack>
    </Box>
  );
};

export default Footer;
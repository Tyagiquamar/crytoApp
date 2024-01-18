import {
  Box,
  RadioGroup,
} from "@chakra-ui/react";
import React, { useState, useEffect } from 'react'
import axios from "axios"
import { server } from "../index"
import { Container, HStack, VStack, Text, Image, Radio, } from '@chakra-ui/react';
import ErrorComponent from './ErrorComponent';
import btcSrc from "../assests/crypto.png";
import CoindataCard from "./CoindataCard";
import { motion } from "framer-motion";


const Home = () => {
  const [cryptodata, setCryptodata] = useState([]);
  const [error, setError] = useState(false);
  const [datacurrency, setDatacurrency] = useState("inr");

  const currencySymbol =
    datacurrency === "inr" ? "₹" : datacurrency === "eur" ? "€" : "$";

  useEffect(() => {
    const fetchCoinData = async () => {
      try {
        const { data } = await axios.get(`${server}/search/trending`);
        console.log(data);
        setCryptodata(data);
      } catch (error) {
        setError(true);
      }
    }
    fetchCoinData();
  }, []);
  if (error)
    return <ErrorComponent message={"Error While Fetching "} />;

  return (
    <Container bgColor={"#000119"} maxW={"container.xl"} >
      <VStack spacing={"100"} align={"stretch"}>
        <Box alignItems={"center"} justifyContent={"center"} w={"full"} h={"100px"}>
          <Text textAlign={"center"} bgGradient={"linear(to-l, #7928CA, #FF0080)"} bgClip={"text"} fontSize={"6xl"} fontWeight={"extrabold"}>
            Cryptocurrency in
            Every Wallet
          </Text>
        </Box>
        <Box w={"full"} h={"50vh"} alignItems={"center"} justifyContent={"center"} mb={"90px"} >
          <motion.div
            style={{
              height: "60vh",
            }}
            animate={{
              translateX: "100px",
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              repeatType: "reverse",
            }}
          >
            <Image
              w={"full"}
              h={"full"}
              objectFit={"contain"}
              src={btcSrc}
            />
          </motion.div>
        </Box>
        <Box alignItems={"center"} justifyContent={"center"} w={"full"} h={"100px"}>
          <Text
            fontSize={"7xl"}
            textAlign={"center"}
            fontWeight={"bold"}
            color={"white"}
          >
            Let's Buy Crypto...
          </Text>
        </Box>
        <Box alignItems={"center"} justifyContent={"center"} w={"full"} h={"100px"}>
          <Text
            fontSize={"4xl"}
            textAlign={"center"}
            fontWeight={"bold"}
            bgClip={"text"}
            bgGradient={"linear(to-l, #7928CA, #FF0080)"}
          >
            Securly Buy, Sell, Store, Send and Track
          </Text>
        </Box>
        {/* <RadioGroup value={datacurrency} onChange={setDatacurrency} p={"8"} textColor={"white"} height={"100px"}>
          <HStack spacing={"10"}>
            <Radio value={"inr"}>INR</Radio>
            <Radio value={"usd"}>USD</Radio>
            <Radio value={"eur"}>EUR</Radio>
          </HStack>
        </RadioGroup> */}

        {/* <HStack wrap={"wrap"} justifyContent={"space-evenly"}>
          {cryptodata.map(i=>{
            return(
            <CoindataCard
              id={i.id}
              key={i.id}
              name={i.name}
              price={i.current_price}
              img={i.image}
              symbol={i.symbol}
              currencySymbol={currencySymbol}
            />
          )})}
        </HStack> */}

        <Box width={"full"} alignItems={"center"} justifyContent={"center"} h={"100px"}>
          <HStack alignItems={"center"} justifyContent={"center"}>
            <Text
              fontSize={"4xl"}
              textAlign={"center"}
              fontWeight={"bold"}
              color={"white"}
            >
              Jump start your crypto portfolio
            </Text>
          </HStack>
        </Box>

      </VStack>
    </Container>
  );
};

export default Home;


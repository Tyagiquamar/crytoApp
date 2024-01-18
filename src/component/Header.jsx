import { Box, Button, HStack } from '@chakra-ui/react'
import React from 'react'
import { Link } from 'react-router-dom'

function Header() {
  return (
    <Box bgColor={"#061020"} width={"full"} display={"flex"} alignItems={"center"} justifyContent={"center"}>
      <HStack p={"6"} shadow={"base"}  >
        <Button variant={"outline"} color={"white"} height={"45px"} width={"100px"}>
          <Link to="/">Home</Link>
        </Button>
      </HStack>
      <HStack p={"6"} shadow={"base"} >
        <Button variant={"outline"} color={"white"} height={"45px"} width={"100px"} >
          <Link to="/exchange">Exchange</Link>
        </Button>
      </HStack>
      <HStack p={"6"} shadow={"base"} >
        <Button variant={"outline"} color={"white"} height={"45px"} width={"100px"} >
          <Link to="/coin">Coin</Link>
        </Button>
      </HStack>

    </Box>
    

  )
}

export default Header


/**
 * CoinDetails Component
 * 
 * A React component that displays detailed information about a cryptocurrency
 * Including price charts, market data, and trading statistics
 * 
 * Key Features:
 * - Lazy loading for better performance
 * - Custom hooks for data fetching
 * - Memoization of components and calculations
 * - Real-time currency conversion
 */

// Lazy loading allows us to split our code into smaller chunks
// Components are only loaded when they're needed, improving initial page load time
import React, { useEffect, useState, lazy, Suspense } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import {
  Badge,
  Box,
  Button,
  Container,
  HStack,
  Image,
  Progress,
  Radio,
  RadioGroup,
  Stat,
  StatArrow,
  StatHelpText,
  StatLabel,
  StatNumber,
  Text,
  VStack,
} from "@chakra-ui/react";
import { server } from "../index";

// Lazy loaded components
// React.lazy takes a function that must call import() and returns a Promise
// This Promise must resolve to a module with a default export containing a React component
const Chart = lazy(() => import("./Chart"));
const ErrorComponent = lazy(() => import("./ErrorComponent"));
const Loader = lazy(() => import("./Loader"));

/**
 * Custom hook for fetching and managing coin data
 * Separates data fetching logic from component logic (Separation of Concerns)
 * 
 * @param {string} id - The coin identifier
 * @param {string} currency - Selected currency (inr/usd/eur)
 * @param {string} days - Time period for chart data
 * @returns {Object} Object containing coin data, loading state, error state, and chart data
 */
const useCoinData = (id, currency, days) => {
  const [coin, setCoin] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [chartArray, setChartArray] = useState([]);

  useEffect(() => {
    const fetchCoin = async () => {
      try {
        // Using Promise.all for parallel API calls
        // This is more efficient than sequential calls
        const [coinData, chartData] = await Promise.all([
          axios.get(`${server}/coins/${id}`),
          axios.get(`${server}/coins/${id}/market_chart?vs_currency=${currency}&days=${days}`)
        ]);

        setCoin(coinData.data);
        setChartArray(chartData.data.prices);
        setLoading(false);
      } catch (error) {
        setError(true);
        setLoading(false);
      }
    };
    fetchCoin();
  }, [id, currency, days]); // Dependencies for useEffect

  return { coin, loading, error, chartArray };
};

/**
 * Item Component
 * Displays a single statistic with title and value
 * Memoized to prevent unnecessary re-renders
 * 
 * @param {string} title - Label for the statistic
 * @param {string|number} value - Value of the statistic
 */
const Item = React.memo(({ title, value }) => (
  <HStack justifyContent={"space-between"} w={"full"} my={"4"}>
    <Text fontFamily={"Bebas Neue"} letterSpacing={"widest"}>
      {title}
    </Text>
    <Text>{value}</Text>
  </HStack>
), (prevProps, nextProps) => {
  // Custom comparison function for memo
  // Only re-render if title or value has changed
  return prevProps.title === nextProps.title && prevProps.value === nextProps.value;
});

/**
 * CustomBar Component
 * Displays a progress bar with high and low values
 * Memoized to prevent unnecessary re-renders
 * 
 * @param {string} high - Highest value in the range
 * @param {string} low - Lowest value in the range
 */
const CustomBar = React.memo(({ high, low }) => (
  <VStack w={"full"}>
    <Progress value={50} colorScheme={"teal"} w={"full"} />
    <HStack justifyContent={"space-between"} w={"full"}>
      <Badge children={low} colorScheme={"red"} />
      <Text fontSize={"sm"}>24H Range</Text>
      <Badge children={high} colorScheme={"green"} />
    </HStack>
  </VStack>
));

/**
 * Main CoinDetails Component
 * Displays comprehensive information about a cryptocurrency
 * Uses lazy loading and memoization for optimal performance
 */
const CoinDetails = () => {
  // Get coin ID from URL parameters
  const params = useParams();
  
  // State management for user selections
  const [currency, setCurrency] = useState("inr");
  const [days, setDays] = useState("24h");

  // Custom hook for data fetching
  const { coin, loading, error, chartArray } = useCoinData(params.id, currency, days);

  // Memoize currency symbol calculation to prevent unnecessary recalculations
  const currencySymbol = React.useMemo(() => 
    currency === "inr" ? "₹" : currency === "eur" ? "€" : "$"
  , [currency]);

  // Time period options for chart
  const btns = ["24h", "7d", "14d", "30d", "60d", "200d", "1y", "max"];

  // Memoized function to handle chart time period changes
  const switchChartStats = React.useCallback((key) => {
    const daysMap = {
      "24h": "24h",
      "7d": "7d",
      "14d": "14d",
      "30d": "30d",
      "60d": "60d",
      "200d": "200d",
      "1y": "365d",
      "max": "max"
    };
    setDays(daysMap[key] || "24h");
  }, []);

  // Error handling
  if (error) {
    return (
      <Suspense fallback={<div>Loading error component...</div>}>
        <ErrorComponent message={"Error While Fetching Coin"} />
      </Suspense>
    );
  }

  return (
    <Container maxW={"container.xl"}>
      {/* Suspense wrapper for lazy-loaded components */}
      <Suspense fallback={<div>Loading...</div>}>
        {loading ? (
          <Loader />
        ) : (
          <>
            {/* Chart Section */}
            <Box width={"900"} borderWidth={1} alignItems={"center"} justifyContent={"center"}>
              <Suspense fallback={<div>Loading chart...</div>}>
                <Chart arr={chartArray} currency={currencySymbol} days={days} />
              </Suspense>
            </Box>

            {/* Time Period Selection */}
            <HStack p="4" overflowX={"auto"}>
              {btns.map((i) => (
                <Button
                  disabled={days === i}
                  key={i}
                  onClick={() => switchChartStats(i)}
                >
                  {i}
                </Button>
              ))}
            </HStack>

            {/* Currency Selection */}
            <Box w={"full"} p="4" bgColor={"#ecf3f7"} borderRadius={"20px"} alignItems={"center"} justifyContent={"center"}>
              <RadioGroup value={currency} onChange={setCurrency} p={"8"}>
                <HStack spacing={"4"}>
                  <Radio value={"inr"}>INR</Radio>
                  <Radio value={"usd"}>USD</Radio>
                  <Radio value={"eur"}>EUR</Radio>
                </HStack>
              </RadioGroup>
            </Box>

            {/* Coin Information Section */}
            <VStack spacing={"4"} p="16" alignItems={"flex-start"}>
              {/* Last Updated Information */}
              <Text fontSize={"small"} alignSelf="center" opacity={0.7}>
                Last Updated On{" "}
                {Date(coin.market_data?.last_updated).split("G")[0]}
              </Text>

              {/* Coin Image */}
              <Image
                src={coin.image?.large}
                w={"16"}
                h={"16"}
                objectFit={"contain"}
              />
              
              {/* Price Statistics */}
              <Stat>
                <StatLabel>{coin.name}</StatLabel>
                <StatNumber>
                  {currencySymbol}
                  {coin.market_data?.current_price[currency]}
                </StatNumber>
                <StatHelpText>
                  <StatArrow
                    type={
                      coin.market_data?.price_change_percentage_24h > 0
                        ? "increase"
                        : "decrease"
                    }
                  />
                  {coin.market_data?.price_change_percentage_24h}%
                </StatHelpText>
              </Stat>

              {/* Market Cap Rank */}
              <Badge
                fontSize={"2xl"}
                bgColor={"blackAlpha.800"}
                color={"white"}
              >{`#${coin.market_cap_rank}`}</Badge>

              {/* Price Range Bar */}
              <CustomBar
                high={`${currencySymbol}${coin.market_data?.high_24h[currency]}`}
                low={`${currencySymbol}${coin.market_data?.low_24h[currency]}`}
              />

              {/* Market Data */}
              <Box w={"full"} p="4" bgColor={"#ecf3f7"} borderRadius={"20px"}>
                <Item title={"Max Supply"} value={coin.market_data?.max_supply} />
                <Item
                  title={"Circulating Supply"}
                  value={coin.market_data?.circulating_supply}
                />
                <Item
                  title={"Market Cap"}
                  value={`${currencySymbol}${coin.market_data?.market_cap[currency]}`}
                />
                <Item
                  title={"All Time Low"}
                  value={`${currencySymbol}${coin.market_data?.atl[currency]}`}
                />
                <Item
                  title={"All Time High"}
                  value={`${currencySymbol}${coin.market_data?.ath[currency]}`}
                />
              </Box>
            </VStack>
          </>
        )}
      </Suspense>
    </Container>
  );
};

// Export memoized version of the component
export default React.memo(CoinDetails);

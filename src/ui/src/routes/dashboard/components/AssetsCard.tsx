import { Box, Flex, Img, Text } from '@chakra-ui/react';
import { ethers } from 'ethers';
import { useEffect, useState } from 'react';
import { Card, CardHeader } from '../../../components/Card';
import Loading from '../../../components/Loading';
import { usePool } from '../../../hooks/usePool';
import { BalancesReponse, getBalances } from '../../../services/covalentServices';

export const AssetsCard = () => {
  const { pool } = usePool();
  const [isLoading, setIsLoading] = useState(true);
  const [balances, setBalances] = useState<BalancesReponse[]>([]);

  useEffect(() => {
    if (pool) {
      getBalances(pool.id).then((balances) => {
        setBalances(balances ?? []);
        setIsLoading(false);
      });
    }
  }, [pool]);

  return (
    <Card p="28px 10px 16px 0px" mb={{ sm: '26px', lg: '0px' }}>
      <CardHeader mb="20px" pl="22px">
        <Flex direction="column" alignSelf="flex-start">
          <Text fontSize="lg" fontWeight="bold" mb="6px">
            Assets
          </Text>
        </Flex>
      </CardHeader>
      <Box w="100%" h={{ sm: '300px' }} ps="8px">
        {isLoading ? (
          <Loading />
        ) : (
          balances.map((balance, index) => {
            return (
              <Flex key={index} justifyContent="space-between" px={2} mb={4}>
                <Flex alignItems="center" gap={2}>
                  <Img w="30px" h="30px" src={balance.logo_url} />
                  <Text fontSize={{ sm: 'md', md: 'lg', lg: 'md' }} fontWeight="bold">
                    {balance.contract_ticker_symbol}
                  </Text>
                </Flex>

                <Flex direction="column" alignItems="end">
                  <Text align="end" fontSize={{ sm: 'md', md: 'lg', lg: 'md' }} fontWeight="bold">
                    { (+ethers.utils.formatUnits(balance.balance, balance.contract_decimals)).toPrecision(5)}
                  </Text>

                  <Text
                    fontSize={{ sm: 'xs', md: 'sm', lg: 'xs' }}
                    color="gray.400"
                    fontWeight="semibold"
                  >
                    $ {balance.quote} 
                  </Text>
                </Flex>
              </Flex>
            );
          })
        )}
      </Box>
    </Card>
  );
};
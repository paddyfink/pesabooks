import {
  Button,
  Flex,
  Heading,
  Spacer,
  Stack,
  Text,
  useColorModeValue,
  useToast
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useWeb3Auth } from '../../hooks/useWeb3Auth';
import { acceptInvitation, getInvitation } from '../../services/invitationService';
import { Invitation } from '../../types';

export const InvitationPage = () => {
  const [loading, setLoading] = useState(false);
  let location = useLocation();
  let navigate = useNavigate();
  let {isAuthenticated} = useWeb3Auth();
  let { invitation_id } = useParams();
  const [invitation, setInvitation] = useState<Invitation | undefined>();
  const toast = useToast();

  useEffect(() => {
    if (invitation_id) getInvitation(invitation_id).then(setInvitation);
  }, [invitation_id]);

  const onJoin = async () => {
    setLoading(true);
    if (invitation) {
      try {
        await acceptInvitation(invitation.id);
        toast({
          title: 'You have joined the group',
          status: 'success',
          isClosable: true,
        });
        setLoading(false);
        navigate(`/pool/${invitation.pool_id}`);
      } catch (error) {
        setLoading(false);
      }
    }
  };

  return (
    <>
      <Helmet>
        <title>Invitation</title>
      </Helmet>

      <Stack
        spacing={8}
        mx={'auto'}
        maxW={'lg'}
        py={12}
        px={6}
        bg={useColorModeValue('white', 'gray.700')}
      >
        <Stack spacing={4}>
          <Heading fontSize={'2xl'}>
            {' '}
            Join{' '}
            <Text as="span" color={'red'}>
              {invitation?.pool_name}
            </Text>{' '}
            on Pesabooks
          </Heading>
          <Text>
            {invitation?.invited_by} has invited you to join the tontine{' '}
            <b>{invitation?.pool_name}</b>.
          </Text>
        </Stack>

        {!isAuthenticated && (
          <Stack>
            <Text mt={4}>
              {' '}
              To continue, you must either login to your existing account, or create a new one
            </Text>

            <Flex gap={4}>
              <Button
                onClick={() =>
                  navigate(
                    `/auth/signup?returnUrl=${location.pathname}&email=${invitation?.email}&name=${invitation?.name}`,
                  )
                }
              >
                Create a new account
              </Button>
              <Spacer />
              <Button
                onClick={() =>
                  navigate(`/auth/signin?returnUrl=${location.pathname}&email=${invitation?.email}`)
                }
              >
                {' '}
                Login as an Existing User
              </Button>
            </Flex>
          </Stack>
        )}

        {isAuthenticated && (
          <Stack align="center">
            <Button onClick={() => onJoin()} isLoading={loading}>
              Join Now
            </Button>
          </Stack>
        )}
      </Stack>
    </>
  );
};

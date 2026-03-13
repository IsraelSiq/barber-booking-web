import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Box, Button, FormControl, FormLabel, Heading,
  Input, Text, VStack, useToast, Flex, Image
} from '@chakra-ui/react';
import { api } from '../api';
import logoAlafy from '../assets/logo-alafy.png';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [enviado, setEnviado] = useState(false);
  const toast = useToast();

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    const data = await api.post('/auth/forgot-password', { email });
    setLoading(false);
    if (data.detail) {
      toast({ title: data.detail, status: 'error', duration: 3000, isClosable: true, position: 'top' });
    } else {
      setEnviado(true);
    }
  }

  return (
    <Box minH="100vh" bg="#0a0a0a" display="flex" alignItems="center" justifyContent="center" p={4}>
      <Box
        bg="linear-gradient(135deg, rgba(255,214,0,0.08), transparent)"
        borderRadius="3xl"
        w="full"
        maxW="420px"
        p="1px"
      >
        <Box
          bg="#0a0a0a"
          borderRadius="3xl"
          p={{ base: 6, md: 8 }}
          boxShadow="0 0 40px rgba(0,0,0,0.85)"
          border="1px solid #262626"
        >
          <VStack spacing={6}>
            <Flex direction="column" align="center" textAlign="center">
              <Image
                src={logoAlafy}
                alt="Alafy Barber"
                boxSize={{ base: '72px', md: '88px' }}
                mb={3}
                objectFit="contain"
              />
              <Heading size="md" color="white" letterSpacing="wide">
                Esqueceu sua senha?
              </Heading>
            </Flex>

          {enviado ? (
            <VStack spacing={4} w="full">
              <Box bg="#141414" border="1px solid #ffd600" borderRadius="xl" p={4} w="full">
                <Text color="brand.500" fontWeight="bold" mb={1}>Instruções enviadas</Text>
                <Text color="gray.400" fontSize="sm">
                  Se o email estiver cadastrado, você receberá as instruções para redefinir sua senha.
                </Text>
              </Box>
              <Button
                as={Link}
                to="/login"
                variant="outline"
                w="full"
                size="lg"
                borderRadius="full"
                borderColor="brand.500"
                color="brand.500"
                _hover={{ bg: 'brand.500', color: 'black', boxShadow: '0 0 18px rgba(255,214,0,0.4)' }}
              >
                Voltar ao login
              </Button>
            </VStack>
          ) : (
            <>
              <Text color="gray.400" fontSize="sm" textAlign="center">
                Informe seu email e enviaremos as instruções para redefinir sua senha.
              </Text>
              <VStack as="form" onSubmit={handleSubmit} spacing={4} w="full">
                <FormControl isRequired>
                  <FormLabel color="gray.400" fontSize="sm">Email</FormLabel>
                  <Input type="email" value={email} onChange={e => setEmail(e.target.value)}
                    bg="#141414"
                    border="1px solid #333"
                    color="white"
                    _focus={{
                      borderColor: 'brand.500',
                      boxShadow: '0 0 0 1px #ffd600, 0 0 12px rgba(255,214,0,0.35)'
                    }}
                    _hover={{ borderColor: '#555' }}
                    _placeholder={{ color: 'gray.600' }}
                    placeholder="seu@email.com"
                    size="lg"
                    transition="all 0.2s ease"
                  />
                </FormControl>
                <Button
                  type="submit"
                  bg="brand.500"
                  color="black"
                  size="lg"
                  w="full"
                  isLoading={loading}
                  loadingText="Enviando..."
                  mt={2}
                  borderRadius="full"
                  _hover={{
                    bg: 'brand.400',
                    boxShadow: '0 0 18px rgba(255,214,0,0.4)',
                    transform: 'translateY(-1px)'
                  }}
                  _active={{ bg: 'brand.600', transform: 'translateY(0)' }}
                  transition="all 0.2s ease"
                >
                  Enviar instruções
                </Button>
                <Text color="gray.500" fontSize="sm">
                  Lembrou a senha?{' '}
                  <Box
                    as={Link}
                    to="/login"
                    color="brand.500"
                    fontWeight="semibold"
                    _hover={{ textDecoration: 'underline', color: 'yellow.300' }}
                  >
                    Entrar
                  </Box>
                </Text>
              </VStack>
            </>
          )}
        </VStack>
        </Box>
      </Box>
    </Box>
  );
}

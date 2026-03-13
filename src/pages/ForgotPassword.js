import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Box, Button, FormControl, FormLabel, Heading,
  Input, Text, VStack, useToast
} from '@chakra-ui/react';
import { api } from '../api';

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
      <Box bg="#1a1a1a" p={8} borderRadius="2xl" w="full" maxW="400px"
        boxShadow="0 0 40px rgba(255,214,0,0.15)" border="1px solid #333">
        <VStack spacing={6}>
          <Text fontSize="4xl">🔑</Text>
          <Heading size="lg" color="brand.500" letterSpacing="wide">ESQUECI A SENHA</Heading>
          {enviado ? (
            <VStack spacing={4} w="full">
              <Box bg="#242424" border="1px solid #ffd600" borderRadius="lg" p={4} w="full">
                <Text color="brand.500" fontWeight="bold" mb={1}>Instruções enviadas!</Text>
                <Text color="gray.400" fontSize="sm">
                  Se o email estiver cadastrado, você receberá as instruções para redefinir sua senha.
                </Text>
              </Box>
              <Button as={Link} to="/login" variant="outline" colorScheme="yellow" w="full" size="lg">
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
                    bg="#242424" border="1px solid #333" color="white"
                    _focus={{ borderColor: 'brand.500', boxShadow: '0 0 0 1px #ffd600' }}
                    _hover={{ borderColor: '#555' }} placeholder="seu@email.com" size="lg" />
                </FormControl>
                <Button type="submit" bg="brand.500" color="black" size="lg" w="full"
                  isLoading={loading} loadingText="Enviando..."
                  _hover={{ bg: 'brand.400' }} _active={{ bg: 'brand.600' }} mt={2}>
                  Enviar instruções
                </Button>
                <Text color="gray.500" fontSize="sm">
                  Lembrou a senha?{' '}
                  <Box as={Link} to="/login" color="brand.500" fontWeight="bold">Entrar</Box>
                </Text>
              </VStack>
            </>
          )}
        </VStack>
      </Box>
    </Box>
  );
}

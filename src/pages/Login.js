import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Box, Button, FormControl, FormLabel, Heading,
  Input, Text, VStack, useToast, Icon
} from '@chakra-ui/react';
import { api } from '../api';

export default function Login() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const toast = useToast();

  function extrairErro(data) {
    if (!data.detail) return 'Erro ao fazer login.';
    if (typeof data.detail === 'string') return data.detail;
    if (Array.isArray(data.detail)) return data.detail.map(e => e.msg).join(', ');
    return 'Erro desconhecido.';
  }

  async function handleLogin(e) {
    e.preventDefault();
    setLoading(true);
    const data = await api.postForm('/auth/login', { username: email, password: senha });
    setLoading(false);
    if (data.access_token) {
      localStorage.setItem('token', data.access_token);
      navigate('/agendamento');
    } else {
      toast({ title: extrairErro(data), status: 'error', duration: 3000, isClosable: true, position: 'top' });
    }
  }

  return (
    <Box minH="100vh" bg="gray.900" display="flex" alignItems="center" justifyContent="center" p={4}>
      <Box bg="gray.800" p={8} borderRadius="2xl" w="full" maxW="400px" boxShadow="2xl">
        <VStack spacing={6}>
          <Heading size="lg" color="red.400">✂️ Barber Booking</Heading>
          <Heading size="md" color="gray.300" fontWeight="normal">Entrar na sua conta</Heading>
          <VStack as="form" onSubmit={handleLogin} spacing={4} w="full">
            <FormControl isRequired>
              <FormLabel color="gray.400" fontSize="sm">Email</FormLabel>
              <Input
                type="email" value={email} onChange={e => setEmail(e.target.value)}
                bg="gray.700" border="none" _focus={{ ring: 2, ringColor: 'red.400' }}
                placeholder="seu@email.com" size="lg"
              />
            </FormControl>
            <FormControl isRequired>
              <FormLabel color="gray.400" fontSize="sm">Senha</FormLabel>
              <Input
                type="password" value={senha} onChange={e => setSenha(e.target.value)}
                bg="gray.700" border="none" _focus={{ ring: 2, ringColor: 'red.400' }}
                placeholder="••••••••" size="lg"
              />
            </FormControl>
            <Button type="submit" colorScheme="red" size="lg" w="full" isLoading={loading} loadingText="Entrando...">
              Entrar
            </Button>
          </VStack>
          <Text color="gray.500" fontSize="sm">
            Não tem conta?{' '}
            <Box as={Link} to="/cadastro" color="red.400" fontWeight="bold">Cadastre-se</Box>
          </Text>
        </VStack>
      </Box>
    </Box>
  );
}

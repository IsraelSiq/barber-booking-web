import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Box, Button, FormControl, FormLabel, Heading,
  Input, Text, VStack, useToast
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
      // Busca role do usuário para redirecionar
      const me = await api.get('/auth/me', data.access_token);
      if (me.role === 'admin') {
        navigate('/barbeiro');
      } else {
        navigate('/inicio');
      }
    } else {
      toast({ title: extrairErro(data), status: 'error', duration: 3000, isClosable: true, position: 'top' });
    }
  }

  return (
    <Box minH="100vh" bg="#0a0a0a" display="flex" alignItems="center" justifyContent="center" p={4}>
      <Box bg="#1a1a1a" p={8} borderRadius="2xl" w="full" maxW="400px" boxShadow="0 0 40px rgba(255,214,0,0.15)" border="1px solid #333">
        <VStack spacing={6}>
          <Text fontSize="4xl">✂️</Text>
          <Heading size="lg" color="brand.500" letterSpacing="wide">BARBER BOOKING</Heading>
          <Heading size="sm" color="gray.400" fontWeight="normal">Entre na sua conta</Heading>
          <VStack as="form" onSubmit={handleLogin} spacing={4} w="full">
            <FormControl isRequired>
              <FormLabel color="gray.400" fontSize="sm">Email</FormLabel>
              <Input type="email" value={email} onChange={e => setEmail(e.target.value)}
                bg="#242424" border="1px solid #333" color="white"
                _focus={{ borderColor: 'brand.500', boxShadow: '0 0 0 1px #ffd600' }}
                _hover={{ borderColor: '#555' }} placeholder="seu@email.com" size="lg" />
            </FormControl>
            <FormControl isRequired>
              <FormLabel color="gray.400" fontSize="sm">Senha</FormLabel>
              <Input type="password" value={senha} onChange={e => setSenha(e.target.value)}
                bg="#242424" border="1px solid #333" color="white"
                _focus={{ borderColor: 'brand.500', boxShadow: '0 0 0 1px #ffd600' }}
                _hover={{ borderColor: '#555' }} placeholder="••••••••" size="lg" />
            </FormControl>
            <Button type="submit" bg="brand.500" color="black" size="lg" w="full"
              isLoading={loading} loadingText="Entrando..."
              _hover={{ bg: 'brand.400' }} _active={{ bg: 'brand.600' }} mt={2}>
              Entrar
            </Button>
          </VStack>
          <Text color="gray.500" fontSize="sm">
            Não tem conta?{' '}
            <Box as={Link} to="/cadastro" color="brand.500" fontWeight="bold">Cadastre-se</Box>
          </Text>
        </VStack>
      </Box>
    </Box>
  );
}

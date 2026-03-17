import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Box, Button, FormControl, FormLabel, Heading,
  Input, Text, VStack, useToast, Flex, Image, Divider
} from '@chakra-ui/react';
import { useGoogleLogin } from '@react-oauth/google';
import { api } from '../api';
import logoAlafy from '../assets/logo-alafy.png';

function GoogleIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 48 48">
      <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
      <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
      <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
      <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
    </svg>
  );
}

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
      if (data.precisa_redefinir) { navigate('/redefinir-senha'); return; }
      const me = await api.get('/auth/me', data.access_token);
      if (me.role === 'admin') navigate('/barbeiro');
      else navigate('/inicio');
    } else {
      toast({ title: extrairErro(data), status: 'error', duration: 3000, isClosable: true, position: 'top' });
    }
  }

  const googleLogin = useGoogleLogin({
    flow: 'implicit',
    onSuccess: async (tokenResponse) => {
      // Busca o id_token via userinfo e manda o access_token pro back validar
      try {
        const userInfo = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
          headers: { Authorization: `Bearer ${tokenResponse.access_token}` }
        }).then(r => r.json());

        const data = await api.post('/auth/google-token', {
          access_token: tokenResponse.access_token,
          email: userInfo.email,
          nome: userInfo.name,
          google_id: userInfo.sub
        });

        if (data.access_token) {
          localStorage.setItem('token', data.access_token);
          const me = await api.get('/auth/me', data.access_token);
          if (me.role === 'admin') navigate('/barbeiro');
          else navigate('/inicio');
        } else {
          toast({ title: extrairErro(data), status: 'error', duration: 3000, isClosable: true, position: 'top' });
        }
      } catch {
        toast({ title: 'Falha ao entrar com Google.', status: 'error', duration: 3000, isClosable: true, position: 'top' });
      }
    },
    onError: () => toast({ title: 'Falha ao entrar com Google.', status: 'error', duration: 3000, isClosable: true, position: 'top' }),
  });

  return (
    <Box minH="100vh" bg="#0a0a0a" display="flex" alignItems="center" justifyContent="center" p={4}>
      <Box bg="linear-gradient(135deg, rgba(255,214,0,0.08), transparent)" borderRadius="3xl" w="full" maxW="420px" p="1px">
        <Box bg="#0a0a0a" borderRadius="3xl" p={{ base: 6, md: 8 }} boxShadow="0 0 40px rgba(0,0,0,0.85)" border="1px solid #262626">
          <VStack spacing={6} align="stretch">

            <Flex direction="column" align="center" textAlign="center">
              <Image src={logoAlafy} alt="Alafy Barber" boxSize={{ base: '72px', md: '88px' }} mb={4} objectFit="contain" />
              <Heading size="lg" color="white" letterSpacing="wide">Bem-vindo de volta</Heading>
              <Text color="gray.500" fontSize="sm" mt={2}>Acesse sua conta para gerenciar seus agendamentos.</Text>
            </Flex>

            <Button
              onClick={() => googleLogin()}
              w="full" h={14}
              bg="#ffffff" color="#3c4043"
              borderRadius="full"
              border="1px solid #dadce0"
              fontWeight="600" fontSize="md"
              leftIcon={<GoogleIcon />}
              _hover={{ bg: '#f8f9fa', boxShadow: '0 4px 16px rgba(0,0,0,0.3)', transform: 'translateY(-1px)' }}
              _active={{ bg: '#f1f3f4', transform: 'translateY(0)' }}
              transition="all 0.2s ease"
            >
              Entrar com Google
            </Button>

            <Flex align="center" gap={3}>
              <Divider borderColor="#333" />
              <Text color="gray.600" fontSize="xs" whiteSpace="nowrap">ou entre com email</Text>
              <Divider borderColor="#333" />
            </Flex>

            <VStack as="form" onSubmit={handleLogin} spacing={4} w="full">
              <FormControl isRequired>
                <FormLabel color="gray.400" fontSize="sm">Email</FormLabel>
                <Input type="email" value={email} onChange={e => setEmail(e.target.value)}
                  bg="#141414" border="1px solid #333" color="white"
                  _focus={{ borderColor: 'brand.500', boxShadow: '0 0 0 1px #ffd600, 0 0 12px rgba(255,214,0,0.35)' }}
                  _hover={{ borderColor: '#555' }} _placeholder={{ color: 'gray.600' }}
                  placeholder="seu@email.com" size="lg" transition="all 0.2s ease"
                />
              </FormControl>
              <FormControl isRequired>
                <FormLabel color="gray.400" fontSize="sm">Senha</FormLabel>
                <Input type="password" value={senha} onChange={e => setSenha(e.target.value)}
                  bg="#141414" border="1px solid #333" color="white"
                  _focus={{ borderColor: 'brand.500', boxShadow: '0 0 0 1px #ffd600, 0 0 12px rgba(255,214,0,0.35)' }}
                  _hover={{ borderColor: '#555' }} _placeholder={{ color: 'gray.600' }}
                  placeholder="Sua senha" size="lg" transition="all 0.2s ease"
                />
              </FormControl>
              <Button
                type="submit" bg="brand.500" color="black" size="lg" w="full"
                isLoading={loading} loadingText="Entrando..." mt={2} borderRadius="full"
                _hover={{ bg: 'brand.400', boxShadow: '0 0 18px rgba(255,214,0,0.4)', transform: 'translateY(-1px)' }}
                _active={{ bg: 'brand.600', transform: 'translateY(0)' }}
                transition="all 0.2s ease"
              >
                Entrar
              </Button>
            </VStack>

            <VStack spacing={3} pt={2} align="stretch">
              <Text color="gray.500" fontSize="sm" textAlign="center">
                Esqueceu a senha?{' '}
                <Box as={Link} to="/forgot-password" color="brand.500" fontWeight="semibold"
                  _hover={{ textDecoration: 'underline', color: 'yellow.300' }}>Recuperar acesso</Box>
              </Text>
              <Text color="gray.500" fontSize="sm" textAlign="center">
                Ainda não tem conta?{' '}
                <Box as={Link} to="/cadastro" color="brand.500" fontWeight="semibold"
                  _hover={{ textDecoration: 'underline', color: 'yellow.300' }}>Criar cadastro</Box>
              </Text>
            </VStack>

          </VStack>
        </Box>
      </Box>
    </Box>
  );
}

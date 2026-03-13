import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import {
  Box, Button, FormControl, FormLabel, Heading,
  Input, Text, VStack, useToast, Spinner
} from '@chakra-ui/react';
import { api } from '../api';

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const [novaSenha, setNovaSenha] = useState('');
  const [confirmar, setConfirmar] = useState('');
  const [loading, setLoading] = useState(false);
  const [validando, setValidando] = useState(true);
  const [tokenValido, setTokenValido] = useState(false);
  const [sucesso, setSucesso] = useState(false);
  const navigate = useNavigate();
  const toast = useToast();

  useEffect(() => {
    async function validarToken() {
      if (!token) { setValidando(false); return; }
      const data = await api.get(`/auth/reset-password?token=${token}`);
      setTokenValido(!!data.valid);
      setValidando(false);
    }
    validarToken();
  }, [token]);

  async function handleSubmit(e) {
    e.preventDefault();
    if (novaSenha !== confirmar) {
      toast({ title: 'As senhas não coincidem.', status: 'error', duration: 3000, isClosable: true, position: 'top' });
      return;
    }
    if (novaSenha.length < 6) {
      toast({ title: 'A senha deve ter pelo menos 6 caracteres.', status: 'error', duration: 3000, isClosable: true, position: 'top' });
      return;
    }
    setLoading(true);
    const data = await api.post('/auth/reset-password', { token, nova_senha: novaSenha });
    setLoading(false);
    if (data.detail) {
      toast({ title: typeof data.detail === 'string' ? data.detail : 'Erro ao redefinir senha.', status: 'error', duration: 3000, isClosable: true, position: 'top' });
    } else {
      setSucesso(true);
      setTimeout(() => navigate('/login'), 3000);
    }
  }

  if (validando) {
    return (
      <Box minH="100vh" bg="#0a0a0a" display="flex" alignItems="center" justifyContent="center">
        <Spinner color="brand.500" size="xl" />
      </Box>
    );
  }

  return (
    <Box minH="100vh" bg="#0a0a0a" display="flex" alignItems="center" justifyContent="center" p={4}>
      <Box bg="#1a1a1a" p={8} borderRadius="2xl" w="full" maxW="400px"
        boxShadow="0 0 40px rgba(255,214,0,0.15)" border="1px solid #333">
        <VStack spacing={6}>
          <Text fontSize="4xl">🔒</Text>
          <Heading size="lg" color="brand.500" letterSpacing="wide">NOVA SENHA</Heading>
          {!tokenValido ? (
            <VStack spacing={4} w="full">
              <Box bg="#242424" border="1px solid #e53e3e" borderRadius="lg" p={4} w="full">
                <Text color="red.400" fontWeight="bold" mb={1}>Link inválido ou expirado</Text>
                <Text color="gray.400" fontSize="sm">Este link de redefinição de senha não é mais válido. Solicite um novo.</Text>
              </Box>
              <Button as={Link} to="/forgot-password" bg="brand.500" color="black" w="full" size="lg"
                _hover={{ bg: 'brand.400' }}>
                Solicitar novo link
              </Button>
            </VStack>
          ) : sucesso ? (
            <VStack spacing={4} w="full">
              <Box bg="#242424" border="1px solid #38a169" borderRadius="lg" p={4} w="full">
                <Text color="green.400" fontWeight="bold" mb={1}>Senha redefinida! ✅</Text>
                <Text color="gray.400" fontSize="sm">Você será redirecionado para o login em instantes...</Text>
              </Box>
            </VStack>
          ) : (
            <VStack as="form" onSubmit={handleSubmit} spacing={4} w="full">
              <FormControl isRequired>
                <FormLabel color="gray.400" fontSize="sm">Nova senha</FormLabel>
                <Input type="password" value={novaSenha} onChange={e => setNovaSenha(e.target.value)}
                  bg="#242424" border="1px solid #333" color="white"
                  _focus={{ borderColor: 'brand.500', boxShadow: '0 0 0 1px #ffd600' }}
                  _hover={{ borderColor: '#555' }} placeholder="Mínimo 6 caracteres" size="lg" />
              </FormControl>
              <FormControl isRequired>
                <FormLabel color="gray.400" fontSize="sm">Confirmar nova senha</FormLabel>
                <Input type="password" value={confirmar} onChange={e => setConfirmar(e.target.value)}
                  bg="#242424" border="1px solid #333" color="white"
                  _focus={{ borderColor: 'brand.500', boxShadow: '0 0 0 1px #ffd600' }}
                  _hover={{ borderColor: '#555' }} placeholder="Repita a senha" size="lg" />
              </FormControl>
              <Button type="submit" bg="brand.500" color="black" size="lg" w="full"
                isLoading={loading} loadingText="Salvando..."
                _hover={{ bg: 'brand.400' }} _active={{ bg: 'brand.600' }} mt={2}>
                Salvar nova senha
              </Button>
            </VStack>
          )}
        </VStack>
      </Box>
    </Box>
  );
}

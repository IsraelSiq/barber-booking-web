import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box, Button, FormControl, FormLabel, Heading,
  Input, Text, VStack, useToast
} from '@chakra-ui/react';
import { api } from '../api';

export default function RedefinirSenha() {
  const [novaSenha, setNovaSenha] = useState('');
  const [confirmar, setConfirmar] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const toast = useToast();
  const token = localStorage.getItem('token');

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
    const data = await api.post('/auth/redefinir-senha', { nova_senha: novaSenha }, token);
    setLoading(false);
    if (data.detail) {
      toast({ title: typeof data.detail === 'string' ? data.detail : 'Erro ao redefinir senha.', status: 'error', duration: 3000, isClosable: true, position: 'top' });
    } else {
      toast({ title: 'Senha redefinida com sucesso!', status: 'success', duration: 3000, isClosable: true, position: 'top' });
      const me = await api.get('/auth/me', token);
      if (me.role === 'admin') navigate('/barbeiro');
      else navigate('/inicio');
    }
  }

  return (
    <Box minH="100vh" bg="#0a0a0a" display="flex" alignItems="center" justifyContent="center" p={4}>
      <Box bg="#1a1a1a" p={8} borderRadius="2xl" w="full" maxW="400px"
        boxShadow="0 0 40px rgba(255,214,0,0.15)" border="1px solid #333">
        <VStack spacing={6}>
          <Text fontSize="4xl">🔐</Text>
          <Heading size="lg" color="brand.500" letterSpacing="wide">CRIE SUA SENHA</Heading>
          <Box bg="#242424" border="1px solid #ffd600" borderRadius="lg" p={4} w="full">
            <Text color="brand.500" fontWeight="bold" fontSize="sm" mb={1}>⚠️ Ação necessária</Text>
            <Text color="gray.400" fontSize="sm">
              Sua senha foi redefinida pelo administrador. Por favor, crie uma nova senha para continuar.
            </Text>
          </Box>
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
        </VStack>
      </Box>
    </Box>
  );
}

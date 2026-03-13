import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box, Button, FormControl, FormLabel, Heading,
  Input, Text, VStack, useToast, Flex
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
              <Box
                mb={3}
                borderRadius="full"
                border="1px solid rgba(255,214,0,0.5)"
                px={4}
                py={1}
                fontSize="xs"
                letterSpacing="0.18em"
                textTransform="uppercase"
                color="gray.400"
              >
                Atualização obrigatória
              </Box>
              <Heading size="md" color="white" letterSpacing="wide">
                Crie sua nova senha
              </Heading>
            </Flex>
          <Box bg="#141414" border="1px solid #ffd600" borderRadius="xl" p={4} w="full">
            <Text color="brand.500" fontWeight="bold" fontSize="sm" mb={1}>Ação necessária</Text>
            <Text color="gray.400" fontSize="sm">
              Sua senha foi redefinida pelo administrador. Por favor, crie uma nova senha para continuar.
            </Text>
          </Box>
          <VStack as="form" onSubmit={handleSubmit} spacing={4} w="full">
            <FormControl isRequired>
              <FormLabel color="gray.400" fontSize="sm">Nova senha</FormLabel>
              <Input type="password" value={novaSenha} onChange={e => setNovaSenha(e.target.value)}
                bg="#141414"
                border="1px solid #333"
                color="white"
                _focus={{
                  borderColor: 'brand.500',
                  boxShadow: '0 0 0 1px #ffd600, 0 0 12px rgba(255,214,0,0.35)'
                }}
                _hover={{ borderColor: '#555' }}
                _placeholder={{ color: 'gray.600' }}
                placeholder="Mínimo 6 caracteres"
                size="lg"
                transition="all 0.2s ease"
              />
            </FormControl>
            <FormControl isRequired>
              <FormLabel color="gray.400" fontSize="sm">Confirmar nova senha</FormLabel>
              <Input type="password" value={confirmar} onChange={e => setConfirmar(e.target.value)}
                bg="#141414"
                border="1px solid #333"
                color="white"
                _focus={{
                  borderColor: 'brand.500',
                  boxShadow: '0 0 0 1px #ffd600, 0 0 12px rgba(255,214,0,0.35)'
                }}
                _hover={{ borderColor: '#555' }}
                _placeholder={{ color: 'gray.600' }}
                placeholder="Repita a senha"
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
              loadingText="Salvando..."
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
              Salvar nova senha
            </Button>
          </VStack>
        </VStack>
        </Box>
      </Box>
    </Box>
  );
}

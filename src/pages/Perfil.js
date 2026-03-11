import React, { useEffect, useState } from 'react';
import {
  Box, Button, FormControl, FormLabel, Heading,
  Input, Spinner, Text, VStack, useToast, Flex
} from '@chakra-ui/react';
import { api } from '../api';
import Navbar from '../components/Navbar';

export default function Perfil() {
  const [usuario, setUsuario] = useState(null);
  const [form, setForm] = useState({ nome: '', telefone: '' });
  const [salvando, setSalvando] = useState(false);
  const token = localStorage.getItem('token');
  const toast = useToast();

  useEffect(() => {
    async function carregar() {
      const u = await api.get('/auth/me', token);
      setUsuario(u);
      setForm({ nome: u.nome, telefone: u.telefone });
    }
    carregar();
  }, []);

  async function handleSalvar(e) {
    e.preventDefault();
    setSalvando(true);
    const data = await api.put('/auth/me', form, token);
    setSalvando(false);
    if (data.id) {
      toast({ title: 'Dados atualizados!', status: 'success', duration: 2000, position: 'top' });
      setUsuario(data);
    } else {
      toast({ title: data.detail || 'Erro ao salvar.', status: 'error', duration: 3000, position: 'top' });
    }
  }

  const inputStyle = {
    bg: '#242424', border: '1px solid #333', color: 'white', size: 'lg',
    _focus: { borderColor: 'brand.500' }, _hover: { borderColor: '#555' }
  };

  if (!usuario) return <Flex minH="100vh" bg="#0a0a0a" align="center" justify="center"><Spinner color="brand.500" size="xl" /></Flex>;

  return (
    <Box minH="100vh" bg="#0a0a0a" p={4}>
      <Box maxW="520px" mx="auto">
        <Navbar />
        <Box bg="#1a1a1a" borderRadius="2xl" p={6} border="1px solid #333" boxShadow="0 0 40px rgba(255,214,0,0.1)">
          <Heading size="md" color="white" mb={6}>Meu Perfil</Heading>
          <VStack as="form" onSubmit={handleSalvar} spacing={4}>
            <FormControl isRequired>
              <FormLabel color="gray.400" fontSize="sm">Nome</FormLabel>
              <Input value={form.nome} onChange={e => setForm({ ...form, nome: e.target.value })} {...inputStyle} />
            </FormControl>
            <FormControl isRequired>
              <FormLabel color="gray.400" fontSize="sm">Telefone</FormLabel>
              <Input value={form.telefone} onChange={e => setForm({ ...form, telefone: e.target.value })} {...inputStyle} />
            </FormControl>
            <FormControl>
              <FormLabel color="gray.400" fontSize="sm">Email</FormLabel>
              <Input value={usuario.email} isReadOnly bg="#1a1a1a" border="1px solid #222" color="gray.500" size="lg" />
            </FormControl>
            <Button type="submit" bg="brand.500" color="black" w="full" size="lg"
              isLoading={salvando} loadingText="Salvando..." _hover={{ bg: 'brand.400' }} mt={2}>
              Salvar Alterações
            </Button>
          </VStack>
        </Box>
      </Box>
    </Box>
  );
}

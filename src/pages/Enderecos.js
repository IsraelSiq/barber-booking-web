import React, { useEffect, useState } from 'react';
import {
  Box, Button, Flex, FormControl, FormLabel,
  Heading, Input, Spinner, Text, VStack, useToast, HStack, SimpleGrid
} from '@chakra-ui/react';
import { api } from '../api';
import Navbar from '../components/Navbar';

export default function Enderecos() {
  const [enderecos, setEnderecos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ apelido: '', rua: '', numero: '', bairro: '', cidade: '', complemento: '' });
  const [salvando, setSalvando] = useState(false);
  const token = localStorage.getItem('token');
  const toast = useToast();

  useEffect(() => { carregar(); }, []);

  async function carregar() {
    const data = await api.get('/enderecos/', token);
    setEnderecos(Array.isArray(data) ? data : []);
    setLoading(false);
  }

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSalvar(e) {
    e.preventDefault();
    setSalvando(true);
    const data = await api.post('/enderecos/', form, token);
    setSalvando(false);
    if (data.id) {
      toast({ title: 'Endereço salvo!', status: 'success', duration: 2000, position: 'top' });
      setForm({ apelido: '', rua: '', numero: '', bairro: '', cidade: '', complemento: '' });
      carregar();
    } else {
      toast({ title: data.detail || 'Erro ao salvar.', status: 'error', duration: 3000, position: 'top' });
    }
  }

  async function handleDeletar(id) {
    if (!window.confirm('Remover este endereço?')) return;
    await api.delete(`/enderecos/${id}`, token);
    toast({ title: 'Endereço removido.', status: 'info', duration: 2000, position: 'top' });
    carregar();
  }

  const inputStyle = {
    bg: '#242424', border: '1px solid #333', color: 'white', size: 'md',
    _focus: { borderColor: 'brand.500' }, _hover: { borderColor: '#555' }
  };

  return (
    <Box minH="100vh" bg="#0a0a0a" p={4}>
      <Box maxW="520px" mx="auto">
        <Navbar />
        <VStack spacing={6} align="stretch">

          {/* Formulário */}
          <Box bg="#1a1a1a" borderRadius="2xl" p={6} border="1px solid #333" boxShadow="0 0 40px rgba(255,214,0,0.1)">
            <Heading size="md" color="white" mb={5}>Adicionar Endereço</Heading>
            <VStack as="form" onSubmit={handleSalvar} spacing={3}>
              <FormControl isRequired>
                <FormLabel color="gray.400" fontSize="sm">Apelido</FormLabel>
                <Input name="apelido" placeholder="Ex: Casa, Trabalho" value={form.apelido} onChange={handleChange} {...inputStyle} />
              </FormControl>
              <SimpleGrid columns={2} spacing={3} w="full">
                <FormControl isRequired>
                  <FormLabel color="gray.400" fontSize="sm">Rua</FormLabel>
                  <Input name="rua" placeholder="Rua das Flores" value={form.rua} onChange={handleChange} {...inputStyle} />
                </FormControl>
                <FormControl isRequired>
                  <FormLabel color="gray.400" fontSize="sm">Número</FormLabel>
                  <Input name="numero" placeholder="123" value={form.numero} onChange={handleChange} {...inputStyle} />
                </FormControl>
              </SimpleGrid>
              <SimpleGrid columns={2} spacing={3} w="full">
                <FormControl isRequired>
                  <FormLabel color="gray.400" fontSize="sm">Bairro</FormLabel>
                  <Input name="bairro" placeholder="Centro" value={form.bairro} onChange={handleChange} {...inputStyle} />
                </FormControl>
                <FormControl isRequired>
                  <FormLabel color="gray.400" fontSize="sm">Cidade</FormLabel>
                  <Input name="cidade" placeholder="Maricá" value={form.cidade} onChange={handleChange} {...inputStyle} />
                </FormControl>
              </SimpleGrid>
              <FormControl>
                <FormLabel color="gray.400" fontSize="sm">Complemento</FormLabel>
                <Input name="complemento" placeholder="Apto 201, Bloco B..." value={form.complemento} onChange={handleChange} {...inputStyle} />
              </FormControl>
              <Button type="submit" bg="brand.500" color="black" w="full" isLoading={salvando}
                loadingText="Salvando..." _hover={{ bg: 'brand.400' }} mt={2}>
                Salvar Endereço
              </Button>
            </VStack>
          </Box>

          {/* Lista */}
          <Box bg="#1a1a1a" borderRadius="2xl" p={6} border="1px solid #333">
            <Heading size="md" color="white" mb={5}>Meus Endereços</Heading>
            {loading && <Flex justify="center"><Spinner color="brand.500" /></Flex>}
            {!loading && enderecos.length === 0 && (
              <Text color="gray.500" textAlign="center">Nenhum endereço cadastrado.</Text>
            )}
            <VStack spacing={3}>
              {enderecos.map(e => (
                <Flex key={e.id} w="full" bg="#242424" borderRadius="xl" p={4}
                  justify="space-between" align="center" border="1px solid #333">
                  <Box>
                    <Text fontWeight="bold" color="brand.500">{e.apelido}</Text>
                    <Text color="gray.300" fontSize="sm">{e.rua}, {e.numero}</Text>
                    <Text color="gray.500" fontSize="xs">{e.bairro} — {e.cidade}{e.complemento ? ` — ${e.complemento}` : ''}</Text>
                  </Box>
                  <Button size="sm" variant="outline" borderColor="red.500" color="red.400"
                    _hover={{ bg: 'red.500', color: 'white' }}
                    onClick={() => handleDeletar(e.id)}>Remover</Button>
                </Flex>
              ))}
            </VStack>
          </Box>
        </VStack>
      </Box>
    </Box>
  );
}

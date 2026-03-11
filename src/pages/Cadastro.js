import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Box, Button, FormControl, FormLabel, Heading,
  Input, Text, VStack, useToast
} from '@chakra-ui/react';
import { api } from '../api';

export default function Cadastro() {
  const [form, setForm] = useState({ nome: '', email: '', telefone: '', senha: '' });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const toast = useToast();

  function extrairErro(data) {
    if (!data.detail) return 'Erro ao cadastrar.';
    if (typeof data.detail === 'string') return data.detail;
    if (Array.isArray(data.detail)) return data.detail.map(e => e.msg).join(', ');
    return 'Erro desconhecido.';
  }

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleCadastro(e) {
    e.preventDefault();
    setLoading(true);
    const data = await api.post('/auth/register', form);
    setLoading(false);
    if (data.id) {
      toast({ title: 'Conta criada com sucesso!', status: 'success', duration: 3000, isClosable: true, position: 'top' });
      navigate('/login');
    } else {
      toast({ title: extrairErro(data), status: 'error', duration: 3000, isClosable: true, position: 'top' });
    }
  }

  return (
    <Box minH="100vh" bg="gray.900" display="flex" alignItems="center" justifyContent="center" p={4}>
      <Box bg="gray.800" p={8} borderRadius="2xl" w="full" maxW="400px" boxShadow="2xl">
        <VStack spacing={6}>
          <Heading size="lg" color="red.400">✂️ Barber Booking</Heading>
          <Heading size="md" color="gray.300" fontWeight="normal">Criar conta</Heading>
          <VStack as="form" onSubmit={handleCadastro} spacing={4} w="full">
            <FormControl isRequired>
              <FormLabel color="gray.400" fontSize="sm">Nome</FormLabel>
              <Input name="nome" value={form.nome} onChange={handleChange} bg="gray.700" border="none" placeholder="Seu nome" size="lg" />
            </FormControl>
            <FormControl isRequired>
              <FormLabel color="gray.400" fontSize="sm">Email</FormLabel>
              <Input name="email" type="email" value={form.email} onChange={handleChange} bg="gray.700" border="none" placeholder="seu@email.com" size="lg" />
            </FormControl>
            <FormControl isRequired>
              <FormLabel color="gray.400" fontSize="sm">Telefone</FormLabel>
              <Input name="telefone" value={form.telefone} onChange={handleChange} bg="gray.700" border="none" placeholder="(21) 99999-9999" size="lg" />
            </FormControl>
            <FormControl isRequired>
              <FormLabel color="gray.400" fontSize="sm">Senha</FormLabel>
              <Input name="senha" type="password" value={form.senha} onChange={handleChange} bg="gray.700" border="none" placeholder="••••••••" size="lg" />
            </FormControl>
            <Button type="submit" colorScheme="red" size="lg" w="full" isLoading={loading} loadingText="Criando conta...">
              Criar conta
            </Button>
          </VStack>
          <Text color="gray.500" fontSize="sm">
            Já tem conta?{' '}
            <Box as={Link} to="/login" color="red.400" fontWeight="bold">Entrar</Box>
          </Text>
        </VStack>
      </Box>
    </Box>
  );
}

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
      toast({ title: 'Conta criada! Faça login.', status: 'success', duration: 3000, isClosable: true, position: 'top' });
      navigate('/login');
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
          <Heading size="sm" color="gray.400" fontWeight="normal">Criar conta</Heading>
          <VStack as="form" onSubmit={handleCadastro} spacing={4} w="full">
            {[{ label: 'Nome', name: 'nome', type: 'text', ph: 'Seu nome' },
              { label: 'Email', name: 'email', type: 'email', ph: 'seu@email.com' },
              { label: 'Telefone', name: 'telefone', type: 'text', ph: '(21) 99999-9999' },
              { label: 'Senha', name: 'senha', type: 'password', ph: '••••••••' }
            ].map(f => (
              <FormControl key={f.name} isRequired>
                <FormLabel color="gray.400" fontSize="sm">{f.label}</FormLabel>
                <Input
                  name={f.name} type={f.type} value={form[f.name]} onChange={handleChange}
                  bg="#242424" border="1px solid #333" color="white" placeholder={f.ph} size="lg"
                  _focus={{ borderColor: 'brand.500', boxShadow: '0 0 0 1px #ffd600' }}
                  _hover={{ borderColor: '#555' }}
                />
              </FormControl>
            ))}
            <Button type="submit" bg="brand.500" color="black" size="lg" w="full"
              isLoading={loading} loadingText="Criando..." _hover={{ bg: 'brand.400' }} mt={2}>
              Criar conta
            </Button>
          </VStack>
          <Text color="gray.500" fontSize="sm">
            Já tem conta?{' '}
            <Box as={Link} to="/login" color="brand.500" fontWeight="bold">Entrar</Box>
          </Text>
        </VStack>
      </Box>
    </Box>
  );
}

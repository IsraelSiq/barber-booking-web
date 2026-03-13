import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Box, Button, FormControl, FormLabel, Heading,
  Input, Text, VStack, useToast, Flex, Image
} from '@chakra-ui/react';
import { api } from '../api';
import logoAlafy from '../assets/logo-alafy.png';

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
          <VStack spacing={6} align="stretch">
            <Flex direction="column" align="center" textAlign="center">
              <Image
                src={logoAlafy}
                alt="Alafy Barber"
                boxSize={{ base: '72px', md: '88px' }}
                mb={4}
                objectFit="contain"
              />
              <Heading size="lg" color="white" letterSpacing="wide">
                Criar conta
              </Heading>
              <Text color="gray.500" fontSize="sm" mt={2}>
                Cadastre-se para agendar seus horários com facilidade.
              </Text>
            </Flex>

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
                  bg="#141414"
                  border="1px solid #333"
                  color="white"
                  placeholder={f.ph}
                  size="lg"
                  _focus={{
                    borderColor: 'brand.500',
                    boxShadow: '0 0 0 1px #ffd600, 0 0 12px rgba(255,214,0,0.35)'
                  }}
                  _hover={{ borderColor: '#555' }}
                  _placeholder={{ color: 'gray.600' }}
                  transition="all 0.2s ease"
                />
              </FormControl>
            ))}
            <Button
              type="submit"
              bg="brand.500"
              color="black"
              size="lg"
              w="full"
              isLoading={loading}
              loadingText="Criando..."
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
              Criar conta
            </Button>
          </VStack>

          <VStack spacing={3} pt={4}>
            <Text color="gray.500" fontSize="sm" textAlign="center">
              Já tem conta?{' '}
              <Box
                as={Link}
                to="/login"
                color="brand.500"
                fontWeight="semibold"
                _hover={{ textDecoration: 'underline', color: 'yellow.300' }}
              >
                Entrar
              </Box>
            </Text>
          </VStack>
        </VStack>
        </Box>
      </Box>
    </Box>
  );
}

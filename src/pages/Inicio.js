import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Box, Button, Flex, Heading, HStack, Spinner,
  Stat, StatLabel, StatNumber, Text, VStack
} from '@chakra-ui/react';
import { api } from '../api';
import Navbar from '../components/Navbar';

export default function Inicio() {
  const [usuario, setUsuario] = useState(null);
  const [agendamentos, setAgendamentos] = useState([]);
  const [enderecos, setEnderecos] = useState([]);
  const token = localStorage.getItem('token');

  useEffect(() => {
    async function carregar() {
      const [u, a, e] = await Promise.all([
        api.get('/auth/me', token),
        api.get('/agendamentos/meus', token),
        api.get('/enderecos/', token),
      ]);
      setUsuario(u);
      setAgendamentos(Array.isArray(a) ? a : []);
      setEnderecos(Array.isArray(e) ? e : []);
    }
    carregar();
  }, []);

  const confirmados = agendamentos.filter(a => a.status === 'confirmado').length;

  if (!usuario) return <Flex minH="100vh" bg="#0a0a0a" align="center" justify="center"><Spinner color="brand.500" size="xl" /></Flex>;

  return (
    <Box minH="100vh" bg="#0a0a0a" p={4}>
      <Box maxW="520px" mx="auto">
        <Navbar />
        <VStack spacing={6} align="stretch">
          {/* Boas vindas */}
          <Box bg="#1a1a1a" borderRadius="2xl" p={6} border="1px solid #333" boxShadow="0 0 40px rgba(255,214,0,0.1)">
            <Text fontSize="sm" color="gray.500" mb={1}>Bem-vindo de volta,</Text>
            <Heading size="xl" color="brand.500">{usuario.nome} 👋</Heading>
            <Text color="gray.400" mt={2} fontSize="sm">{usuario.email}</Text>
          </Box>

          {/* Stats */}
          <HStack spacing={4}>
            <Box flex={1} bg="#1a1a1a" borderRadius="xl" p={4} border="1px solid #333" textAlign="center">
              <Stat>
                <StatNumber color="brand.500" fontSize="2xl">{confirmados}</StatNumber>
                <StatLabel color="gray.400" fontSize="xs">Agendamentos ativos</StatLabel>
              </Stat>
            </Box>
            <Box flex={1} bg="#1a1a1a" borderRadius="xl" p={4} border="1px solid #333" textAlign="center">
              <Stat>
                <StatNumber color="brand.500" fontSize="2xl">{enderecos.length}</StatNumber>
                <StatLabel color="gray.400" fontSize="xs">Endereços salvos</StatLabel>
              </Stat>
            </Box>
          </HStack>

          {/* Alerta sem endereço */}
          {enderecos.length === 0 && (
            <Box bg="#2a1f00" border="1px solid #ffd600" borderRadius="xl" p={4}>
              <Text color="brand.500" fontWeight="bold" fontSize="sm">⚠️ Você ainda não tem endereço salvo!</Text>
              <Text color="gray.400" fontSize="sm" mt={1}>Adicione um endereço antes de agendar.</Text>
              <Button as={Link} to="/enderecos" size="sm" bg="brand.500" color="black" mt={3}
                _hover={{ bg: 'brand.400' }}>Adicionar endereço</Button>
            </Box>
          )}

          {/* Ações rápidas */}
          <Box bg="#1a1a1a" borderRadius="2xl" p={6} border="1px solid #333">
            <Text color="gray.400" fontSize="sm" mb={4}>Ações rápidas</Text>
            <VStack spacing={3}>
              <Button as={Link} to="/agendamento" w="full" bg="brand.500" color="black"
                _hover={{ bg: 'brand.400' }} isDisabled={enderecos.length === 0}>
                📅 Novo Agendamento
              </Button>
              <Button as={Link} to="/meus" w="full" variant="outline" borderColor="#444" color="gray.300"
                _hover={{ borderColor: 'brand.500', color: 'brand.500' }}>
                🗓️ Meus Agendamentos
              </Button>
              <Button as={Link} to="/enderecos" w="full" variant="outline" borderColor="#444" color="gray.300"
                _hover={{ borderColor: 'brand.500', color: 'brand.500' }}>
                📍 Gerenciar Endereços
              </Button>
            </VStack>
          </Box>
        </VStack>
      </Box>
    </Box>
  );
}

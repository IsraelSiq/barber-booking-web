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
          <Box
            bg="#0a0a0a"
            borderRadius="2xl"
            p={6}
            border="1px solid #262626"
            boxShadow="0 0 40px rgba(0,0,0,0.85)"
            bgGradient="linear(to-br, rgba(255,214,0,0.06), #0a0a0a)"
          >
            <Text fontSize="xs" color="gray.500" mb={1} textTransform="uppercase" letterSpacing="0.16em">
              Cliente Barber Booking
            </Text>
            <Heading size="lg" color="white">
              Olá, <Box as="span" color="brand.500">{usuario.nome}</Box>
            </Heading>
            <Text color="gray.400" mt={2} fontSize="sm">{usuario.email}</Text>
          </Box>

          {/* Stats */}
          <HStack spacing={4} flexDir={{ base: 'column', sm: 'row' }}>
            <Box
              flex={1}
              bg="#111111"
              borderRadius="xl"
              p={4}
              border="1px solid #262626"
              textAlign="center"
              transition="all 0.2s ease"
              _hover={{ borderColor: 'brand.500', boxShadow: '0 0 18px rgba(255,214,0,0.35)', transform: 'translateY(-1px)' }}
            >
              <Stat>
                <StatNumber color="brand.500" fontSize="2xl">{confirmados}</StatNumber>
                <StatLabel color="gray.400" fontSize="xs">Agendamentos ativos</StatLabel>
              </Stat>
            </Box>
            <Box
              flex={1}
              bg="#111111"
              borderRadius="xl"
              p={4}
              border="1px solid #262626"
              textAlign="center"
              transition="all 0.2s ease"
              _hover={{ borderColor: 'brand.500', boxShadow: '0 0 18px rgba(255,214,0,0.35)', transform: 'translateY(-1px)' }}
            >
              <Stat>
                <StatNumber color="brand.500" fontSize="2xl">{enderecos.length}</StatNumber>
                <StatLabel color="gray.400" fontSize="xs">Endereços salvos</StatLabel>
              </Stat>
            </Box>
          </HStack>

          {/* Alerta sem endereço */}
          {enderecos.length === 0 && (
            <Box bg="#14100a" border="1px solid #ffd600" borderRadius="xl" p={4}>
              <Text color="brand.500" fontWeight="bold" fontSize="sm">Você ainda não tem endereço salvo</Text>
              <Text color="gray.400" fontSize="sm" mt={1}>Adicione um endereço antes de agendar.</Text>
              <Button
                as={Link}
                to="/enderecos"
                size="sm"
                bg="brand.500"
                color="black"
                mt={3}
                borderRadius="full"
                _hover={{ bg: 'brand.400', boxShadow: '0 0 16px rgba(255,214,0,0.35)' }}
              >
                Adicionar endereço
              </Button>
            </Box>
          )}

          {/* Ações rápidas */}
          <Box bg="#111111" borderRadius="2xl" p={6} border="1px solid #262626">
            <Text color="gray.400" fontSize="sm" mb={4}>Ações rápidas</Text>
            <VStack spacing={3}>
              <Button
                as={Link}
                to="/agendamento"
                w="full"
                bg="brand.500"
                color="black"
                borderRadius="full"
                _hover={{ bg: 'brand.400', boxShadow: '0 0 18px rgba(255,214,0,0.4)' }}
                _disabled={{ opacity: 0.4, cursor: 'not-allowed', boxShadow: 'none' }}
                isDisabled={enderecos.length === 0}
              >
                Novo agendamento
              </Button>
              <Button
                as={Link}
                to="/meus"
                w="full"
                variant="outline"
                borderColor="#444"
                color="gray.300"
                borderRadius="full"
                _hover={{ borderColor: 'brand.500', color: 'brand.500', boxShadow: '0 0 16px rgba(255,214,0,0.35)' }}
              >
                Meus agendamentos
              </Button>
              <Button
                as={Link}
                to="/enderecos"
                w="full"
                variant="outline"
                borderColor="#444"
                color="gray.300"
                borderRadius="full"
                _hover={{ borderColor: 'brand.500', color: 'brand.500', boxShadow: '0 0 16px rgba(255,214,0,0.35)' }}
              >
                Gerenciar endereços
              </Button>
            </VStack>
          </Box>
        </VStack>
      </Box>
    </Box>
  );
}

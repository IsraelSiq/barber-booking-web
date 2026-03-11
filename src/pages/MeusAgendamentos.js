import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Badge, Box, Button, Flex, Heading,
  Spinner, Text, VStack, useToast
} from '@chakra-ui/react';
import { api } from '../api';

export default function MeusAgendamentos() {
  const [agendamentos, setAgendamentos] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem('token');
  const toast = useToast();

  useEffect(() => { carregar(); }, []);

  async function carregar() {
    const data = await api.get('/agendamentos/meus', token);
    setAgendamentos(Array.isArray(data) ? data : []);
    setLoading(false);
  }

  async function cancelar(id) {
    if (!window.confirm('Cancelar este agendamento?')) return;
    await api.delete(`/agendamentos/${id}`, token);
    toast({ title: 'Agendamento cancelado.', status: 'info', duration: 2000, position: 'top' });
    carregar();
  }

  function formatarData(dt) {
    const d = new Date(dt);
    return d.toLocaleDateString('pt-BR') + ' às ' + d.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  }

  return (
    <Box minH="100vh" bg="#0a0a0a" p={4}>
      <Box maxW="520px" mx="auto">
        <Flex justify="space-between" align="center" mb={8} pt={4}>
          <Heading size="lg" color="brand.500" letterSpacing="wide">✂️ BARBER BOOKING</Heading>
          <Box as={Link} to="/agendamento" color="gray.400" fontSize="sm" _hover={{ color: 'brand.500' }}>← Novo agendamento</Box>
        </Flex>

        <Box bg="#1a1a1a" borderRadius="2xl" p={6} boxShadow="0 0 40px rgba(255,214,0,0.1)" border="1px solid #333">
          <Heading size="md" mb={6} color="white">Meus Agendamentos</Heading>

          {loading && <Flex justify="center" py={8}><Spinner color="brand.500" size="lg" /></Flex>}
          {!loading && agendamentos.length === 0 && (
            <Text color="gray.500" textAlign="center" py={8}>Nenhum agendamento encontrado.</Text>
          )}

          <VStack spacing={3}>
            {agendamentos.map(ag => (
              <Flex key={ag.id} w="full" bg="#242424" borderRadius="xl" p={4}
                justify="space-between" align="center" border="1px solid #333"
                opacity={ag.status === 'cancelado' ? 0.5 : 1}>
                <Box>
                  <Text fontWeight="bold" color="white">{ag.servico}</Text>
                  <Text color="gray.400" fontSize="sm" mt={1}>{formatarData(ag.data_hora)}</Text>
                  <Badge mt={2} colorScheme={ag.status === 'confirmado' ? 'yellow' : 'red'}
                    borderRadius="full" px={2} fontSize="0.7rem">
                    {ag.status}
                  </Badge>
                </Box>
                {ag.status === 'confirmado' && (
                  <Button size="sm" variant="outline" borderColor="brand.500" color="brand.500"
                    _hover={{ bg: 'brand.500', color: 'black' }}
                    onClick={() => cancelar(ag.id)}>Cancelar</Button>
                )}
              </Flex>
            ))}
          </VStack>
        </Box>
      </Box>
    </Box>
  );
}

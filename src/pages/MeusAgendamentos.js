import React, { useEffect, useState } from 'react';
import {
  Badge, Box, Button, Flex, Heading,
  Spinner, Text, VStack, useToast
} from '@chakra-ui/react';
import { api } from '../api';
import Navbar from '../components/Navbar';

export default function MeusAgendamentos() {
  const [agendamentos, setAgendamentos] = useState([]);
  const [enderecos, setEnderecos] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem('token');
  const toast = useToast();

  useEffect(() => { carregar(); }, []);

  async function carregar() {
    const [a, e] = await Promise.all([
      api.get('/agendamentos/meus', token),
      api.get('/enderecos/', token),
    ]);
    setAgendamentos(Array.isArray(a) ? a : []);
    setEnderecos(Array.isArray(e) ? e : []);
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

  function nomeEndereco(id) {
    const e = enderecos.find(e => e.id === id);
    return e ? `${e.apelido} — ${e.rua}, ${e.numero}` : 'Endereço não encontrado';
  }

  return (
    <Box minH="100vh" bg="#0a0a0a" p={4}>
      <Box maxW="520px" mx="auto">
        <Navbar />
        <Box
          bg="#111111"
          borderRadius="2xl"
          p={6}
          boxShadow="0 0 40px rgba(0,0,0,0.85)"
          border="1px solid #262626"
        >
          <Heading size="md" mb={6} color="white">Meus Agendamentos</Heading>
          {loading && <Flex justify="center" py={8}><Spinner color="brand.500" size="lg" /></Flex>}
          {!loading && agendamentos.length === 0 && (
            <Text color="gray.500" textAlign="center" py={8}>Nenhum agendamento encontrado.</Text>
          )}
          <VStack spacing={3}>
            {agendamentos.map(ag => (
              <Flex
                key={ag.id}
                w="full"
                bg="#141414"
                borderRadius="xl"
                p={4}
                justify="space-between"
                align="flex-start"
                border="1px solid #333"
                opacity={ag.status === 'cancelado' ? 0.5 : 1}
                transition="all 0.18s ease"
                _hover={{ borderColor: 'brand.500', boxShadow: '0 0 16px rgba(255,214,0,0.3)' }}
              >
                <Box>
                  <Text fontWeight="bold" color="white">{ag.servico}</Text>
                  <Text color="gray.400" fontSize="sm" mt={1}>{formatarData(ag.data_hora)}</Text>
                  {ag.endereco_id && (
                    <Text color="gray.500" fontSize="xs" mt={1}>
                      {nomeEndereco(ag.endereco_id)}
                    </Text>
                  )}
                  <Badge mt={2} colorScheme={ag.status === 'confirmado' ? 'yellow' : 'red'}
                    borderRadius="full" px={2} fontSize="0.7rem">{ag.status}</Badge>
                </Box>
                {ag.status === 'confirmado' && (
                  <Button size="sm" variant="outline" borderColor="brand.500" color="brand.500"
                    borderRadius="full"
                    _hover={{ bg: 'brand.500', color: 'black', boxShadow: '0 0 16px rgba(255,214,0,0.35)' }}
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

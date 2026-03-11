import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Box, Button, Flex, FormControl, FormLabel,
  Grid, Heading, Input, Select, Text, VStack, useToast, Badge
} from '@chakra-ui/react';
import { api } from '../api';

const HORARIOS = ['09:00', '10:00', '11:00', '14:00', '15:00', '16:00', '17:00', '18:00'];

export default function Agendamento() {
  const [data, setData] = useState('');
  const [disponiveis, setDisponiveis] = useState([]);
  const [buscou, setBuscou] = useState(false);
  const [horario, setHorario] = useState('');
  const [servico, setServico] = useState('Corte');
  const [loading, setLoading] = useState(false);
  const [buscando, setBuscando] = useState(false);
  const token = localStorage.getItem('token');
  const navigate = useNavigate();
  const toast = useToast();

  async function buscarHorarios() {
    if (!data) return;
    setBuscando(true);
    const result = await api.get(`/agendamentos/disponiveis?data=${data}`);
    setDisponiveis(result.horarios_disponiveis || []);
    setHorario('');
    setBuscou(true);
    setBuscando(false);
  }

  async function handleAgendar(e) {
    e.preventDefault();
    if (!horario) { toast({ title: 'Selecione um horário.', status: 'warning', position: 'top', duration: 2000 }); return; }
    setLoading(true);
    const data_hora = `${data}T${horario}:00`;
    const result = await api.post('/agendamentos/', { data_hora, servico }, token);
    setLoading(false);
    if (result.id) {
      toast({ title: `Agendamento confirmado! ${data} às ${horario}`, status: 'success', duration: 4000, isClosable: true, position: 'top' });
      buscarHorarios();
      setHorario('');
    } else {
      toast({ title: result.detail || 'Erro ao agendar.', status: 'error', duration: 3000, isClosable: true, position: 'top' });
    }
  }

  function handleLogout() {
    localStorage.removeItem('token');
    navigate('/login');
  }

  return (
    <Box minH="100vh" bg="gray.900" p={4}>
      <Box maxW="520px" mx="auto">
        {/* Header */}
        <Flex justify="space-between" align="center" mb={8} pt={4}>
          <Heading size="lg" color="red.400">✂️ Barber Booking</Heading>
          <Flex gap={3} align="center">
            <Box as={Link} to="/meus" color="gray.400" fontSize="sm" _hover={{ color: 'white' }}>Meus agendamentos</Box>
            <Button size="sm" variant="outline" colorScheme="red" onClick={handleLogout}>Sair</Button>
          </Flex>
        </Flex>

        <Box bg="gray.800" borderRadius="2xl" p={6} boxShadow="2xl">
          <Heading size="md" mb={6} color="white">Novo Agendamento</Heading>

          <VStack spacing={5}>
            <FormControl>
              <FormLabel color="gray.400" fontSize="sm">Data</FormLabel>
              <Flex gap={3}>
                <Input type="date" value={data} onChange={e => { setData(e.target.value); setBuscou(false); }}
                  bg="gray.700" border="none" size="lg" flex={1} />
                <Button onClick={buscarHorarios} colorScheme="red" size="lg" px={6} isLoading={buscando}>Buscar</Button>
              </Flex>
            </FormControl>

            {buscou && (
              <>
                <FormControl>
                  <FormLabel color="gray.400" fontSize="sm">Horário</FormLabel>
                  <Grid templateColumns="repeat(4, 1fr)" gap={2}>
                    {HORARIOS.map(h => {
                      const disponivel = disponiveis.includes(h);
                      const selecionado = horario === h;
                      return (
                        <Button
                          key={h} size="md"
                          onClick={() => disponivel && setHorario(h)}
                          colorScheme={selecionado ? 'red' : 'gray'}
                          variant={selecionado ? 'solid' : 'outline'}
                          opacity={disponivel ? 1 : 0.3}
                          cursor={disponivel ? 'pointer' : 'not-allowed'}
                          borderColor={disponivel && !selecionado ? 'gray.500' : undefined}
                        >
                          {h}
                        </Button>
                      );
                    })}
                  </Grid>
                  {disponiveis.length === 0 && (
                    <Text color="gray.500" fontSize="sm" mt={2}>Nenhum horário disponível nesta data.</Text>
                  )}
                </FormControl>

                {disponiveis.length > 0 && (
                  <>
                    <FormControl>
                      <FormLabel color="gray.400" fontSize="sm">Serviço</FormLabel>
                      <Select value={servico} onChange={e => setServico(e.target.value)} bg="gray.700" border="none" size="lg">
                        <option>Corte</option>
                        <option>Barba</option>
                        <option>Corte + Barba</option>
                        <option>Sobrancelha</option>
                      </Select>
                    </FormControl>
                    <Button
                      onClick={handleAgendar} colorScheme="red" size="lg" w="full"
                      isLoading={loading} loadingText="Confirmando..." isDisabled={!horario}
                    >
                      Confirmar Agendamento
                    </Button>
                  </>
                )}
              </>
            )}
          </VStack>
        </Box>
      </Box>
    </Box>
  );
}

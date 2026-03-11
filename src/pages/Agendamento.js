import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Box, Button, Flex, FormControl, FormLabel,
  Grid, Heading, Input, Select, Text, VStack, useToast
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
      toast({ title: `Agendado! ${data} às ${horario}`, status: 'success', duration: 4000, isClosable: true, position: 'top' });
      buscarHorarios();
      setHorario('');
    } else {
      toast({ title: result.detail || 'Erro ao agendar.', status: 'error', duration: 3000, isClosable: true, position: 'top' });
    }
  }

  return (
    <Box minH="100vh" bg="#0a0a0a" p={4}>
      <Box maxW="520px" mx="auto">
        <Flex justify="space-between" align="center" mb={8} pt={4}>
          <Heading size="lg" color="brand.500" letterSpacing="wide">✂️ BARBER BOOKING</Heading>
          <Flex gap={3} align="center">
            <Box as={Link} to="/meus" color="gray.400" fontSize="sm" _hover={{ color: 'brand.500' }}>Meus agendamentos</Box>
            <Button size="sm" variant="outline" borderColor="brand.500" color="brand.500"
              _hover={{ bg: 'brand.500', color: 'black' }}
              onClick={() => { localStorage.removeItem('token'); navigate('/login'); }}>Sair</Button>
          </Flex>
        </Flex>

        <Box bg="#1a1a1a" borderRadius="2xl" p={6} boxShadow="0 0 40px rgba(255,214,0,0.1)" border="1px solid #333">
          <Heading size="md" mb={6} color="white">Novo Agendamento</Heading>
          <VStack spacing={5}>
            <FormControl>
              <FormLabel color="gray.400" fontSize="sm">Data</FormLabel>
              <Flex gap={3}>
                <Input type="date" value={data} onChange={e => { setData(e.target.value); setBuscou(false); }}
                  bg="#242424" border="1px solid #333" color="white" size="lg" flex={1}
                  _focus={{ borderColor: 'brand.500' }} />
                <Button onClick={buscarHorarios} bg="brand.500" color="black" size="lg" px={6}
                  isLoading={buscando} _hover={{ bg: 'brand.400' }}>Buscar</Button>
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
                        <Button key={h} size="md"
                          onClick={() => disponivel && setHorario(h)}
                          bg={selecionado ? 'brand.500' : '#242424'}
                          color={selecionado ? 'black' : disponivel ? 'white' : 'gray.600'}
                          border="1px solid"
                          borderColor={selecionado ? 'brand.500' : disponivel ? '#444' : '#2a2a2a'}
                          opacity={disponivel ? 1 : 0.35}
                          cursor={disponivel ? 'pointer' : 'not-allowed'}
                          _hover={disponivel && !selecionado ? { borderColor: 'brand.500', color: 'brand.500' } : {}}
                        >{h}</Button>
                      );
                    })}
                  </Grid>
                  {disponiveis.length === 0 && <Text color="gray.500" fontSize="sm" mt={2}>Nenhum horário disponível.</Text>}
                </FormControl>

                {disponiveis.length > 0 && (
                  <>
                    <FormControl>
                      <FormLabel color="gray.400" fontSize="sm">Serviço</FormLabel>
                      <Select value={servico} onChange={e => setServico(e.target.value)}
                        bg="#242424" border="1px solid #333" color="white" size="lg"
                        _focus={{ borderColor: 'brand.500' }}>
                        <option style={{background:'#242424'}}>Corte</option>
                        <option style={{background:'#242424'}}>Barba</option>
                        <option style={{background:'#242424'}}>Corte + Barba</option>
                        <option style={{background:'#242424'}}>Sobrancelha</option>
                      </Select>
                    </FormControl>
                    <Button onClick={handleAgendar} bg="brand.500" color="black" size="lg" w="full"
                      isLoading={loading} loadingText="Confirmando..." isDisabled={!horario}
                      _hover={{ bg: 'brand.400' }} _disabled={{ opacity: 0.4 }}>
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

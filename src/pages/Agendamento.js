import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Box, Button, Flex, FormControl, FormLabel,
  Grid, Heading, Input, Select, Text, VStack, useToast, Alert, AlertIcon
} from '@chakra-ui/react';
import { api } from '../api';
import Navbar from '../components/Navbar';

const HORARIOS = ['09:00', '10:00', '11:00', '14:00', '15:00', '16:00', '17:00', '18:00'];

export default function Agendamento() {
  const [data, setData] = useState('');
  const [disponiveis, setDisponiveis] = useState([]);
  const [buscou, setBuscou] = useState(false);
  const [horario, setHorario] = useState('');
  const [servico, setServico] = useState('Corte');
  const [enderecoId, setEnderecoId] = useState('');
  const [enderecos, setEnderecos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [buscando, setBuscando] = useState(false);
  const token = localStorage.getItem('token');
  const toast = useToast();

  useEffect(() => {
    async function carregarEnderecos() {
      const e = await api.get('/enderecos/', token);
      setEnderecos(Array.isArray(e) ? e : []);
    }
    carregarEnderecos();
  }, []);

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
    if (!enderecoId) { toast({ title: 'Selecione um endereço.', status: 'warning', position: 'top', duration: 2000 }); return; }
    setLoading(true);
    const data_hora = `${data}T${horario}:00`;
    const result = await api.post('/agendamentos/', { data_hora, servico, endereco_id: parseInt(enderecoId) }, token);
    setLoading(false);
    if (result.id) {
      toast({ title: `Agendado! ${data} às ${horario}`, status: 'success', duration: 4000, isClosable: true, position: 'top' });
      buscarHorarios();
      setHorario('');
    } else {
      toast({ title: result.detail || 'Erro ao agendar.', status: 'error', duration: 3000, isClosable: true, position: 'top' });
    }
  }

  const inputStyle = { bg: '#242424', border: '1px solid #333', color: 'white', _focus: { borderColor: 'brand.500' } };

  if (enderecos.length === 0) return (
    <Box minH="100vh" bg="#0a0a0a" p={4}>
      <Box maxW="520px" mx="auto">
        <Navbar />
        <Box bg="#1a1a1a" borderRadius="2xl" p={8} border="1px solid #333" textAlign="center">
          <Text fontSize="3xl" mb={4}>📍</Text>
          <Heading size="md" color="white" mb={2}>Nenhum endereço cadastrado</Heading>
          <Text color="gray.400" mb={6}>Você precisa ter ao menos um endereço salvo para fazer um agendamento.</Text>
          <Button as={Link} to="/enderecos" bg="brand.500" color="black" _hover={{ bg: 'brand.400' }}>Adicionar Endereço</Button>
        </Box>
      </Box>
    </Box>
  );

  return (
    <Box minH="100vh" bg="#0a0a0a" p={4}>
      <Box maxW="520px" mx="auto">
        <Navbar />
        <Box bg="#1a1a1a" borderRadius="2xl" p={6} boxShadow="0 0 40px rgba(255,214,0,0.1)" border="1px solid #333">
          <Heading size="md" mb={6} color="white">Novo Agendamento</Heading>
          <VStack spacing={5}>

            <FormControl isRequired>
              <FormLabel color="gray.400" fontSize="sm">Endereço do atendimento</FormLabel>
              <Select value={enderecoId} onChange={e => setEnderecoId(e.target.value)}
                {...inputStyle} size="lg" placeholder="Selecione o endereço">
                {enderecos.map(e => (
                  <option key={e.id} value={e.id} style={{ background: '#242424' }}>
                    {e.apelido} — {e.rua}, {e.numero}, {e.bairro}
                  </option>
                ))}
              </Select>
            </FormControl>

            <FormControl>
              <FormLabel color="gray.400" fontSize="sm">Data</FormLabel>
              <Flex gap={3}>
                <Input type="date" value={data} onChange={e => { setData(e.target.value); setBuscou(false); }}
                  {...inputStyle} size="lg" flex={1} />
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
                        {...inputStyle} size="lg">
                        <option style={{ background: '#242424' }}>Corte</option>
                        <option style={{ background: '#242424' }}>Barba</option>
                        <option style={{ background: '#242424' }}>Corte + Barba</option>
                        <option style={{ background: '#242424' }}>Sobrancelha</option>
                      </Select>
                    </FormControl>
                    <Button onClick={handleAgendar} bg="brand.500" color="black" size="lg" w="full"
                      isLoading={loading} loadingText="Confirmando..." isDisabled={!horario || !enderecoId}
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

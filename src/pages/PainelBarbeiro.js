import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Badge, Box, Button, Flex, Grid, Heading, Input,
  Modal, ModalBody, ModalContent, ModalFooter, ModalHeader,
  ModalOverlay, Spinner, Text, Textarea, VStack, useDisclosure, useToast, HStack
} from '@chakra-ui/react';
import { api } from '../api';

const HORARIOS = ['09:00', '10:00', '11:00', '14:00', '15:00', '16:00', '17:00', '18:00'];

function hoje() {
  return new Date().toISOString().split('T')[0];
}

export default function PainelBarbeiro() {
  const [data, setData] = useState(hoje());
  const [agenda, setAgenda] = useState([]);
  const [bloqueios, setBloqueios] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [aba, setAba] = useState('agenda');
  const [loading, setLoading] = useState(false);
  const [agSelecionado, setAgSelecionado] = useState(null);
  const [motivo, setMotivo] = useState('');
  const { isOpen, onOpen, onClose } = useDisclosure();
  const token = localStorage.getItem('token');
  const navigate = useNavigate();
  const toast = useToast();

  useEffect(() => { carregarAgenda(); }, [data]);
  useEffect(() => {
    carregarBloqueios();
    carregarClientes();
  }, []);

  async function carregarAgenda() {
    setLoading(true);
    const res = await api.get(`/admin/agenda?data=${data}`, token);
    setAgenda(res.agendamentos || []);
    setLoading(false);
  }

  async function carregarBloqueios() {
    const res = await api.get('/admin/bloqueios', token);
    setBloqueios(Array.isArray(res) ? res : []);
  }

  async function carregarClientes() {
    const res = await api.get('/admin/clientes', token);
    setClientes(Array.isArray(res) ? res : []);
  }

  async function concluir(id) {
    await api.patch(`/admin/agendamentos/${id}/concluir`, {}, token);
    toast({ title: 'Atendimento concluído!', status: 'success', duration: 2000, position: 'top' });
    carregarAgenda();
  }

  function abrirCancelar(ag) {
    setAgSelecionado(ag);
    setMotivo('');
    onOpen();
  }

  async function confirmarCancelar() {
    if (!motivo.trim()) {
      toast({ title: 'Informe o motivo.', status: 'warning', duration: 2000, position: 'top' });
      return;
    }
    await api.patch(`/admin/agendamentos/${agSelecionado.id}/cancelar`, { motivo }, token);
    toast({ title: 'Agendamento cancelado.', status: 'info', duration: 2000, position: 'top' });
    onClose();
    carregarAgenda();
  }

  async function bloquear(horario) {
    await api.post('/admin/bloqueios', { data, horario, motivo: 'Bloqueado pelo barbeiro' }, token);
    toast({ title: `${horario} bloqueado.`, status: 'warning', duration: 2000, position: 'top' });
    carregarBloqueios();
    carregarAgenda();
  }

  async function desbloquear(id) {
    await api.delete(`/admin/bloqueios/${id}`, token);
    toast({ title: 'Bloqueio removido.', status: 'success', duration: 2000, position: 'top' });
    carregarBloqueios();
    carregarAgenda();
  }

  function logout() {
    localStorage.removeItem('token');
    navigate('/login');
  }

  const bloqueiosDoDia = bloqueios.filter(b => b.data === data);
  const horariosBloqueados = bloqueiosDoDia.map(b => b.horario);
  const horariosAgendados = agenda.map(a => a.horario);

  const cardStyle = { bg: '#1a1a1a', borderRadius: '2xl', p: 6, border: '1px solid #333' };
  const abaStyle = (ativo) => ({
    size: 'sm', variant: 'ghost',
    color: ativo ? 'brand.500' : 'gray.500',
    borderBottom: ativo ? '2px solid' : 'none',
    borderColor: 'brand.500',
    borderRadius: 0, pb: 2,
    _hover: { color: 'brand.500' }
  });

  return (
    <Box minH="100vh" bg="#0a0a0a" p={4}>
      <Box maxW="600px" mx="auto">
        {/* Header */}
        <Flex justify="space-between" align="center" mb={6} pt={4}>
          <Heading size="lg" color="brand.500">✂️ Painel do Barbeiro</Heading>
          <Button size="sm" variant="outline" borderColor="brand.500" color="brand.500"
            _hover={{ bg: 'brand.500', color: 'black' }} onClick={logout}>Sair</Button>
        </Flex>

        {/* Abas */}
        <HStack spacing={0} mb={6} borderBottom="1px solid #333">
          <Button {...abaStyle(aba === 'agenda')} onClick={() => setAba('agenda')}>📅 Agenda</Button>
          <Button {...abaStyle(aba === 'horarios')} onClick={() => setAba('horarios')}>🔒 Horários</Button>
          <Button {...abaStyle(aba === 'clientes')} onClick={() => setAba('clientes')}>👥 Clientes</Button>
        </HStack>

        {/* ABA AGENDA */}
        {aba === 'agenda' && (
          <VStack spacing={4} align="stretch">
            <Flex gap={3}>
              <Input type="date" value={data} onChange={e => setData(e.target.value)}
                bg="#242424" border="1px solid #333" color="white" flex={1}
                _focus={{ borderColor: 'brand.500' }} />
              <Button onClick={carregarAgenda} bg="brand.500" color="black" _hover={{ bg: 'brand.400' }}>Buscar</Button>
            </Flex>

            {loading && <Flex justify="center" py={8}><Spinner color="brand.500" size="lg" /></Flex>}

            {!loading && agenda.length === 0 && (
              <Box {...cardStyle} textAlign="center">
                <Text color="gray.500">Nenhum agendamento para esta data.</Text>
              </Box>
            )}

            {agenda.map(ag => (
              <Box key={ag.id} {...cardStyle}>
                <Flex justify="space-between" align="flex-start">
                  <Box flex={1}>
                    <Flex align="center" gap={3} mb={2}>
                      <Text color="brand.500" fontWeight="bold" fontSize="xl">{ag.horario}</Text>
                      <Badge colorScheme="yellow" borderRadius="full" px={2}>{ag.servico}</Badge>
                    </Flex>
                    <Text color="white" fontWeight="bold">{ag.cliente?.nome}</Text>
                    <Text color="gray.400" fontSize="sm">📞 {ag.cliente?.telefone}</Text>
                    {ag.endereco && (
                      <Box mt={2} bg="#242424" borderRadius="lg" p={3}>
                        <Text color="brand.500" fontSize="xs" fontWeight="bold">📍 {ag.endereco.apelido}</Text>
                        <Text color="gray.300" fontSize="sm">{ag.endereco.rua}, {ag.endereco.numero}</Text>
                        <Text color="gray.500" fontSize="xs">{ag.endereco.bairro} — {ag.endereco.cidade}</Text>
                        {ag.endereco.complemento && <Text color="gray.500" fontSize="xs">{ag.endereco.complemento}</Text>}
                      </Box>
                    )}
                  </Box>
                  <VStack spacing={2} ml={3}>
                    <Button size="sm" bg="green.600" color="white" _hover={{ bg: 'green.500' }}
                      onClick={() => concluir(ag.id)}>✅ Concluir</Button>
                    <Button size="sm" variant="outline" borderColor="red.500" color="red.400"
                      _hover={{ bg: 'red.500', color: 'white' }}
                      onClick={() => abrirCancelar(ag)}>❌ Cancelar</Button>
                  </VStack>
                </Flex>
              </Box>
            ))}
          </VStack>
        )}

        {/* ABA HORÁRIOS */}
        {aba === 'horarios' && (
          <VStack spacing={4} align="stretch">
            <Flex gap={3}>
              <Input type="date" value={data} onChange={e => setData(e.target.value)}
                bg="#242424" border="1px solid #333" color="white" flex={1}
                _focus={{ borderColor: 'brand.500' }} />
            </Flex>
            <Box {...cardStyle}>
              <Text color="gray.400" fontSize="sm" mb={4}>Clique para bloquear/desbloquear horários</Text>
              <Grid templateColumns="repeat(4, 1fr)" gap={3}>
                {HORARIOS.map(h => {
                  const agendado = horariosAgendados.includes(h);
                  const bloqueado = horariosBloqueados.includes(h);
                  const bloqueioObj = bloqueiosDoDia.find(b => b.horario === h);
                  return (
                    <Button key={h} size="md"
                      bg={agendado ? '#1a3a1a' : bloqueado ? '#3a1a1a' : '#242424'}
                      color={agendado ? 'green.400' : bloqueado ? 'red.400' : 'gray.300'}
                      border="1px solid"
                      borderColor={agendado ? 'green.700' : bloqueado ? 'red.700' : '#444'}
                      onClick={() => {
                        if (agendado) return;
                        if (bloqueado) desbloquear(bloqueioObj.id);
                        else bloquear(h);
                      }}
                      cursor={agendado ? 'not-allowed' : 'pointer'}
                      title={agendado ? 'Horário com agendamento' : bloqueado ? 'Clique para desbloquear' : 'Clique para bloquear'}
                    >
                      {h}
                    </Button>
                  );
                })}
              </Grid>
              <HStack mt={4} spacing={4} fontSize="xs" color="gray.500">
                <Flex align="center" gap={1}><Box w={2} h={2} bg="green.400" borderRadius="full" /> Agendado</Flex>
                <Flex align="center" gap={1}><Box w={2} h={2} bg="red.400" borderRadius="full" /> Bloqueado</Flex>
                <Flex align="center" gap={1}><Box w={2} h={2} bg="gray.500" borderRadius="full" /> Livre</Flex>
              </HStack>
            </Box>
          </VStack>
        )}

        {/* ABA CLIENTES */}
        {aba === 'clientes' && (
          <VStack spacing={3} align="stretch">
            <Text color="gray.500" fontSize="sm">{clientes.length} cliente(s) cadastrado(s)</Text>
            {clientes.map(c => (
              <Box key={c.id} {...cardStyle} py={4}>
                <Text color="white" fontWeight="bold">{c.nome}</Text>
                <Text color="gray.400" fontSize="sm">📞 {c.telefone}</Text>
                <Text color="gray.500" fontSize="xs">{c.email}</Text>
              </Box>
            ))}
          </VStack>
        )}
      </Box>

      {/* Modal cancelamento */}
      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay bg="blackAlpha.800" />
        <ModalContent bg="#1a1a1a" border="1px solid #333" borderRadius="2xl" mx={4}>
          <ModalHeader color="white">Cancelar agendamento</ModalHeader>
          <ModalBody>
            <Text color="gray.400" fontSize="sm" mb={3}>
              Informe o motivo do cancelamento. O cliente poderá ver esta mensagem.
            </Text>
            <Textarea
              value={motivo} onChange={e => setMotivo(e.target.value)}
              placeholder="Ex: Imprevisto pessoal, problema de saúde..."
              bg="#242424" border="1px solid #333" color="white"
              _focus={{ borderColor: 'brand.500' }} rows={3}
            />
          </ModalBody>
          <ModalFooter gap={3}>
            <Button variant="ghost" color="gray.400" onClick={onClose}>Voltar</Button>
            <Button bg="red.600" color="white" _hover={{ bg: 'red.500' }} onClick={confirmarCancelar}>
              Confirmar cancelamento
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
}

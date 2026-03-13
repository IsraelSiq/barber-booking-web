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
  const [resetandoId, setResetandoId] = useState(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    isOpen: isResetOpen,
    onOpen: onResetOpen,
    onClose: onResetClose
  } = useDisclosure();
  const [clienteReset, setClienteReset] = useState(null);
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

  function abrirReset(cliente) {
    setClienteReset(cliente);
    onResetOpen();
  }

  async function confirmarReset() {
    setResetandoId(clienteReset.id);
    const res = await api.post(`/admin/clientes/${clienteReset.id}/reset-senha`, {}, token);
    setResetandoId(null);
    onResetClose();
    if (res.detail) {
      toast({ title: typeof res.detail === 'string' ? res.detail : 'Erro ao resetar senha.', status: 'error', duration: 3000, position: 'top' });
    } else {
      toast({
        title: 'Senha resetada!',
        description: `${clienteReset.nome} deverá criar uma nova senha no próximo login.`,
        status: 'success', duration: 4000, isClosable: true, position: 'top'
      });
      carregarClientes();
    }
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
          <Heading size="lg" color="brand.500">
            Painel do Barbeiro
          </Heading>
          <Button size="sm" variant="outline" borderColor="brand.500" color="brand.500"
            borderRadius="full"
            _hover={{ bg: 'brand.500', color: 'black', boxShadow: '0 0 16px rgba(255,214,0,0.35)' }}
            onClick={logout}>Sair</Button>
        </Flex>

        {/* Abas */}
        <HStack spacing={0} mb={6} borderBottom="1px solid #333">
          <Button {...abaStyle(aba === 'agenda')} onClick={() => setAba('agenda')}>Agenda</Button>
          <Button {...abaStyle(aba === 'horarios')} onClick={() => setAba('horarios')}>Horários</Button>
          <Button {...abaStyle(aba === 'clientes')} onClick={() => setAba('clientes')}>Clientes</Button>
        </HStack>

        {/* ABA AGENDA */}
        {aba === 'agenda' && (
          <VStack spacing={4} align="stretch">
            <Flex gap={3}>
              <Input type="date" value={data} onChange={e => setData(e.target.value)}
                bg="#141414"
                border="1px solid #333"
                color="white"
                flex={1}
                _focus={{
                  borderColor: 'brand.500',
                  boxShadow: '0 0 0 1px #ffd600, 0 0 12px rgba(255,214,0,0.35)'
                }}
                _hover={{ borderColor: '#555' }}
              />
              <Button
                onClick={carregarAgenda}
                bg="brand.500"
                color="black"
                borderRadius="full"
                _hover={{ bg: 'brand.400', boxShadow: '0 0 18px rgba(255,214,0,0.4)' }}
              >
                Buscar
              </Button>
            </Flex>

            {loading && <Flex justify="center" py={8}><Spinner color="brand.500" size="lg" /></Flex>}

            {!loading && agenda.length === 0 && (
              <Box
                {...cardStyle}
                bg="#111111"
                border="1px solid #262626"
                textAlign="center"
              >
                <Text color="gray.500">Nenhum agendamento para esta data.</Text>
              </Box>
            )}

            {agenda.map(ag => (
              <Box
                key={ag.id}
                {...cardStyle}
                bg="#111111"
                border="1px solid #262626"
                boxShadow="0 0 40px rgba(0,0,0,0.65)"
              >
                <Flex justify="space-between" align="flex-start">
                  <Box flex={1}>
                    <Flex align="center" gap={3} mb={2}>
                      <Text color="brand.500" fontWeight="bold" fontSize="xl">{ag.horario}</Text>
                      <Badge colorScheme="yellow" borderRadius="full" px={2}>{ag.servico}</Badge>
                    </Flex>
                    <Text color="white" fontWeight="bold">{ag.cliente?.nome}</Text>
                    <Text color="gray.400" fontSize="sm">{ag.cliente?.telefone}</Text>
                    {ag.endereco && (
                      <Box mt={2} bg="#141414" borderRadius="lg" p={3}>
                        <Text color="brand.500" fontSize="xs" fontWeight="bold">{ag.endereco.apelido}</Text>
                        <Text color="gray.300" fontSize="sm">{ag.endereco.rua}, {ag.endereco.numero}</Text>
                        <Text color="gray.500" fontSize="xs">{ag.endereco.bairro} — {ag.endereco.cidade}</Text>
                        {ag.endereco.complemento && <Text color="gray.500" fontSize="xs">{ag.endereco.complemento}</Text>}
                      </Box>
                    )}
                  </Box>
                  <VStack spacing={2} ml={3}>
                    <Button
                      size="sm"
                      bg="green.600"
                      color="white"
                      borderRadius="full"
                      _hover={{ bg: 'green.500', boxShadow: '0 0 16px rgba(74,222,128,0.35)' }}
                      onClick={() => concluir(ag.id)}>✅ Concluir</Button>
                    <Button
                      size="sm"
                      variant="outline"
                      borderColor="red.500"
                      color="red.400"
                      borderRadius="full"
                      _hover={{ bg: 'red.500', color: 'white', boxShadow: '0 0 16px rgba(248,113,113,0.45)' }}
                      onClick={() => abrirCancelar(ag)}
                    >
                      Cancelar
                    </Button>
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
                bg="#141414"
                border="1px solid #333"
                color="white"
                flex={1}
                _focus={{
                  borderColor: 'brand.500',
                  boxShadow: '0 0 0 1px #ffd600, 0 0 12px rgba(255,214,0,0.35)'
                }}
                _hover={{ borderColor: '#555' }}
              />
            </Flex>
            <Box
              {...cardStyle}
              bg="#111111"
              border="1px solid #262626"
            >
              <Text color="gray.400" fontSize="sm" mb={4}>Clique para bloquear/desbloquear horários</Text>
              <Grid templateColumns="repeat(4, 1fr)" gap={3}>
                {HORARIOS.map(h => {
                  const agendado = horariosAgendados.includes(h);
                  const bloqueado = horariosBloqueados.includes(h);
                  const bloqueioObj = bloqueiosDoDia.find(b => b.horario === h);
                  return (
                    <Button
                      key={h}
                      size="md"
                      bg={agendado ? '#1a3a1a' : bloqueado ? '#3a1a1a' : '#141414'}
                      color={agendado ? 'green.400' : bloqueado ? 'red.400' : 'gray.300'}
                      border="1px solid"
                      borderColor={agendado ? 'green.700' : bloqueado ? 'red.700' : '#444'}
                      onClick={() => {
                        if (agendado) return;
                        if (bloqueado) desbloquear(bloqueioObj.id);
                        else bloquear(h);
                      }}
                      cursor={agendado ? 'not-allowed' : 'pointer'}
                      transition="all 0.18s ease"
                      _hover={
                        !agendado
                          ? {
                              boxShadow: bloqueado
                                ? '0 0 14px rgba(248,113,113,0.4)'
                                : '0 0 14px rgba(255,214,0,0.35)'
                            }
                          : {}
                      }
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
              <Box
                key={c.id}
                {...cardStyle}
                bg="#111111"
                border="1px solid #262626"
                py={4}
              >
                <Flex justify="space-between" align="center">
                  <Box>
                    <Flex align="center" gap={2} mb={1}>
                      <Text color="white" fontWeight="bold">{c.nome}</Text>
                      {c.precisa_redefinir && (
                        <Badge colorScheme="orange" borderRadius="full" fontSize="xs">Senha pendente</Badge>
                      )}
                    </Flex>
                    <Text color="gray.400" fontSize="sm">{c.telefone}</Text>
                    <Text color="gray.500" fontSize="xs">{c.email}</Text>
                  </Box>
                  <Button
                    size="sm"
                    variant="outline"
                    borderColor="orange.500"
                    color="orange.400"
                    borderRadius="full"
                    _hover={{ bg: 'orange.500', color: 'white', boxShadow: '0 0 16px rgba(251,146,60,0.45)' }}
                    isLoading={resetandoId === c.id}
                    onClick={() => abrirReset(c)}
                  >
                    Resetar senha
                  </Button>
                </Flex>
              </Box>
            ))}
          </VStack>
        )}
      </Box>

      {/* Modal cancelamento */}
      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay bg="blackAlpha.800" />
        <ModalContent bg="#111111" border="1px solid #262626" borderRadius="2xl" mx={4}>
          <ModalHeader color="white">Cancelar agendamento</ModalHeader>
          <ModalBody>
            <Text color="gray.400" fontSize="sm" mb={3}>
              Informe o motivo do cancelamento. O cliente poderá ver esta mensagem.
            </Text>
            <Textarea
              value={motivo} onChange={e => setMotivo(e.target.value)}
              placeholder="Ex: Imprevisto pessoal, problema de saúde..."
              bg="#141414"
              border="1px solid #333"
              color="white"
              _focus={{
                borderColor: 'brand.500',
                boxShadow: '0 0 0 1px #ffd600, 0 0 12px rgba(255,214,0,0.35)'
              }}
              rows={3}
            />
          </ModalBody>
          <ModalFooter gap={3}>
            <Button variant="ghost" color="gray.400" onClick={onClose}>Voltar</Button>
            <Button
              bg="red.600"
              color="white"
              borderRadius="full"
              _hover={{ bg: 'red.500', boxShadow: '0 0 16px rgba(248,113,113,0.45)' }}
              onClick={confirmarCancelar}
            >
              Confirmar cancelamento
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Modal reset de senha */}
      <Modal isOpen={isResetOpen} onClose={onResetClose} isCentered>
        <ModalOverlay bg="blackAlpha.800" />
        <ModalContent bg="#111111" border="1px solid #262626" borderRadius="2xl" mx={4}>
          <ModalHeader color="white">Resetar senha</ModalHeader>
          <ModalBody>
            <Text color="gray.400" fontSize="sm">
              Tem certeza que deseja resetar a senha de{' '}
              <Text as="span" color="white" fontWeight="bold">{clienteReset?.nome}</Text>?
            </Text>
            <Box mt={3} bg="#242424" border="1px solid #ffd600" borderRadius="lg" p={3}>
              <Text color="brand.500" fontSize="xs" fontWeight="bold">O que vai acontecer:</Text>
              <Text color="gray.400" fontSize="xs" mt={1}>
                A senha será definida como <Text as="span" color="white" fontWeight="bold">teste123</Text> e o cliente será obrigado a criar uma nova senha no próximo login.
              </Text>
            </Box>
          </ModalBody>
          <ModalFooter gap={3}>
            <Button variant="ghost" color="gray.400" onClick={onResetClose}>Cancelar</Button>
            <Button bg="orange.500" color="white" _hover={{ bg: 'orange.400' }}
              isLoading={resetandoId === clienteReset?.id}
              onClick={confirmarReset}>
              Confirmar reset
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
}

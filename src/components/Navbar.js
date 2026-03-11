import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Box, Flex, Heading, Button, HStack } from '@chakra-ui/react';

export default function Navbar() {
  const navigate = useNavigate();
  function logout() {
    localStorage.removeItem('token');
    navigate('/login');
  }
  return (
    <Flex justify="space-between" align="center" mb={8} pt={4}>
      <Heading size="lg" color="brand.500" letterSpacing="wide">✂️ BARBER</Heading>
      <HStack spacing={4} fontSize="sm">
        <Box as={Link} to="/inicio" color="gray.400" _hover={{ color: 'brand.500' }}>Inicio</Box>
        <Box as={Link} to="/agendamento" color="gray.400" _hover={{ color: 'brand.500' }}>Agendar</Box>
        <Box as={Link} to="/meus" color="gray.400" _hover={{ color: 'brand.500' }}>Meus</Box>
        <Box as={Link} to="/enderecos" color="gray.400" _hover={{ color: 'brand.500' }}>Endereços</Box>
        <Box as={Link} to="/perfil" color="gray.400" _hover={{ color: 'brand.500' }}>Perfil</Box>
        <Button size="sm" variant="outline" borderColor="brand.500" color="brand.500"
          _hover={{ bg: 'brand.500', color: 'black' }} onClick={logout}>Sair</Button>
      </HStack>
    </Flex>
  );
}

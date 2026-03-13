import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Box, Flex, Heading, Button, HStack, Image } from '@chakra-ui/react';
import logoAlafy from '../assets/logo-alafy.png';

export default function Navbar() {
  const navigate = useNavigate();
  function logout() {
    localStorage.removeItem('token');
    navigate('/login');
  }
  return (
    <Flex justify="space-between" align="center" mb={8} pt={4}>
      <Flex align="center" gap={3}>
        <Image
          src={logoAlafy}
          alt="Alafy Barber"
          boxSize={{ base: '44px', md: '52px' }}
          objectFit="contain"
        />
        <Heading size="md" color="brand.500" letterSpacing="0.18em" textTransform="uppercase">
          Alafy Barber
        </Heading>
      </Flex>
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

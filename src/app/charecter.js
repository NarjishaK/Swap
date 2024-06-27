"use client";

import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import { Box, Image, Text, List, ListItem, Heading } from '@chakra-ui/react';
import axios from 'axios';

const CharacterDetail = () => {
  const router = useRouter();
  const { id } = router.query;
  const [character, setCharacter] = useState(null);
  const [films, setFilms] = useState([]);

  useEffect(() => {
    const fetchCharacter = async () => {
      if (!id) return;
      try {
        const response = await axios.get(`https://swapi.dev/api/people/${id}/`);
        setCharacter(response.data);

        const filmPromises = response.data.films.map((filmUrl) => axios.get(filmUrl));
        const filmResponses = await Promise.all(filmPromises);
        setFilms(filmResponses.map((res) => res.data.title));
      } catch (error) {
        console.error("Error fetching character details:", error);
      }
    };

    fetchCharacter();
  }, [id]);

  if (!character) return <Text>Loading...</Text>;

  return (
    <Box p={5}>
      <Image src={`https://starwars-visualguide.com/assets/img/characters/${id}.jpg`} alt={character.name} />
      <Heading mt={5}>{character.name}</Heading>
      <Text mt={2}>Height: {character.height}</Text>
      <Text>Mass: {character.mass}</Text>
      <Text>Hair Color: {character.hair_color}</Text>
      <Text>Skin Color: {character.skin_color}</Text>
      <Text>Eye Color: {character.eye_color}</Text>
      <Text>Birth Year: {character.birth_year}</Text>
      <Text>Gender: {character.gender}</Text>
      <Heading mt={5} size="md">Films</Heading>
      <List spacing={3}>
        {films.map((film) => (
          <ListItem key={film}>{film}</ListItem>
        ))}
      </List>
    </Box>
  );
};

export default CharacterDetail;

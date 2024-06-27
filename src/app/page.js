"use client";

import { useState, useEffect } from 'react';
import { Box, Button, Image, Text, Grid, IconButton } from '@chakra-ui/react';
import { StarIcon } from '@chakra-ui/icons';
import Link from 'next/link';
import axios from 'axios';
import styles from "./page.module.css";

const Home = () => {
  const [characters, setCharacters] = useState([]);
  const [page, setPage] = useState(1);
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    const fetchCharacters = async () => {
      try {
        const response = await axios.get(`https://swapi.dev/api/people/?page=${page}`);
        setCharacters(response.data.results);
      } catch (error) {
        console.error("Error fetching characters:", error);
      }
    };

    fetchCharacters();

    const savedFavorites = JSON.parse(localStorage.getItem('favorites')) || [];
    setFavorites(savedFavorites);
  }, [page]);

  const toggleFavorite = (character) => {
    let updatedFavorites = [];
    if (favorites.includes(character.name)) {
      updatedFavorites = favorites.filter((fav) => fav !== character.name);
    } else {
      updatedFavorites = [...favorites, character.name];
    }
    setFavorites(updatedFavorites);
    localStorage.setItem('favorites', JSON.stringify(updatedFavorites));
  };

  return (
    <Box p={5}>
      <Grid templateColumns="repeat(auto-fill, minmax(200px, 1fr))" gap={6}>
        {characters.map((character) => (
          <Box key={character.name} borderWidth="1px" borderRadius="lg" overflow="hidden">
            <Image src={`https://starwars-visualguide.com/assets/img/characters/${character.url.split('/')[5]}.jpg`} alt={character.name} />
            <Box p="6">
              <Box d="flex" alignItems="baseline">
                <Text fontWeight="bold" fontSize="xl">{character.name}</Text>
                <IconButton
                  aria-label="Favorite"
                  icon={<StarIcon />}
                  onClick={() => toggleFavorite(character)}
                  color={favorites.includes(character.name) ? 'yellow.400' : 'gray.400'}
                  ml="auto"
                />
              </Box>
              <Link href={`/character/${character.url.split('/')[5]}`}>
                <Button mt="2" colorScheme="teal" size="sm" className={styles.btns}>Details</Button>
              </Link>
            </Box>
          </Box>
        ))}
      </Grid>
      <Box mt="4" display="flex" justifyContent="space-between">
        <Button onClick={() => setPage((prev) => prev - 1)} disabled={page === 1} className={styles.chakra}>Previous</Button>
        <Button onClick={() => setPage((prev) => prev + 1)} className={styles.chakra}>Next</Button>
      </Box>
    </Box>
  );
};

export default Home;

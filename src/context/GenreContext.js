import React, { createContext, useState, useEffect } from 'react';

import { getGenres } from '../api';

export const GenreContext = createContext();

export const GenreProvider = ({ children }) => {
  const [genres, setGenres] = useState([]);

  useEffect(() => {
    getGenres().then(setGenres).catch(console.error);
  }, []);

  return <GenreContext.Provider value={genres}>{children}</GenreContext.Provider>;
};

import React, { useContext } from 'react';
import { Card, Rate, Tag } from 'antd';

import { GenreContext } from '../context/GenreContext';
import './MovieList.css';

const { Meta } = Card;

const getRatingColor = (rating) => {
  if (rating > 7) return '#66E900';
  if (rating >= 5) return '#E9D100';
  if (rating >= 3) return '#E97E00';
  return '#E90000';
};

const MovieCard = ({ movie, onRate, value }) => {
  const genres = useContext(GenreContext);

  const getGenreNames = (genreIds) => {
    return genreIds
      .map((id) => {
        const genre = genres.find((g) => g.id === id);
        return genre ? genre.name : null;
      })
      .filter(Boolean);
  };

  const movieGenres = getGenreNames(movie.genre_ids);

  return (
    <Card
      key={movie.id}
      hoverable
      className="movie-card"
      cover={
        <img
          className="movie-card__banner"
          alt={movie.title}
          src={
            movie.poster_path
              ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
              : 'https://via.placeholder.com/150'
          }
        />
      }
    >
      <Meta
        title={
          <div className="movie-card__title">
            {movie.title}
            <div className="movie-card__rating-circle" style={{ borderColor: getRatingColor(movie.vote_average) }}>
              {movie.vote_average ? movie.vote_average.toFixed(1) : 'N/A'}
            </div>
          </div>
        }
        description={
          <div className="movie-card__release-date">{movie.release_date ? movie.release_date : 'Unknow data'}</div>
        }
      />
      <div className="movie-card__tags">
        {movieGenres.map((genre) => (
          <Tag key={genre}>{genre}</Tag>
        ))}
      </div>

      <div className="movie-card__truncate-description">
        <p className="movie-description">
          {movie.overview ? movie.overview.substring(0, 200) + '...' : 'No description available'}
        </p>
      </div>

      <Rate allowHalf value={value || 0} onChange={(value) => onRate(movie.id, value)} count={10} />
    </Card>
  );
};

export default MovieCard;

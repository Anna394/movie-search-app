import React, { Component } from 'react';
import { Card } from 'antd';

import { getMovies } from '../api';
import './MovieList.css';

function truncateText(text, maxLength) {
  if (text.length <= maxLength) return text;

  let truncated = text.substring(0, maxLength);
  let lastSpaceIndex = truncated.lastIndexOf(' ');

  if (lastSpaceIndex > 0) {
    truncated = truncated.substring(0, lastSpaceIndex);
  }

  return truncated + '...';
}

class MovieList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      movies: [], // Изначально массив фильмов пустой
    };
  }

  componentDidMount() {
    getMovies().then((movies) => {
      this.setState({ movies }); // Обновляем состояние после загрузки данных
    });
  }

  render() {
    return (
      <div className="movie-list">
        {this.state.movies.map((movie) => (
          <Card key={movie.id} className="movie-card">
            <div className="movie-content">
              <img alt={movie.title} src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} />
              <div className="movie-info">
                <h3>{movie.title}</h3>
                <p className="release-date">{movie.release_date}</p>
                <p className="description">{truncateText(movie.overview, 200)}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>
    );
  }
}

export default MovieList;

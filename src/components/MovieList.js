import React, { Component } from 'react';
import { Card } from 'antd';
import { format } from 'date-fns';

import { getMovies } from '../api';
import './MovieList.css';

const { Meta } = Card;

// Функция для усечения текста без обрезки слов
function truncateText(text, maxLength) {
  if (text.length <= maxLength) return text;

  let truncated = text.substring(0, maxLength);
  let lastSpaceIndex = truncated.lastIndexOf(' ');

  if (lastSpaceIndex > 0) {
    truncated = truncated.substring(0, lastSpaceIndex);
  }

  return truncated + '...';
}

function formatDate(dateString) {
  if (!dateString) return 'Unknown date'; // Обработка пустых значений
  return format(new Date(dateString), 'MMMM d, yyyy'); // Пример: March 5, 2020
}

class MovieList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      movies: [],
    };
  }

  componentDidMount() {
    getMovies().then((movies) => {
      this.setState({ movies });
    });
  }

  render() {
    return (
      <div className="movie-list">
        {this.state.movies.map((movie) => (
          <Card
            key={movie.id}
            hoverable
            className="movie-card"
            cover={
              <img
                alt={movie.title}
                src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                style={{ width: 180, height: 280, objectFit: 'cover' }}
              />
            }
          >
            <Meta
              title={movie.title}
              description={
                <>
                  <p className="release-date">{formatDate(movie.release_date)}</p>
                  <p className="description">{truncateText(movie.overview, 200)}</p>
                </>
              }
            />
          </Card>
        ))}
      </div>
    );
  }
}

export default MovieList;

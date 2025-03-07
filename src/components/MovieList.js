import React, { Component } from 'react';
import { Spin, Alert, Input, Pagination } from 'antd';
import debounce from 'lodash/debounce';

import { debouncedGetMovies, rateMovie } from '../api';

import MovieCard from './MovieCard';
import './MovieList.css';

const { Search } = Input;

class MovieList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      movies: [],
      loading: true,
      error: null,
      query: 'return',
      currentPage: 1,
      totalResults: 0,
      ratings: {},
    };

    this.debouncedFetchMovies = debounce(this.fetchMovies, 500);
  }

  componentDidMount() {
    this.fetchMovies();

    const savedRatings = localStorage.getItem('movieRatings');
    if (savedRatings) {
      this.setState({ ratings: JSON.parse(savedRatings) });
    }
  }

  fetchMovies = () => {
    const { query, currentPage } = this.state;
    this.setState({ loading: true, error: null });

    debouncedGetMovies(query, currentPage)
      .then((data) => {
        this.setState({
          movies: data.results,
          totalResults: data.total_results,
          loading: false,
        });
      })
      .catch((error) => {
        this.setState({
          error: error.message || 'Failed to load movies. Please try again later.',
          loading: false,
          movies: [],
        });
      });
  };

  handleSearch = (e) => {
    const newQuery = e.target.value.trim();
    this.setState({ query: newQuery, currentPage: 1 }, this.debouncedFetchMovies);
  };

  handlePageChange = (page) => {
    this.setState({ currentPage: page }, this.fetchMovies);
  };

  handleRate = (movieId, value) => {
    // Обновляем локальное состояние
    this.setState((prevState) => {
      const updatedRatings = {
        ...prevState.ratings,
        [movieId]: value,
      };

      // Сохраняем обновленные рейтинги в localStorage
      localStorage.setItem('movieRatings', JSON.stringify(updatedRatings));

      return { ratings: updatedRatings };
    });

    // Отправляем рейтинг на сервер
    rateMovie(movieId, value)
      .then(() => {
        console.log(`Rated movie ${movieId} with value ${value}`);
      })
      .catch((error) => {
        console.error('Error submitting rating:', error);
      });
  };

  render() {
    const { loading, error, movies, query, currentPage, totalResults } = this.state;

    if (loading) {
      return (
        <div className="loading-container">
          <Spin size="large" />
        </div>
      );
    }

    return (
      <div>
        <div className="search-container">
          <Search
            placeholder="Search for movies..."
            value={query}
            onChange={this.handleSearch}
            allowClear
            size="large"
          />
        </div>

        {error && (
          <div className="error-container">
            <Alert message="Error" description={error} type="error" showIcon />
          </div>
        )}

        {movies.length === 0 && !loading && !error && <p className="no-movies">No movies found.</p>}

        <div className="movie-list">
          {movies.map((movie) => (
            <MovieCard
              key={movie.id}
              movie={movie}
              onRate={this.handleRate}
              value={this.state.ratings[movie.id] || 0}
            />
          ))}
        </div>

        {totalResults > 20 && (
          <Pagination
            className="pagination"
            current={currentPage}
            total={totalResults}
            pageSize={20}
            onChange={this.handlePageChange}
            showSizeChanger={false}
          />
        )}
      </div>
    );
  }
}

export default MovieList;

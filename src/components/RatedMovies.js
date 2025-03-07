import React, { Component } from 'react';
import { Spin, Alert } from 'antd';

import { getRatedMovies, rateMovie } from '../api';

import MovieCard from './MovieCard';
import './MovieList.css';

class RatedMovies extends Component {
  constructor(props) {
    super(props);
    this.state = {
      movies: [],
      loading: true,
      error: null,
      ratings: {},
    };
  }

  componentDidMount() {
    this.fetchRatedMovies();

    const savedRatings = localStorage.getItem('movieRatings');
    if (savedRatings) {
      this.setState({ ratings: JSON.parse(savedRatings) });
    }
  }

  componentDidUpdate(prevProps) {
    if (prevProps.activeTab !== this.props.activeTab && this.props.activeTab === 'rated') {
      this.fetchRatedMovies();
      const savedRatings = localStorage.getItem('movieRatings');
      if (savedRatings) {
        this.setState({ ratings: JSON.parse(savedRatings) });
      }
    }
  }

  fetchRatedMovies = () => {
    this.setState({ loading: true, error: null });

    getRatedMovies()
      .then((data) => {
        this.setState({
          movies: data.results,
          loading: false,
        });
      })
      .catch((error) => {
        this.setState({
          error: error.message || 'Failed to load rated movies.',
          loading: false,
          movies: [],
        });
      });
  };

  handleRate = (movieId, value) => {
    this.setState((prevState) => {
      const updatedRatings = {
        ...prevState.ratings,
        [movieId]: value,
      };

      localStorage.setItem('movieRatings', JSON.stringify(updatedRatings));

      return { ratings: updatedRatings };
    });

    rateMovie(movieId, value)
      .then(() => {
        console.log(`Rated movie ${movieId} with value ${value}`);
      })
      .catch((error) => {
        console.error('Error submitting rating:', error);
      });
  };

  render() {
    const { loading, error, movies } = this.state;

    if (loading) {
      return (
        <div className="loading-container">
          <Spin size="large" />
        </div>
      );
    }

    if (movies.length === 0) {
      return <p className="no-movies">Вы еще не оценили ни одного фильма.</p>;
    }

    return (
      <div className="movie-container">
        {error && (
          <div className="error-container">
            <Alert message="Error" description={error} type="error" showIcon />
          </div>
        )}

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
      </div>
    );
  }
}

export default RatedMovies;

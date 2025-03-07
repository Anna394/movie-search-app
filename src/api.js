import debounce from 'lodash/debounce';

const API_KEY = 'c51cc154c02c1532b91cfd6db7f63afd';
const BASE_URL = 'https://api.themoviedb.org/3';

// Функция запроса фильмов с учетом поиска и страницы
export const getMovies = (query = 'return', page = 1) => {
  if (!navigator.onLine) {
    return Promise.reject(new Error('No internet connection. Please check your network.'));
  }

  return fetch(`${BASE_URL}/search/movie?query=${query}&api_key=${API_KEY}&language=en-US&page=${page}`)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`Ошибка: ${response.status} ${response.statusText}`);
      }
      return response.json();
    })
    .then((data) => {
      if (!data || !Array.isArray(data.results)) {
        throw new Error('Invalid API response: results is missing or not an array');
      }
      return data;
    })
    .catch((error) => {
      console.error('Ошибка при получении данных:', error);
      throw error;
    });
};

// Оборачиваем getMovies в debounce, но теперь он возвращает промис
const debouncedFunction = debounce((query, page, callback) => {
  getMovies(query, page).then(callback).catch(console.error);
}, 500);

export const debouncedGetMovies = (query, page) => {
  return new Promise((resolve) => {
    debouncedFunction(query, page, resolve);
  });
};

export const createGuestSession = () => {
  return fetch(`${BASE_URL}/authentication/guest_session/new?api_key=${API_KEY}`)
    .then((response) => response.json())
    .then((data) => {
      if (data.success) {
        localStorage.setItem('guest_session_id', data.guest_session_id);
        return data.guest_session_id;
      } else {
        throw new Error('Failed to create guest session.');
      }
    })
    .catch((error) => {
      console.error('Error creating guest session:', error);
      throw error;
    });
};

export const getRatedMovies = () => {
  const guestSessionId = localStorage.getItem('guest_session_id');
  if (!guestSessionId) {
    return Promise.reject(new Error('No guest session ID found.'));
  }

  return fetch(
    `${BASE_URL}/guest_session/${guestSessionId}/rated/movies?api_key=${API_KEY}&language=en-US&sort_by=created_at.desc`
  )
    .then((response) => {
      if (response.status === 404) {
        // Если API возвращает 404, значит, нет оцененных фильмов
        return { results: [], total_results: 0 };
      }
      if (!response.ok) {
        throw new Error(`Ошибка: ${response.status}`);
      }
      return response.json();
    })
    .then((data) => {
      if (!data.results) {
        throw new Error('Invalid API response');
      }
      return data;
    })
    .catch((error) => {
      console.error('Ошибка при получении оцененных фильмов:', error);
      throw error;
    });
};

export const rateMovie = (movieId, rating) => {
  const guestSessionId = localStorage.getItem('guest_session_id');
  if (!guestSessionId) {
    return Promise.reject(new Error('No guest session ID found. Please create a guest session first.'));
  }

  return fetch(`${BASE_URL}/movie/${movieId}/rating?api_key=${API_KEY}&guest_session_id=${guestSessionId}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ value: rating }),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error(`Ошибка: ${response.status} ${response.statusText}`);
      }
      return response.json();
    })
    .then((data) => {
      console.log('Rating submitted successfully:', data);
      return data;
    })
    .catch((error) => {
      console.error('Ошибка при отправке рейтинга:', error);
      throw error;
    });
};

// Функция для получения списка жанров
export const getGenres = () => {
  return fetch(`${BASE_URL}/genre/movie/list?api_key=${API_KEY}&language=en-US`)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`Ошибка: ${response.status} ${response.statusText}`);
      }
      return response.json();
    })
    .then((data) => {
      if (!data || !Array.isArray(data.genres)) {
        throw new Error("Invalid API response: 'genres' is missing or not an array");
      }
      return data.genres;
    })
    .catch((error) => {
      console.error('Ошибка при получении жанров:', error);
      throw error;
    });
};

const API_KEY = 'c51cc154c02c1532b91cfd6db7f63afd';
const BASE_URL = 'https://api.themoviedb.org/3';

export const getMovies = () => {
  return fetch(`${BASE_URL}/search/movie?query=return&api_key=${API_KEY}&language=en-US&page=1`)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`Ошибка: ${response.status} ${response.statusText}`);
      }
      return response.json(); // Превращаем HTTP-ответ в JSON (возвращает Promise)
    })
    .then((data) => {
      console.log(data); // JSON-объект со всеми данными
      return data.results; // Возвращаем только список фильмов
    })
    .catch((error) => console.error('Ошибка при получении данных:', error));
};

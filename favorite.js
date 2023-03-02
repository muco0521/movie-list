const BASE_URL = 'https://webdev.alphacamp.io'
const INDEX_URL = BASE_URL + '/api/movies/'
const POSTER_URL = BASE_URL + '/posters/'

//5-1.
const movies = JSON.parse(localStorage.getItem('favoriteMovies')) || []

const dataPanel = document.querySelector('#data-panel')

//1. //4-1. //5-2
function renderMovieList(data) {
  let rawHTML = ''
  data.forEach((item) => {
    rawHTML += `
      <div class="col-sm-3">
        <div class="mb-2">
          <div class="card">
            <img src="${POSTER_URL + item.image}" class="card-img-top" alt="Movie Poster">
            <div class="card-body">
              <h5 class="card-title">${item.title}</h5>
            </div>
            <div class="card-footer">
              <button type="button" class="btn btn-sm btn-primary btn-show-modal" data-bs-toggle="modal" data-bs-target="#movie-modal" data-id="${item.id}" >More</button>
              <button type="button" class="btn btn-sm btn-danger btn-remove-favorite" data-id="${item.id}">X</button>
            </div>
          </div>
        </div>
      </div>
    `
  })
  dataPanel.innerHTML = rawHTML
}

//2-2.
function showMovieModal(id) {
  const modalTitle = document.querySelector('#movie-modal-title')
  const modalImage = document.querySelector('#movie-modal-image')
  const modalDate = document.querySelector('#movie-modal-date')
  const modalDescription = document.querySelector('#movie-modal-description')

  axios
    .get(INDEX_URL + id)
    .then((res) => {
      console.log(res)
      modalTitle.textContent = res.data.results.title
      modalImage.src = POSTER_URL + res.data.results.image
      modalDate.textContent = 'release at: ' + res.data.results.release_date
      modalDescription.textContent = res.data.results.description
    })
}

//5-4.
function removeFavoriteList(id) {
  if (!movies || !movies.length) return

  const movieIndex = movies.findIndex((movie) => movie.id === id)
  if (movieIndex === -1) return

  movies.splice(movieIndex, 1)
  localStorage.setItem('favoriteMovies', JSON.stringify(movies))
  renderMovieList(movies)
}


//2-3 //4-2. //5-3.
dataPanel.addEventListener('click', function onDataPanelClick(event) {
  if (event.target.matches('.btn-show-modal')) {
    showMovieModal(Number(event.target.dataset.id))
  } else if (event.target.matches('.btn-remove-favorite')) {
    removeFavoriteList(Number(event.target.dataset.id))
  }
})

axios
  .get(INDEX_URL)
  .then((res) => {
    //for...of
    // for(const movie of res.data.results) {
    //   movies.push(movie)
    // }

    //spread operator
    renderMovieList(movies)
  })

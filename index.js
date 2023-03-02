const BASE_URL = 'https://webdev.alphacamp.io'
const INDEX_URL = BASE_URL + '/api/movies/'
const POSTER_URL = BASE_URL + '/posters/'
const MOVIES_PER_PAGE = 12

const movies = []
let filteredMovies = [] //7-1.
let currentMode = 'card' //8-1.
let currentPage = 1 //8-5.

const dataPanel = document.querySelector('#data-panel')
const searchForm = document.querySelector('#search-form')
const searchInput = document.querySelector('#search-input')
const paginator = document.querySelector('#paginator')
const displayMode = document.querySelector('#display-mode')
const cardMode = document.querySelector('#card-mode')
const listMode = document.querySelector('#list-mode')

//8-4.
function renderDisplayMode(data) {
  let rawHTML = ''
  if (currentMode !== 'card') {
    let rawHTML = ''
    data.forEach((item) => {
      rawHTML += `
    <div class="col-12">
        <div class="d-flex flex-row justify-content-between border-top">
          <div class="my-4">
            <h5 class="card-title">${item.title}</h5>
          </div>
          <div class="my-4">
            <button type="button" class="btn btn-sm btn-secondary btn-show-modal" data-bs-toggle="modal" data-bs-target="#movie-modal" data-id="${item.id}" >More</button>
            <i type="button" class="ms-2 fa-sharp fa-regular fa-heart fa-lg btn-add-favorite text-danger" data-id="${item.id}"></i>
          </div>
        </div>
    </div>
  `
    })
    dataPanel.innerHTML = rawHTML
  } else {
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
              <button type="button" class="btn btn-sm btn-secondary btn-show-modal" data-bs-toggle="modal" data-bs-target="#movie-modal" data-id="${item.id}" >More</button>
              <i type="button" class="ms-2 fa-sharp fa-regular fa-heart fa-lg btn-add-favorite text-danger" data-id="${item.id}"></i>
            </div>
          </div>
        </div>
      </div>
    `
    })
    dataPanel.innerHTML = rawHTML
  }
  showCurrentFavorite()
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

//6-1. //7-2
function getMoviesByPage(page) {
  const data = filteredMovies.length ? filteredMovies : movies
  const startIndex = (page - 1) * MOVIES_PER_PAGE
  return data.slice(startIndex, startIndex + MOVIES_PER_PAGE)
}

//6-2.
function renderPaginator(amount) {
  const numberOfPage = Math.ceil(amount / MOVIES_PER_PAGE)
  let rawHTML = ''
  for (let page = 1; page <= numberOfPage; page++) {
    rawHTML += `<li class="page-item"><a class="page-link" data-bs-toggle="list" href="#" data-page="${page}">${page}</a></li>`
  }
  paginator.innerHTML = rawHTML
  document.querySelector('a.page-link').classList.add('active')//8-5.
}

//4-3.
function addFavoriteList(id) {
  const list = JSON.parse(localStorage.getItem('favoriteMovies')) || []
  const movie = movies.find((movie) => movie.id === id)
  if (list.some((item) => item.id === id)) return 
  
  list.push(movie)
  localStorage.setItem('favoriteMovies', JSON.stringify(list))
}


//8-4.showCurrentModeIcon
function showCurrentModeIcon(currentMode) {
  if (currentMode !== 'list') {
    listMode.classList.remove("text-dark")
    cardMode.classList.add("text-dark")
  } else {
    cardMode.classList.remove("text-dark")
    listMode.classList.add("text-dark")
  }
}

//8-5.showCurrentPaginator
function showCurrentPaginator(currentPage) {
  const page = document.querySelectorAll('a.page-link')[currentPage - 1]
  const currentActivePage = document.querySelector('a.page-link.active')
  currentActivePage.classList.remove("active")
  page.classList.add('active')
}


//8-6.showCurrentFavoriteIcon
function showCurrentFavorite() {
  const favoriteButtons = document.querySelectorAll(".btn-add-favorite")
  const list = JSON.parse(localStorage.getItem('favoriteMovies'))
  if (list.length !== 0) {
    favoriteButtons.forEach((btn) => {
      if (list.find((item) => item.id === Number(btn.dataset.id))) {
        btn.classList.replace("fa-regular", "fa-solid")
      } else {
        btn.classList.replace("fa-solid", "fa-regular")
      }
    })
  }
}

//8-7.removeFavoriteList
function removeFavoriteList(id) {
  const data = JSON.parse(localStorage.getItem('favoriteMovies')) || []
  if (!data || !data.length) return

  const movieIndex = data.findIndex((movie) => movie.id === id)
  if (movieIndex === -1) return

  data.splice(movieIndex, 1)
  localStorage.setItem('favoriteMovies', JSON.stringify(data))
}


//2-3 //4-2.
dataPanel.addEventListener('click', function onDataPanelClick(event) {
  if (event.target.matches('.btn-show-modal')) {
    showMovieModal(Number(event.target.dataset.id))
  } else if (event.target.matches('.fa-regular')) {
    addFavoriteList(Number(event.target.dataset.id))
  } else if (event.target.matches('.fa-solid')) {
    removeFavoriteList(Number(event.target.dataset.id))
  }
  showCurrentFavorite()
})


//3-1.
searchForm.addEventListener('submit', function onSearchFormSubmitted(event) {
  event.preventDefault()
  const keyword = searchInput.value.trim().toLowerCase()

  filteredMovies = movies.filter((movie) =>
    movie.title.toLowerCase().includes(keyword)
  )

  if (!filteredMovies.length) {
    return alert(`您輸入的關鍵字：${keyword} 沒有符合條件的電影`)
  }
  renderPaginator(filteredMovies.length)//7-3.
  currentPage = 1
  renderDisplayMode(getMoviesByPage(currentPage))//7-3.
})

//6-3. addEventListener - paginator
paginator.addEventListener('click', function onPaginatorClick(event) {
  if (event.target.tagName !== 'A') return
  let page = Number(event.target.dataset.page)
  currentPage = page
  showCurrentPaginator(page)
  renderDisplayMode(getMoviesByPage(page))
  
})

//8-3.displayMode
displayMode.addEventListener('click', function onDisplayModeClick(event) {
  if (event.target.matches('#card-mode')) {
    currentMode = 'card'
    showCurrentModeIcon(currentMode)
    renderDisplayMode(getMoviesByPage(currentPage))
  } else if (event.target.matches('#list-mode')) {
    currentMode = 'list'
    showCurrentModeIcon(currentMode)
    renderDisplayMode(getMoviesByPage(currentPage))
  }
  showCurrentPaginator(currentPage)
})

axios
  .get(INDEX_URL)
  .then((res) => {
    movies.push(...res.data.results)

    renderPaginator(movies.length) //6-2.
    renderDisplayMode(getMoviesByPage(currentPage)) //6-1
    
  })


/////p/////////////////////////////////////////////////////////////////
// document.body.addEventListener('click', function xxx(event) {
//   console.log(event.target)
// })
const API_URL = "http://localhost:3001/films";

// Fetch and display the first movie's details when the page loads
function loadFirstMovie() {
  fetch(`${API_URL}/1`)
    .then((response) => response.json())
    .then((data) => displayMovieDetails(data));
}

// Fetch and display the list of movies
function loadMovies() {
  fetch(API_URL)
    .then((response) => response.json())
    .then((movies) => {
      const movieList = document.getElementById('films');
      movieList.innerHTML = ''; // Clear existing list
      
      movies.forEach((movie) => {
        const li = document.createElement('li');
        li.classList.add('film', 'item');
        li.textContent = movie.title;

        if (movie.capacity - movie.tickets_sold === 0) {
          li.classList.add('sold-out');
          li.textContent += " (Sold Out)";
        }

        // Event listener to show details when a movie is clicked
        li.addEventListener('click', () => {
          displayMovieDetails(movie);
        });

        movieList.appendChild(li);
      });
    });
}

// Display movie details in the DOM
function displayMovieDetails(movie) {
  const poster = document.getElementById('poster');
  const title = document.getElementById('title');
  const runtime = document.getElementById('runtime');
  const showtime = document.getElementById('showtime');
  const description = document.getElementById('film-info'); // Fixed to match the ID in HTML
  const availableTickets = document.getElementById('available-tickets'); // Fixed to match the new ID
  const buyTicketButton = document.getElementById('buy-ticket');

  poster.src = movie.poster;
  title.textContent = movie.title;
  runtime.textContent = movie.runtime + " minutes"; // Adding unit to runtime
  showtime.textContent = movie.showtime;
  description.textContent = movie.description; // Make sure this points to the correct ID
  availableTickets.textContent = movie.capacity - movie.tickets_sold;

  // Reset button state
  buyTicketButton.textContent = "Buy Ticket";
  buyTicketButton.disabled = false;

  // Event listener for buying tickets
  buyTicketButton.onclick = function () {
    if (movie.capacity - movie.tickets_sold > 0) {
      movie.tickets_sold += 1;
      availableTickets.textContent = movie.capacity - movie.tickets_sold;

      // Update the server with the new number of tickets sold
      fetch(`${API_URL}/${movie.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ tickets_sold: movie.tickets_sold }),
      })
      .then((response) => response.json())
      .then((updatedMovie) => {
        if (updatedMovie.capacity - updatedMovie.tickets_sold === 0) {
          buyTicketButton.textContent = "Sold Out";
          buyTicketButton.disabled = true;
        }
        loadMovies(); // Reload movie list to reflect updated availability
      });
    }
  };
}

// Load initial content
document.addEventListener('DOMContentLoaded', () => {
  loadFirstMovie();
  loadMovies();
});

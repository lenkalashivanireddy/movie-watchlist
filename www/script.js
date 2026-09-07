const API_KEY = "71dc6fadc14af427806d3ccd01be9ccf";

const searchInput = document.querySelector("input");
const searchButton = document.querySelector("button");

const movieResults = document.querySelector("#movie-results");
const watchlistResults = document.querySelector("#watchlist-results");

searchButton.addEventListener("click", searchMovies);

displayWatchlist();

async function searchMovies() {
    const movieName = searchInput.value.trim();

    if (movieName === "") {
        alert("Please enter a movie name!");
        return;
    }

    const url = `https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(movieName)}`;

    try {
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error("Something went wrong while searching.");
        }

        const data = await response.json();

        displayMovies(data.results);

    } catch (error) {
        console.error(error);
        alert("Unable to search movies. Please try again.");
    }
}

function displayMovies(movies) {
    movieResults.innerHTML = "";

    if (movies.length === 0) {
        movieResults.innerHTML = "<p>No movies found!</p>";
        return;
    }

    movies.forEach(function (movie) {

        const movieCard = document.createElement("div");
        movieCard.classList.add("movie-card");

        const poster = movie.poster_path
            ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
            : "https://via.placeholder.com/500x750?text=No+Poster";

        movieCard.innerHTML = `
            <img src="${poster}" alt="${movie.title}">

            <h2>${movie.title}</h2>

            <p>⭐ Rating: ${movie.vote_average.toFixed(1)}</p>

            <p>📅 Release: ${movie.release_date || "Unknown"}</p>

            <button class="watchlist-button">
                ➕ Add to Watchlist
            </button>
        `;

        const watchlistButton =
            movieCard.querySelector(".watchlist-button");

        watchlistButton.addEventListener("click", function () {
            addToWatchlist(movie);
        });

        movieResults.appendChild(movieCard);
    });
}

function addToWatchlist(movie) {

    let watchlist =
        JSON.parse(localStorage.getItem("watchlist")) || [];

    const alreadyAdded = watchlist.some(function (item) {
        return item.id === movie.id;
    });

    if (alreadyAdded) {
        alert("Movie is already in your watchlist!");
        return;
    }

    movie.watched = false;

    watchlist.push(movie);

    localStorage.setItem(
        "watchlist",
        JSON.stringify(watchlist)
    );

    alert(movie.title + " added to your watchlist!");

    displayWatchlist();
}

function displayWatchlist() {

    let watchlist =
        JSON.parse(localStorage.getItem("watchlist")) || [];

    watchlistResults.innerHTML = "";

    if (watchlist.length === 0) {
        watchlistResults.innerHTML =
            "<p>Your watchlist is empty.</p>";
        return;
    }

    watchlist.forEach(function (movie) {

        const movieCard = document.createElement("div");
        movieCard.classList.add("movie-card");

        if (movie.watched) {
            movieCard.classList.add("watched");
        }

        const poster = movie.poster_path
            ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
            : "https://via.placeholder.com/500x750?text=No+Poster";

        movieCard.innerHTML = `
            <img src="${poster}" alt="${movie.title}">

            <h2>${movie.title}</h2>

            <p>⭐ Rating: ${movie.vote_average.toFixed(1)}</p>

            <button class="watched-button">
                ${movie.watched ? "✓ Watched" : "Mark as Watched"}
            </button>

            <button class="remove-button">
                🗑 Remove
            </button>
        `;

        const watchedButton =
            movieCard.querySelector(".watched-button");

        const removeButton =
            movieCard.querySelector(".remove-button");

        watchedButton.addEventListener("click", function () {
            markAsWatched(movie.id);
        });

        removeButton.addEventListener("click", function () {
            removeFromWatchlist(movie.id);
        });

        watchlistResults.appendChild(movieCard);
    });
}

function markAsWatched(movieId) {

    let watchlist =
        JSON.parse(localStorage.getItem("watchlist")) || [];

    watchlist = watchlist.map(function (movie) {

        if (movie.id === movieId) {
            movie.watched = !movie.watched;
        }

        return movie;
    });

    localStorage.setItem(
        "watchlist",
        JSON.stringify(watchlist)
    );

    displayWatchlist();
}

function removeFromWatchlist(movieId) {

    let watchlist =
        JSON.parse(localStorage.getItem("watchlist")) || [];

    watchlist = watchlist.filter(function (movie) {
        return movie.id !== movieId;
    });

    localStorage.setItem(
        "watchlist",
        JSON.stringify(watchlist)
    );

    displayWatchlist();
}
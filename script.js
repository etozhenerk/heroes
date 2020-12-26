"use strict";

const getData = (cb) => {
  const request = new XMLHttpRequest();
  request.open("GET", "./dbHeroes.json");
  request.addEventListener("readystatechange", () => {
    if (request.readyState !== 4) return;
    if (request.status === 200) {
      const response = JSON.parse(request.responseText);
      cb(response);
    } else {
      new Error(request.statusText);
    }
  });
  request.send();
};

const proection = (fields, obj) =>
  Object.keys(obj)
    .filter((key) => fields.includes(key))
    .reduce((newObj, key) => {
      newObj[key] = obj[key];
      return newObj;
    }, {});

const renderMovies = ([...arr]) => {
  const moviesList = document.querySelector(".movies-list");
  arr.sort().forEach((movie) => {
    const li = document.createElement("li");
    li.classList.add("movies-list__item");
    li.innerHTML = `<span class="movies-list__item-text">${movie}</span>`;
    moviesList.append(li);
  });
};

const getMovies = (data) => {
  const movies = new Set();
  const newHeroes = data.map((item) => proection(["movies"], item));
  newHeroes.forEach((elem) => {
    if (elem.movies) {
      elem.movies.forEach((movie) => {
        movies.add(movie);
      });
    }
  });
  renderMovies(movies);
};

getData(getMovies);

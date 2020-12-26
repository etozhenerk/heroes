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
const renderCards = (arr) => {
  console.log(arr);
  const heroesList = document.querySelector(".heroes-list > .row");

  arr.forEach((item) => {
    const card = document.createElement("div");
    card.classList.add("col-3");
    card.innerHTML = `
              <div class="heroes-item">
                <div class="heroes-item__img">
                  <img src="./${item.photo}" alt="">
                </div>
                <div class="heroes-item__descr">
                  <div class="heroes-item__hero-name"><span id="name">${item.name}</span>
                  </div>
                  <div class="heroes-item__text">
                    <div class="heroes-item__real-name"><u><b>Real name:</b></u> <span id="realName">${item.realName}</span></div>
                    <div class="heroes-item__movies"><u><b>Movies:</b></u> <span id="movies">${item.movies}</span>
                    </div>
                    <div class="heroes-item__status"><u><b>Hero Status:</b></u> <span id="status">${item.status}</span>
                  </div>
                  </div>
                </div>
              </div>
    `;
    console.log(item.movies);
    heroesList.append(card);
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
const getHeroes = (data) => {
  const newHeroes = data.map((item) =>
    proection(["name", "realName", "photo", "movies", "status"], item)
  );
  renderCards(newHeroes);
};

getData(getMovies);
getData(getHeroes);

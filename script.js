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
  const moviesList = document.querySelector(".options-container");
  arr.sort().forEach((movie) => {
    const option = document.createElement("div");
    option.classList.add("option");
    option.innerHTML = `<input type="radio" class="radio" id="${movie}" name="category">
                          <label for="${movie}">${movie}</label>`;
    moviesList.append(option);
  });
};
const renderCards = (arr) => {
  const heroesList = document.querySelector(".heroes-list > .row");

  arr.forEach((item) => {
    const card = document.createElement("div");
    card.classList.add("col-7");
    card.classList.add("col-sm-6");
    card.classList.add("col-md-4");
    card.classList.add("col-lg-4");
    card.innerHTML = `
              <div class="heroes-item" data-name="${item.name}">
                <div class="heroes-item__img">
                  <img src="./${item.photo}" alt="">
                </div>
                <div class="heroes-item__descr">
                  <div class="heroes-item__hero-name"><span id="name">${
                    item.name
                  }</span>
                  </div>
                  <div class="heroes-item__text">
                    <div class="heroes-item__real-name"><u><b>Real name:</b></u> <span>${
                      item.realName || "Реальное имя не известно"
                    }</span></div>
                    <div class="heroes-item__status"><u><b>Hero Status:</b></u> <span>${
                      item.status
                    }</span>
                  </div>
                  </div>
                </div>
              </div>
    `;
    heroesList.append(card);
  });
};

const changeOption = () => {
  const selected = document.querySelector(".selected"),
    optionsContainer = document.querySelector(".options-container");

  selected.addEventListener("click", () => {
    optionsContainer.classList.toggle("active");
  });

  optionsContainer.addEventListener("click", (event) => {
    const target = event.target;
    if (target.matches(".option")) {
      selected.innerHTML = target.querySelector("label").innerHTML;
      optionsContainer.classList.remove("active");
    }
  });
};

changeOption();

const renderPopup = (name) => {
  const heroName = document.querySelector(".hero-name"),
    realName = document.querySelector(".real-name"),
    actorName = document.querySelector(".actor-name"),
    status = document.querySelector(".status"),
    race = document.querySelector(".race"),
    citizenship = document.querySelector(".citizenship"),
    movies = document.querySelector(".movies"),
    heroImg = document.querySelector(".hero-img");
  getData((data) => {
    const heroesCard = data.map((item) =>
      proection(
        [
          "name",
          "realName",
          "actors",
          "citizenship",
          "species",
          "photo",
          "movies",
          "status",
        ],
        item
      )
    );
    heroesCard.forEach((hero) => {
      if (hero.name === name) {
        heroName.textContent = hero.name;
        realName.textContent = hero.realName || "Name unknown";
        actorName.textContent = hero.actors;
        status.textContent = hero.status;
        race.textContent = hero.species;
        citizenship.textContent = hero.citizenship || "Nationality unknown";
        movies.textContent = hero.movies;
        heroImg.src = `./${hero.photo}`;
      }
    });
  });
};

const togglePopup = () => {
  const heroesList = document.querySelector(".heroes-list"),
    popup = document.querySelector(".overlay"),
    body = document.querySelector("body");

  heroesList.addEventListener("click", (event) => {
    const target = event.target.closest(".heroes-item");
    if (target) {
      renderPopup(target.dataset.name);
      setTimeout(() => {
        popup.classList.add("overlay-active");
        body.style.overflow = "hidden";
      }, 100);
    }
  });

  popup.addEventListener("click", (event) => {
    const target = event.target;

    if (target.matches(".overlay") || target.matches(".popup-close")) {
      popup.classList.remove("overlay-active");
      body.style.overflow = "auto";
    }
  });
};

togglePopup();

const getMovies = (data) => {
  const movies = new Set();
  const movie = data.map((item) => proection(["movies"], item));
  movie.forEach((elem) => {
    if (elem.movies) {
      elem.movies.forEach((movie) => {
        movies.add(movie);
      });
    }
  });
  const heroesCard = data.map((item) =>
    proection(["name", "realName", "photo", "movies", "status"], item)
  );
  renderCards(heroesCard);
  renderMovies(movies);
};

getData(getMovies);

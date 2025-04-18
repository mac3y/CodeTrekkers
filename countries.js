let allCountries = [];

async function fetchCountries() {
  try {
    const response = await fetch('https://restcountries.com/v3.1/all');
    const countries = await response.json();
    allCountries = countries;
    displayCountries(allCountries);
  } catch (error) {
    console.error('Error fetching countries:', error);
  }
}

function displayCountries(countries) {
  const container = document.getElementById('countries');
  container.innerHTML = '';

  countries.forEach(country => {
    const card = document.createElement('div');
    card.className = 'country-card';
    card.innerHTML = `
      <img src="${country.flags.png}" alt="Flag of ${country.name.common}">
      <h2>Name: ${country.name.common}</h2>
      <h3>Continent: ${country.continents}</h3>
      <h4>Capital: ${country.capital}</h4>
      <h5>Map<h5>
      <a href="${country.maps.googleMaps}" target="_blank">Google Maps</a>
    `;
    container.appendChild(card);
  });
}

function searchCountry() {
  const query = document.getElementById('searchBar').value.trim().toLowerCase();
  const filteredCountries = allCountries.filter(country =>
    country.name.common.toLowerCase().startsWith(query)
  );
  displayCountries(filteredCountries);
}

function filterByContinent(continent) {
  const filteredCountries = allCountries.filter(country =>
    country.continents.includes(continent)
  );
  displayCountries(filteredCountries);
}

document.getElementById('continent-select').addEventListener('change', function () {
  const selectedContinent = this.value;

  if (selectedContinent === "") {
    displayCountries(allCountries);
  } else {
    filterByContinent(selectedContinent);
  }
});

fetchCountries();

const loginBtn = document.getElementById('loginBtn');
const logoutBtn = document.getElementById('logoutBtn');

function updateAuthButtons() {
  const isAuthenticated = sessionStorage.getItem('isAuthenticated') === 'true';

  if (isAuthenticated) {
    loginBtn.style.display = 'none';
    logoutBtn.style.display = 'block';
  } else {
    loginBtn.style.display = 'block';
    logoutBtn.style.display = 'none';
  }
}

loginBtn.addEventListener('click', () => {
  sessionStorage.setItem('redirectAfterLogin', 'country-viewer.html');
  window.location.href = 'login.html';
});

logoutBtn.addEventListener('click', () => {
  sessionStorage.removeItem('isAuthenticated');
  sessionStorage.removeItem('redirectAfterLogin');
  updateAuthButtons();
  alert('You have been logged out.');
});

updateAuthButtons();
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
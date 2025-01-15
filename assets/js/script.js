const offset = 0;
const limit = 10;
const url = `https://pokeapi.co/api/v2/pokemon?offset=${offset}&limit=${limit}`;

function convertPokemonToHtml(pokemon) {
    return `
       <li class="pokemon">
                <span class="number">#001</span>
                <span class="name">${pokemon.name}</span>
                <div class="detail">
                    <ol class="types">
                        <li class="type">grass</li>
                        <li class="type">poison</li>
                    </ol>
                    <img src="https://github.com/PokeAPI/sprites/blob/master/sprites/pokemon/1.png?raw=true" alt="${pokemon.name}">
                </div>
            </li>
    `;
};

const pokemonLista = document.getElementById('pokemonList');

fetch(url)
    .then(response => response.json())
    .then((jsonBody) => jsonBody.results)
    .then((pokemonList) => {
        for(let i = 0; i < pokemonList.length; i++) {
            const pokemon = pokemonList[i]; 
            pokemonLista.innerHTML += convertPokemonToHtml(pokemon);
        }
    })
    .catch((error) => console.error(error));

const pokeApi = {};

function convertPokeApiDetailToPokemon(pokemonDetail) {
    const pokemon = new Pokemon()
    pokemon.name = pokemonDetail.name;
    pokemon.number = pokemonDetail.order;
    
    const types = pokemonDetail.types.map((typeslot) => typeslot.type.name);
    const[type] = types;
    
    pokemon.type = type;
    pokemon.types = types; 

    pokemon.photo = pokemonDetail.sprites.other.dream_world.front_default;
    return pokemon;
}

pokeApi.getPokemonDetail = (pokemon) => {
    return fetch(pokemon.url)
    .then((response) => response.json())
    .then(convertPokeApiDetailToPokemon)

}


pokeApi.getPokemons = (offset =0, limit=10) => {
    const url = `https://pokeapi.co/api/v2/pokemon?offset=${offset}&limit=${limit}`;

    return fetch(url)
    .then(response => response.json())
    .then((jsonBody) => jsonBody.results)
    .then((pokemons) => pokemons.map((pokemon) => pokeApi.getPokemonDetail(pokemon)))
    .then((detailRequests) => Promise.all(detailRequests))
    .then((pokemonDetails) => pokemonDetails)
}


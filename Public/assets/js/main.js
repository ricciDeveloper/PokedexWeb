const pokemonList = document.getElementById('pokemonList'); // lista onde os pokémons serão exibidos
const loadMoreButton = document.getElementById('loadMoreButton'); //botão para carregar mais pokémons

const maxRecords = 151; //máximo de pokemons que serão carregados
const limit = 10; //numero de pokémons carregados por vez
let offset = 0; //controla a posição da listagem dos pokemons

/**A função convertPokemonToLi(pokemon) gera um elemento HTML <li> para exibir os Pokémon na tela.
 *  Explicação do Código:

${pokemon.number} → Exibe o número do Pokémon.
${pokemon.name} → Nome do Pokémon.
${pokemon.types.map(...).join('')} → Para cada tipo do Pokémon, cria uma <li> dentro da lista <ol>.
${pokemon.photo} → Exibe a imagem do Pokémon.
data-id="${pokemon.number}" → Armazena o ID do Pokémon para ser usado depois.
 */
function convertPokemonToLi(pokemon) {
    return `
        <li class="pokemon ${pokemon.type}" data-id="${pokemon.number}">
            <span class="number">#${pokemon.number}</span>
            <span class="name">${pokemon.name}</span>

            <div class="detail">
                <ol class="types">
                    ${pokemon.types.map((type) => `<li class="type ${type}">${type}</li>`).join('')}
                </ol>

                <img src="${pokemon.photo}" alt="${pokemon.name}">
            </div>

            <!-- Criamos essa div para os detalhes do Pokémon -->
            <div class="pokemon-details"></div>
        </li>
    `;
}
/**Explicação:

event.target.closest(".pokemon") → Captura o elemento <li class="pokemon"> que foi clicado.
Se já estiver expandido (.expanded), ele remove os detalhes.
pokemonCard.getAttribute("data-id") → Obtém o ID do Pokémon.
Chama getPokemonDetails(pokemonId) para buscar informações detalhadas.
Chama showPokemonDetails(pokemonCard, details) para exibir os detalhes. */

// Evento para abrir detalhes do Pokémon
pokemonList.addEventListener("click", async (event) => {
    const pokemonCard = event.target.closest(".pokemon"); //encontra o elemento mais próximo com a classe pokemon
    if (!pokemonCard) return;// Se não clicou em um Pokémon, não faz nada

    // Se o card já estiver expandido, fecha os detalhes
    if (pokemonCard.classList.contains("expanded")) {
        pokemonCard.classList.remove("expanded");
        pokemonCard.querySelector(".pokemon-details").innerHTML = "";
        return;
    }

    // Obtém o ID do Pokémon a partir do atributo `data-id`
    const pokemonId = pokemonCard.getAttribute("data-id");

    // Busca os detalhes do Pokémon na API
    const details = await getPokemonDetails(pokemonId);

    // Exibe os detalhes
    showPokemonDetails(pokemonCard, details);
});
/**
 * 
Explicação:

fetch(url) → Faz uma requisição à API.
await response.json() → Converte a resposta JSON em objeto JavaScript.
data.height / 10 → A altura vem em decímetros, então é convertida para metros.
data.abilities.map(...) → Obtém as habilidades do Pokémon.
 */

// Função para buscar detalhes do Pokémon
async function getPokemonDetails(id) {
    try {
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
        const data = await response.json();  

        return {
            height: data.height / 10, // Convertendo para metros
            weight: data.weight / 10, // Convertendo para kg
            abilities: data.abilities.map(a => a.ability.name).join(", "),
            img: data.sprites.other["official-artwork"].front_default
        };
    } catch (error) {
        console.error("Erro ao buscar detalhes do Pokémon:", error);
        return {};
    }
}
/**Explicação:

card.querySelector(".pokemon-details") → Encontra a <div> onde os detalhes serão inseridos.
innerHTML é atualizado com as novas informações. */
// Função para exibir os detalhes do Pokémon
function showPokemonDetails(card, details) {
    const detailsDiv = card.querySelector(".pokemon-details");
    if (!detailsDiv) return;

    detailsDiv.innerHTML = `
        <p><strong>Altura:</strong> ${details.height} m</p>
        <p><strong>Peso:</strong> ${details.weight} kg</p>
        <p><strong>Habilidades:</strong> ${details.abilities}</p>
        <img src="${details.img}" alt="Imagem de ${card.querySelector('.name').innerText}">
    `;

    card.classList.add("expanded");
}

// Carregar Pokémon na tela
function loadPokemonItens(offset, limit) {
    pokeApi.getPokemons(offset, limit).then((pokemons = []) => {
        const newHtml = pokemons.map(convertPokemonToLi).join('');
        pokemonList.innerHTML += newHtml;
    });
}

loadPokemonItens(offset, limit);

// Botão "Carregar mais"
/** Explicação:

Atualiza o offset para carregar mais Pokémon.
Se atingir o limite (maxRecords), o botão é removido.*/
loadMoreButton.addEventListener('click', () => {
    offset += limit;
    const qtdRecordsWithNextPage = offset + limit;

    if (qtdRecordsWithNextPage >= maxRecords) {
        const newLimit = maxRecords - offset;
        loadPokemonItens(offset, newLimit);

        loadMoreButton.parentElement.removeChild(loadMoreButton);
    } else {
        loadPokemonItens(offset, limit);
    }
});

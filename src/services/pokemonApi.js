const BASE_URL =
  "https://pokemonapi20251004230808-cjencdcubyf9h3df.canadacentral-01.azurewebsites.net/api/Pokemon";
// Helper function to handle API errors
async function handleResponse(response) {
  if (!response.ok) {
    const error = await response
      .json()
      .catch(() => ({ message: "An error occurred" }));
    throw new Error(error.message || "Request failed");
  }
  return response.json();
}

// Get detailed Pokémon by name or ID
export async function getPokemon(nameOrId) {
  const response = await fetch(`${BASE_URL}/${nameOrId}`);
  return handleResponse(response);
}

// Search Pokémon by name
export async function searchPokemon(name) {
  const response = await fetch(
    `${BASE_URL}/search?name=${encodeURIComponent(name)}`
  );
  return handleResponse(response);
}

// Get paginated list of Pokémon
export async function getPokemonList(limit = 20, offset = 0) {
  const response = await fetch(
    `${BASE_URL}/list?limit=${limit}&offset=${offset}`
  );
  return handleResponse(response);
}

// Get all Pokémon types
export async function getTypes() {
  const response = await fetch(`${BASE_URL}/types`);
  return handleResponse(response);
}

// Get Pokémon by type
export async function getPokemonByType(type) {
  const response = await fetch(`${BASE_URL}/type/${type}`);
  return handleResponse(response);
}

// Get all abilities
export async function getAbilities() {
  const response = await fetch(`${BASE_URL}/abilities`);
  return handleResponse(response);
}

// Get Pokémon by ability
export async function getPokemonByAbility(ability) {
  const response = await fetch(`${BASE_URL}/ability/${ability}`);
  return handleResponse(response);
}

// Compare two Pokémon
export async function comparePokemon(pokemon1, pokemon2) {
  const response = await fetch(`${BASE_URL}/compare`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ pokemon1, pokemon2 }),
  });
  return handleResponse(response);
}

// Filter Pokémon with multiple criteria
export async function filterPokemon(filters, abilities = []) {
  const params = new URLSearchParams();

  // Add each filter parameter if it has a value
  Object.keys(filters).forEach((key) => {
    if (
      filters[key] !== null &&
      filters[key] !== undefined &&
      filters[key] !== ""
    ) {
      params.append(key, filters[key]);
    }
  });

  // Add each ability as a separate parameter
  abilities.forEach((ability) => {
    if (ability) {
      params.append("Abilities", ability);
    }
  });

  const response = await fetch(`${BASE_URL}/filter?${params}`);
  return handleResponse(response);
}

export function capitalize(str) {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export function formatPokemonName(name) {
  if (!name) return '';
  return name.split('-').map(capitalize).join(' ');
}

export function getStatName(stat) {
  const statNames = {
    hp: 'HP',
    attack: 'Attack',
    defense: 'Defense',
    specialAttack: 'Sp. Attack',
    specialDefense: 'Sp. Defense',
    speed: 'Speed',
    total: 'Total'
  };
  return statNames[stat] || capitalize(stat);
}

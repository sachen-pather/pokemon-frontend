"use client";

import { useState } from "react";
import { searchPokemon, getPokemon } from "../services/pokemonApi";
import SearchBar from "../components/SearchBar";
import PokemonCard from "../components/PokemonCard";
import LoadingSpinner from "../components/LoadingSpinner";
import StatBar from "../components/StatBar";
import { formatPokemonName } from "../utils/helpers";
import { getTypeColor } from "../utils/typeColors";

export default function SearchView() {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [selectedPokemon, setSelectedPokemon] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSearch = async () => {
    if (!searchTerm.trim()) return;

    setLoading(true);
    setError("");
    setSelectedPokemon(null);

    try {
      const results = await searchPokemon(searchTerm);
      setSearchResults(results);

      if (results.length === 0) {
        setError("No Pokémon found");
      }
    } catch (err) {
      setError(err.message);
      setSearchResults([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectPokemon = async (pokemon) => {
    setLoading(true);
    setError("");

    try {
      const details = await getPokemon(pokemon.id);
      setSelectedPokemon(details);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-center">
        <SearchBar
          value={searchTerm}
          onChange={setSearchTerm}
          onSearch={handleSearch}
          placeholder="Search Pokémon by name..."
        />
      </div>

      {error && (
        <div className="bg-red-900/50 border border-red-500 text-red-200 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {loading && <LoadingSpinner />}

      {/* Search Results */}
      {!loading && !selectedPokemon && searchResults.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {searchResults.map((pokemon) => (
            <PokemonCard
              key={pokemon.id}
              pokemon={pokemon}
              onClick={handleSelectPokemon}
            />
          ))}
        </div>
      )}

      {/* Detailed View */}
      {!loading && selectedPokemon && (
        <div className="max-w-2xl mx-auto bg-slate-800 border border-purple-500/30 rounded-lg p-6 shadow-2xl">
          <button
            onClick={() => setSelectedPokemon(null)}
            className="mb-4 text-purple-400 hover:text-purple-300 transition-colors"
          >
            ← Back to results
          </button>

          <div className="text-center mb-6">
            <p className="text-gray-400 text-sm">#{selectedPokemon.id}</p>
            <h2 className="text-3xl font-bold capitalize mb-4 text-white">
              {formatPokemonName(selectedPokemon.name)}
            </h2>

            {selectedPokemon.spriteUrl && (
              <div className="bg-slate-900/50 rounded-lg p-4 inline-block">
                <img
                  src={selectedPokemon.spriteUrl || "/placeholder.svg"}
                  alt={selectedPokemon.name}
                  className="w-48 h-48 mx-auto"
                />
              </div>
            )}

            <div className="flex gap-2 justify-center mt-4">
              {selectedPokemon.types.map((type) => (
                <span
                  key={type}
                  className="px-4 py-2 rounded-full text-white font-medium shadow-lg"
                  style={{ backgroundColor: getTypeColor(type) }}
                >
                  {type}
                </span>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="text-center bg-slate-900/50 rounded-lg p-4">
              <p className="text-gray-400">Height</p>
              <p className="text-xl font-bold text-white">
                {selectedPokemon.height / 10} m
              </p>
            </div>
            <div className="text-center bg-slate-900/50 rounded-lg p-4">
              <p className="text-gray-400">Weight</p>
              <p className="text-xl font-bold text-white">
                {selectedPokemon.weight / 10} kg
              </p>
            </div>
          </div>

          <div className="mb-6">
            <h3 className="text-xl font-bold mb-2 text-white">Abilities</h3>
            <div className="flex flex-wrap gap-2">
              {selectedPokemon.abilities.map((ability) => (
                <span
                  key={ability}
                  className="px-3 py-1 bg-purple-600/30 border border-purple-500/50 rounded-full text-sm text-purple-200"
                >
                  {ability}
                </span>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-xl font-bold mb-4 text-white">Stats</h3>
            <StatBar statName="hp" value={selectedPokemon.stats.hp} />
            <StatBar statName="attack" value={selectedPokemon.stats.attack} />
            <StatBar statName="defense" value={selectedPokemon.stats.defense} />
            <StatBar
              statName="specialAttack"
              value={selectedPokemon.stats.specialAttack}
            />
            <StatBar
              statName="specialDefense"
              value={selectedPokemon.stats.specialDefense}
            />
            <StatBar statName="speed" value={selectedPokemon.stats.speed} />
            <div className="mt-4 pt-4 border-t border-purple-500/30">
              <StatBar
                statName="total"
                value={selectedPokemon.stats.total}
                maxValue={720}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

"use client";

import { useState, useEffect } from "react";
import { getPokemonList, getPokemon } from "../services/pokemonApi";
import PokemonCard from "../components/PokemonCard";
import LoadingSpinner from "../components/LoadingSpinner";
import StatBar from "../components/StatBar";
import { formatPokemonName } from "../utils/helpers";
import { getTypeColor } from "../utils/typeColors";

export default function ListView() {
  const [pokemonList, setPokemonList] = useState([]);
  const [selectedPokemon, setSelectedPokemon] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [offset, setOffset] = useState(0);
  const limit = 20;

  useEffect(() => {
    loadPokemonList();
  }, [offset]);

  const loadPokemonList = async () => {
    setLoading(true);
    setError("");

    try {
      const results = await getPokemonList(limit, offset);

      // Fetch details for each Pokémon to get sprites
      const detailsPromises = results.map((p) => getPokemon(p.id));
      const details = await Promise.all(detailsPromises);

      setPokemonList(details);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectPokemon = async (pokemon) => {
    setSelectedPokemon(pokemon);
  };

  const handleNext = () => {
    setOffset(offset + limit);
    setSelectedPokemon(null);
  };

  const handlePrevious = () => {
    if (offset >= limit) {
      setOffset(offset - limit);
      setSelectedPokemon(null);
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-center text-white">
        Pokémon List
      </h2>

      {error && (
        <div className="bg-red-900/50 border border-red-500 text-red-200 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {loading && <LoadingSpinner />}

      {!loading && !selectedPokemon && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {pokemonList.map((pokemon) => (
              <PokemonCard
                key={pokemon.id}
                pokemon={pokemon}
                onClick={handleSelectPokemon}
              />
            ))}
          </div>

          <div className="flex justify-center gap-4">
            <button
              onClick={handlePrevious}
              disabled={offset === 0}
              className="px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 disabled:from-gray-600 disabled:to-gray-600 disabled:cursor-not-allowed transition-all shadow-lg"
            >
              Previous
            </button>
            <span className="px-6 py-2 bg-slate-800 border border-purple-500/30 text-white rounded-lg">
              {offset + 1} - {offset + pokemonList.length}
            </span>
            <button
              onClick={handleNext}
              className="px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all shadow-lg"
            >
              Next
            </button>
          </div>
        </>
      )}

      {/* Detailed View */}
      {!loading && selectedPokemon && (
        <div className="max-w-2xl mx-auto bg-slate-800 border border-purple-500/30 rounded-lg p-6 shadow-2xl">
          <button
            onClick={() => setSelectedPokemon(null)}
            className="mb-4 text-purple-400 hover:text-purple-300 transition-colors"
          >
            ← Back to list
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

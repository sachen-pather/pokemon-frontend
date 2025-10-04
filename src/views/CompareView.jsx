"use client";

import { useState, useEffect, useRef } from "react";
import { comparePokemon, searchPokemon } from "../services/pokemonApi";
import LoadingSpinner from "../components/LoadingSpinner";
import { formatPokemonName } from "../utils/helpers";

export default function CompareView() {
  const [pokemon1, setPokemon1] = useState("");
  const [pokemon2, setPokemon2] = useState("");
  const [searchResults1, setSearchResults1] = useState([]);
  const [searchResults2, setSearchResults2] = useState([]);
  const [showDropdown1, setShowDropdown1] = useState(false);
  const [showDropdown2, setShowDropdown2] = useState(false);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Debounce timers
  const debounceTimer1 = useRef(null);
  const debounceTimer2 = useRef(null);

  const handleSearch1 = (value) => {
    setPokemon1(value);

    // Clear existing timer
    if (debounceTimer1.current) {
      clearTimeout(debounceTimer1.current);
    }

    if (value.length > 1) {
      // Wait 300ms after user stops typing
      debounceTimer1.current = setTimeout(async () => {
        try {
          const results = await searchPokemon(value);
          setSearchResults1(results.slice(0, 10));
          setShowDropdown1(true);
        } catch (err) {
          setSearchResults1([]);
        }
      }, 300);
    } else {
      setSearchResults1([]);
      setShowDropdown1(false);
    }
  };

  const handleSearch2 = (value) => {
    setPokemon2(value);

    // Clear existing timer
    if (debounceTimer2.current) {
      clearTimeout(debounceTimer2.current);
    }

    if (value.length > 1) {
      // Wait 300ms after user stops typing
      debounceTimer2.current = setTimeout(async () => {
        try {
          const results = await searchPokemon(value);
          setSearchResults2(results.slice(0, 10));
          setShowDropdown2(true);
        } catch (err) {
          setSearchResults2([]);
        }
      }, 300);
    } else {
      setSearchResults2([]);
      setShowDropdown2(false);
    }
  };

  // Cleanup timers on unmount
  useEffect(() => {
    return () => {
      if (debounceTimer1.current) clearTimeout(debounceTimer1.current);
      if (debounceTimer2.current) clearTimeout(debounceTimer2.current);
    };
  }, []);

  const selectPokemon1 = (pokemon) => {
    setPokemon1(pokemon.name);
    setShowDropdown1(false);
    setSearchResults1([]);
  };

  const selectPokemon2 = (pokemon) => {
    setPokemon2(pokemon.name);
    setShowDropdown2(false);
    setSearchResults2([]);
  };

  const handleCompare = async () => {
    if (!pokemon1.trim() || !pokemon2.trim()) {
      setError("Please enter both Pokémon names");
      return;
    }

    setLoading(true);
    setError("");
    setResult(null);

    try {
      const comparison = await comparePokemon(pokemon1, pokemon2);
      setResult(comparison);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold text-center text-white">
        Compare Pokémon
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="relative">
          <label className="block text-sm font-medium mb-2 text-gray-300">
            Pokémon 1
          </label>
          <input
            type="text"
            value={pokemon1}
            onChange={(e) => handleSearch1(e.target.value)}
            onFocus={() => pokemon1.length > 1 && setShowDropdown1(true)}
            placeholder="Search first Pokémon"
            className="w-full px-4 py-2 bg-slate-800 border border-purple-500/30 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
          {showDropdown1 && searchResults1.length > 0 && (
            <div className="absolute z-10 w-full mt-1 bg-slate-800 border border-purple-500/30 rounded-lg shadow-2xl max-h-60 overflow-y-auto">
              {searchResults1.map((pokemon) => (
                <button
                  key={pokemon.id}
                  onClick={() => selectPokemon1(pokemon)}
                  className="w-full px-4 py-2 text-left hover:bg-purple-600/30 capitalize text-white transition-colors"
                >
                  #{pokemon.id} - {formatPokemonName(pokemon.name)}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="relative">
          <label className="block text-sm font-medium mb-2 text-gray-300">
            Pokémon 2
          </label>
          <input
            type="text"
            value={pokemon2}
            onChange={(e) => handleSearch2(e.target.value)}
            onFocus={() => pokemon2.length > 1 && setShowDropdown2(true)}
            placeholder="Search second Pokémon"
            className="w-full px-4 py-2 bg-slate-800 border border-purple-500/30 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
          {showDropdown2 && searchResults2.length > 0 && (
            <div className="absolute z-10 w-full mt-1 bg-slate-800 border border-purple-500/30 rounded-lg shadow-2xl max-h-60 overflow-y-auto">
              {searchResults2.map((pokemon) => (
                <button
                  key={pokemon.id}
                  onClick={() => selectPokemon2(pokemon)}
                  className="w-full px-4 py-2 text-left hover:bg-purple-600/30 capitalize text-white transition-colors"
                >
                  #{pokemon.id} - {formatPokemonName(pokemon.name)}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="text-center">
        <button
          onClick={handleCompare}
          className="px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 text-lg font-medium transition-all shadow-lg"
        >
          Compare
        </button>
      </div>

      {error && (
        <div className="bg-red-900/50 border border-red-500 text-red-200 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {loading && <LoadingSpinner />}

      {!loading && result && (
        <div className="bg-slate-800 border border-purple-500/30 rounded-lg p-6 shadow-2xl">
          <div className="text-center mb-6">
            <h3 className="text-3xl font-bold text-yellow-400 mb-2">
              Winner: {formatPokemonName(result.winner)}
            </h3>
            <p className="text-gray-300">{result.reasoning}</p>
          </div>

          <div className="grid grid-cols-2 gap-8 mb-6">
            <div className="text-center bg-slate-900/50 rounded-lg p-4">
              <h4 className="text-xl font-bold mb-2 capitalize text-white">
                {formatPokemonName(result.pokemon1)}
              </h4>
              <p className="text-3xl font-bold text-purple-400">
                {result.score1}
              </p>
              <p className="text-sm text-gray-400">Battle Score</p>
            </div>

            <div className="text-center bg-slate-900/50 rounded-lg p-4">
              <h4 className="text-xl font-bold mb-2 capitalize text-white">
                {formatPokemonName(result.pokemon2)}
              </h4>
              <p className="text-3xl font-bold text-purple-400">
                {result.score2}
              </p>
              <p className="text-sm text-gray-400">Battle Score</p>
            </div>
          </div>

          <div className="mb-6">
            <h4 className="text-lg font-bold mb-3 text-white">
              Type Effectiveness
            </h4>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-slate-900/50 p-3 rounded-lg">
                <p className="text-sm text-gray-400">
                  {formatPokemonName(result.pokemon1)} vs{" "}
                  {formatPokemonName(result.pokemon2)}
                </p>
                <p className="text-2xl font-bold text-purple-400">
                  {result.typeMultiplier1Vs2}x
                </p>
              </div>
              <div className="bg-slate-900/50 p-3 rounded-lg">
                <p className="text-sm text-gray-400">
                  {formatPokemonName(result.pokemon2)} vs{" "}
                  {formatPokemonName(result.pokemon1)}
                </p>
                <p className="text-2xl font-bold text-purple-400">
                  {result.typeMultiplier2Vs1}x
                </p>
              </div>
            </div>
          </div>

          <div>
            <h4 className="text-lg font-bold mb-3 text-white">
              Stat Differences
            </h4>
            <div className="space-y-2">
              {Object.entries(result.statDifferences).map(([stat, diff]) => (
                <div
                  key={stat}
                  className="flex justify-between items-center bg-slate-900/50 p-2 rounded-lg"
                >
                  <span className="font-medium text-gray-300">{stat}</span>
                  <span
                    className={`font-bold ${
                      diff > 0
                        ? "text-green-400"
                        : diff < 0
                        ? "text-red-400"
                        : "text-gray-400"
                    }`}
                  >
                    {diff > 0 ? "+" : ""}
                    {diff}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {result.abilityImpact1 !== "No special impact" && (
            <div className="mt-4 bg-purple-900/30 border border-purple-500/50 p-3 rounded-lg">
              <p className="text-sm text-purple-200">
                <strong>{formatPokemonName(result.pokemon1)}:</strong>{" "}
                {result.abilityImpact1}
              </p>
            </div>
          )}

          {result.abilityImpact2 !== "No special impact" && (
            <div className="mt-4 bg-purple-900/30 border border-purple-500/50 p-3 rounded-lg">
              <p className="text-sm text-purple-200">
                <strong>{formatPokemonName(result.pokemon2)}:</strong>{" "}
                {result.abilityImpact2}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

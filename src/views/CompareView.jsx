"use client";

import { useState, useEffect, useRef } from "react";
import {
  comparePokemon,
  searchPokemon,
  getPokemon,
} from "../services/pokemonApi";
import LoadingSpinner from "../components/LoadingSpinner";
import StatBar from "../components/StatBar";
import { formatPokemonName } from "../utils/helpers";
import { getTypeColor } from "../utils/typeColors";

export default function CompareView() {
  const [pokemon1, setPokemon1] = useState("");
  const [pokemon2, setPokemon2] = useState("");
  const [pokemon1Details, setPokemon1Details] = useState(null);
  const [pokemon2Details, setPokemon2Details] = useState(null);
  const [searchResults1, setSearchResults1] = useState([]);
  const [searchResults2, setSearchResults2] = useState([]);
  const [showDropdown1, setShowDropdown1] = useState(false);
  const [showDropdown2, setShowDropdown2] = useState(false);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const debounceTimer1 = useRef(null);
  const debounceTimer2 = useRef(null);

  const handleSearch1 = (value) => {
    setPokemon1(value);
    setPokemon1Details(null);

    if (debounceTimer1.current) {
      clearTimeout(debounceTimer1.current);
    }

    if (value.length > 1) {
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
    setPokemon2Details(null);

    if (debounceTimer2.current) {
      clearTimeout(debounceTimer2.current);
    }

    if (value.length > 1) {
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

  useEffect(() => {
    return () => {
      if (debounceTimer1.current) clearTimeout(debounceTimer1.current);
      if (debounceTimer2.current) clearTimeout(debounceTimer2.current);
    };
  }, []);

  const selectPokemon1 = async (pokemon) => {
    setPokemon1(pokemon.name);
    setShowDropdown1(false);
    setSearchResults1([]);

    try {
      const details = await getPokemon(pokemon.id);
      setPokemon1Details(details);
    } catch (err) {
      console.error("Error fetching pokemon details:", err);
    }
  };

  const selectPokemon2 = async (pokemon) => {
    setPokemon2(pokemon.name);
    setShowDropdown2(false);
    setSearchResults2([]);

    try {
      const details = await getPokemon(pokemon.id);
      setPokemon2Details(details);
    } catch (err) {
      console.error("Error fetching pokemon details:", err);
    }
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
      console.log("Comparison result:", comparison); // Debug log
      setResult(comparison);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <h2 className="text-2xl font-bold text-center text-white">
        Compare Pokémon
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Pokemon 1 Search */}
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

        {/* Pokemon 2 Search */}
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

      {/* Side-by-side Pokemon Cards with Stats */}
      {(pokemon1Details || pokemon2Details) && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Pokemon 1 Card */}
          <div
            className={`bg-slate-800 border ${
              pokemon1Details ? "border-purple-500" : "border-purple-500/30"
            } rounded-lg p-6 transition-all`}
          >
            {pokemon1Details ? (
              <>
                <div className="text-center mb-4">
                  <p className="text-gray-400 text-sm">#{pokemon1Details.id}</p>
                  <h3 className="text-2xl font-bold text-white mb-2">
                    {formatPokemonName(pokemon1Details.name)}
                  </h3>
                  {pokemon1Details.spriteUrl && (
                    <img
                      src={pokemon1Details.spriteUrl}
                      alt={pokemon1Details.name}
                      className="w-32 h-32 mx-auto"
                    />
                  )}
                  <div className="flex gap-2 justify-center mt-2">
                    {pokemon1Details.types.map((type) => (
                      <span
                        key={type}
                        className="px-3 py-1 rounded-full text-white text-sm font-medium"
                        style={{ backgroundColor: getTypeColor(type) }}
                      >
                        {type}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="space-y-1">
                  <h4 className="text-sm font-bold text-gray-300 mb-2">
                    Stats
                  </h4>
                  <StatBar statName="hp" value={pokemon1Details.stats.hp} />
                  <StatBar
                    statName="attack"
                    value={pokemon1Details.stats.attack}
                  />
                  <StatBar
                    statName="defense"
                    value={pokemon1Details.stats.defense}
                  />
                  <StatBar
                    statName="specialAttack"
                    value={pokemon1Details.stats.specialAttack}
                  />
                  <StatBar
                    statName="specialDefense"
                    value={pokemon1Details.stats.specialDefense}
                  />
                  <StatBar
                    statName="speed"
                    value={pokemon1Details.stats.speed}
                  />
                </div>
              </>
            ) : (
              <div className="h-96 flex items-center justify-center text-gray-500">
                Select a Pokémon
              </div>
            )}
          </div>

          {/* Pokemon 2 Card */}
          <div
            className={`bg-slate-800 border ${
              pokemon2Details ? "border-pink-500" : "border-pink-500/30"
            } rounded-lg p-6 transition-all`}
          >
            {pokemon2Details ? (
              <>
                <div className="text-center mb-4">
                  <p className="text-gray-400 text-sm">#{pokemon2Details.id}</p>
                  <h3 className="text-2xl font-bold text-white mb-2">
                    {formatPokemonName(pokemon2Details.name)}
                  </h3>
                  {pokemon2Details.spriteUrl && (
                    <img
                      src={pokemon2Details.spriteUrl}
                      alt={pokemon2Details.name}
                      className="w-32 h-32 mx-auto"
                    />
                  )}
                  <div className="flex gap-2 justify-center mt-2">
                    {pokemon2Details.types.map((type) => (
                      <span
                        key={type}
                        className="px-3 py-1 rounded-full text-white text-sm font-medium"
                        style={{ backgroundColor: getTypeColor(type) }}
                      >
                        {type}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="space-y-1">
                  <h4 className="text-sm font-bold text-gray-300 mb-2">
                    Stats
                  </h4>
                  <StatBar statName="hp" value={pokemon2Details.stats.hp} />
                  <StatBar
                    statName="attack"
                    value={pokemon2Details.stats.attack}
                  />
                  <StatBar
                    statName="defense"
                    value={pokemon2Details.stats.defense}
                  />
                  <StatBar
                    statName="specialAttack"
                    value={pokemon2Details.stats.specialAttack}
                  />
                  <StatBar
                    statName="specialDefense"
                    value={pokemon2Details.stats.specialDefense}
                  />
                  <StatBar
                    statName="speed"
                    value={pokemon2Details.stats.speed}
                  />
                </div>
              </>
            ) : (
              <div className="h-96 flex items-center justify-center text-gray-500">
                Select a Pokémon
              </div>
            )}
          </div>
        </div>
      )}

      <div className="text-center">
        <button
          onClick={handleCompare}
          disabled={!pokemon1Details || !pokemon2Details}
          className="px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 disabled:from-gray-600 disabled:to-gray-600 disabled:cursor-not-allowed text-lg font-medium transition-all shadow-lg"
        >
          Compare Battle Power
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
          {/* Calculate turns to KO */}
          {(() => {
            // Damage calculation: (Offense / Defense) × 15, capped at 50% HP max, 3% HP min
            const calculateDamage = (
              offense,
              baseDefense,
              baseSpecialDefense,
              hp,
              offenseType
            ) => {
              const effectiveDefense =
                offenseType === "Physical" ? baseDefense : baseSpecialDefense;
              const ratio = offense / Math.max(effectiveDefense, 1);
              const baseDamage = ratio * 15;
              const maxDamage = hp * 0.5;
              const cappedDamage = Math.min(baseDamage, maxDamage);
              const minDamage = hp * 0.03;
              return Math.max(cappedDamage, minDamage);
            };

            const damage1 = calculateDamage(
              result.pokemon1EffectiveStats?.effectiveOffense || 0,
              result.pokemon2EffectiveStats?.baseDefense || 1,
              result.pokemon2EffectiveStats?.baseSpecialDefense || 1,
              result.pokemon2EffectiveStats?.baseHP || 1,
              result.pokemon1EffectiveStats?.offenseType
            );

            const damage2 = calculateDamage(
              result.pokemon2EffectiveStats?.effectiveOffense || 0,
              result.pokemon1EffectiveStats?.baseDefense || 1,
              result.pokemon1EffectiveStats?.baseSpecialDefense || 1,
              result.pokemon1EffectiveStats?.baseHP || 1,
              result.pokemon2EffectiveStats?.offenseType
            );

            const turnsToKO1 = Math.ceil(
              (result.pokemon2EffectiveStats?.baseHP || 1) /
                Math.max(damage1, 0.1)
            );
            const turnsToKO2 = Math.ceil(
              (result.pokemon1EffectiveStats?.baseHP || 1) /
                Math.max(damage2, 0.1)
            );

            // Store in a way accessible to JSX below
            window._battleCalcs = { turnsToKO1, turnsToKO2, damage1, damage2 };
            return null;
          })()}

          {/* Winner Section */}
          <div className="text-center mb-6">
            <h3 className="text-3xl font-bold text-yellow-400 mb-2">
              Winner: {formatPokemonName(result.winner)}
            </h3>
            <p className="text-gray-300 text-lg">{result.reasoning}</p>
          </div>

          {/* Battle Scores */}
          <div className="grid grid-cols-2 gap-8 mb-6">
            <div className="text-center bg-slate-900/50 rounded-lg p-4 border-2 border-purple-500">
              <h4 className="text-xl font-bold mb-2 capitalize text-white">
                {formatPokemonName(result.pokemon1)}
              </h4>
              <p className="text-4xl font-bold text-purple-400">
                {result.score1}
              </p>
              <p className="text-sm text-gray-400">Battle Score</p>
              <p className="text-lg font-semibold text-purple-300 mt-2">
                {result.typeMultiplier1Vs2}x damage
              </p>
            </div>

            <div className="text-center bg-slate-900/50 rounded-lg p-4 border-2 border-pink-500">
              <h4 className="text-xl font-bold mb-2 capitalize text-white">
                {formatPokemonName(result.pokemon2)}
              </h4>
              <p className="text-4xl font-bold text-pink-400">
                {result.score2}
              </p>
              <p className="text-sm text-gray-400">Battle Score</p>
              <p className="text-lg font-semibold text-pink-300 mt-2">
                {result.typeMultiplier2Vs1}x damage
              </p>
            </div>
          </div>

          {/* Type Effectiveness Explanations */}
          {(result.typeEffectivenessExplanation1 ||
            result.typeEffectivenessExplanation2) && (
            <div className="mb-6 space-y-3">
              <h4 className="text-lg font-bold text-white text-center mb-3">
                Type Matchup Analysis
              </h4>

              {/* Pokemon 1's Type Advantage */}
              {result.typeEffectivenessExplanation1 && (
                <div className="bg-purple-900/30 border border-purple-500/50 p-4 rounded-lg">
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0">
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-sm font-bold ${
                          result.typeMultiplier1Vs2 >= 2
                            ? "bg-green-600 text-white"
                            : result.typeMultiplier1Vs2 > 1
                            ? "bg-green-500 text-white"
                            : result.typeMultiplier1Vs2 < 1
                            ? "bg-red-500 text-white"
                            : result.typeMultiplier1Vs2 === 0
                            ? "bg-gray-700 text-white"
                            : "bg-gray-500 text-white"
                        }`}
                      >
                        {result.typeMultiplier1Vs2}x
                      </span>
                    </div>
                    <div className="flex-1">
                      <p className="text-purple-200 font-semibold mb-1">
                        {formatPokemonName(result.pokemon1)}'s Offense:
                      </p>
                      <p className="text-purple-100 text-sm">
                        {result.typeEffectivenessExplanation1}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Pokemon 2's Type Advantage */}
              {result.typeEffectivenessExplanation2 && (
                <div className="bg-pink-900/30 border border-pink-500/50 p-4 rounded-lg">
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0">
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-sm font-bold ${
                          result.typeMultiplier2Vs1 >= 2
                            ? "bg-green-600 text-white"
                            : result.typeMultiplier2Vs1 > 1
                            ? "bg-green-500 text-white"
                            : result.typeMultiplier2Vs1 < 1
                            ? "bg-red-500 text-white"
                            : result.typeMultiplier2Vs1 === 0
                            ? "bg-gray-700 text-white"
                            : "bg-gray-500 text-white"
                        }`}
                      >
                        {result.typeMultiplier2Vs1}x
                      </span>
                    </div>
                    <div className="flex-1">
                      <p className="text-pink-200 font-semibold mb-1">
                        {formatPokemonName(result.pokemon2)}'s Offense:
                      </p>
                      <p className="text-pink-100 text-sm">
                        {result.typeEffectivenessExplanation2}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Stat Comparison */}
          <div className="mb-6">
            <h4 className="text-lg font-bold mb-3 text-white text-center">
              Stat Comparison
            </h4>
            <div className="space-y-2">
              {Object.entries(result.statDifferences).map(([stat, diff]) => (
                <div
                  key={stat}
                  className="flex justify-between items-center bg-slate-900/50 p-3 rounded-lg"
                >
                  <span className="font-medium text-gray-300 w-32">{stat}</span>
                  <div className="flex-1 mx-4">
                    <div className="relative h-6 bg-gray-700 rounded-full overflow-hidden">
                      <div
                        className={`absolute h-full transition-all ${
                          diff < 0
                            ? "bg-pink-500 left-1/2"
                            : "bg-purple-500 right-1/2"
                        }`}
                        style={{
                          width: `${Math.min(Math.abs(diff) / 2, 50)}%`,
                        }}
                      />
                      <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-white" />
                    </div>
                  </div>
                  <span
                    className={`font-bold w-16 text-right ${
                      diff < 0
                        ? "text-pink-400"
                        : diff > 0
                        ? "text-purple-400"
                        : "text-gray-400"
                    }`}
                  >
                    +{Math.abs(diff)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Ability Effects */}
          {(result.abilityImpact1 !== "No significant ability impact" ||
            result.abilityImpact2 !== "No significant ability impact") && (
            <div className="space-y-2 mb-6">
              <h4 className="text-lg font-bold text-white text-center mb-3">
                Ability Effects
              </h4>
              {result.abilityImpact1 !== "No significant ability impact" && (
                <div className="bg-purple-900/30 border border-purple-500/50 p-3 rounded-lg">
                  <p className="text-sm text-purple-200">
                    <strong>{formatPokemonName(result.pokemon1)}:</strong>{" "}
                    {result.abilityImpact1}
                  </p>
                </div>
              )}
              {result.abilityImpact2 !== "No significant ability impact" && (
                <div className="bg-pink-900/30 border border-pink-500/50 p-3 rounded-lg">
                  <p className="text-sm text-pink-200">
                    <strong>{formatPokemonName(result.pokemon2)}:</strong>{" "}
                    {result.abilityImpact2}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Effective Combat Stats */}
          {(result.pokemon1EffectiveStats || result.pokemon2EffectiveStats) && (
            <div className="space-y-4">
              <h4 className="text-lg font-bold text-white text-center mb-3">
                Effective Combat Stats
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Pokemon 1 Effective Stats */}
                {result.pokemon1EffectiveStats && (
                  <div className="bg-purple-900/20 border border-purple-500/40 rounded-lg p-4">
                    <h5 className="font-bold text-purple-300 mb-3 text-center">
                      {formatPokemonName(result.pokemon1)}
                    </h5>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-300">HP:</span>
                        <span className="font-semibold text-white">
                          {result.pokemon1EffectiveStats.baseHP}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-300">
                          Offense ({result.pokemon1EffectiveStats.offenseType}):
                        </span>
                        <span className="font-semibold text-purple-300">
                          {result.pokemon1EffectiveStats.effectiveOffense.toFixed(
                            1
                          )}
                          {result.pokemon1EffectiveStats.offenseMultiplier !==
                            1 && (
                            <span className="text-xs ml-1 text-purple-400">
                              (×
                              {result.pokemon1EffectiveStats.offenseMultiplier.toFixed(
                                2
                              )}
                              )
                            </span>
                          )}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-300">Defense:</span>
                        <span className="font-semibold text-purple-300">
                          {result.pokemon1EffectiveStats.effectiveDefense.toFixed(
                            1
                          )}
                          {result.pokemon1EffectiveStats.defenseMultiplier !==
                            1 && (
                            <span className="text-xs ml-1 text-purple-400">
                              (×
                              {result.pokemon1EffectiveStats.defenseMultiplier.toFixed(
                                2
                              )}
                              )
                            </span>
                          )}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-300">Speed:</span>
                        <span className="font-semibold text-purple-300">
                          {result.pokemon1EffectiveStats.effectiveSpeed.toFixed(
                            1
                          )}
                          {result.pokemon1EffectiveStats.speedMultiplier !==
                            1 && (
                            <span className="text-xs ml-1 text-purple-400">
                              (×
                              {result.pokemon1EffectiveStats.speedMultiplier.toFixed(
                                2
                              )}
                              )
                            </span>
                          )}
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Pokemon 2 Effective Stats */}
                {result.pokemon2EffectiveStats && (
                  <div className="bg-pink-900/20 border border-pink-500/40 rounded-lg p-4">
                    <h5 className="font-bold text-pink-300 mb-3 text-center">
                      {formatPokemonName(result.pokemon2)}
                    </h5>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-300">HP:</span>
                        <span className="font-semibold text-white">
                          {result.pokemon2EffectiveStats.baseHP}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-300">
                          Offense ({result.pokemon2EffectiveStats.offenseType}):
                        </span>
                        <span className="font-semibold text-pink-300">
                          {result.pokemon2EffectiveStats.effectiveOffense.toFixed(
                            1
                          )}
                          {result.pokemon2EffectiveStats.offenseMultiplier !==
                            1 && (
                            <span className="text-xs ml-1 text-pink-400">
                              (×
                              {result.pokemon2EffectiveStats.offenseMultiplier.toFixed(
                                2
                              )}
                              )
                            </span>
                          )}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-300">Defense:</span>
                        <span className="font-semibold text-pink-300">
                          {result.pokemon2EffectiveStats.effectiveDefense.toFixed(
                            1
                          )}
                          {result.pokemon2EffectiveStats.defenseMultiplier !==
                            1 && (
                            <span className="text-xs ml-1 text-pink-400">
                              (×
                              {result.pokemon2EffectiveStats.defenseMultiplier.toFixed(
                                2
                              )}
                              )
                            </span>
                          )}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-300">Speed:</span>
                        <span className="font-semibold text-pink-300">
                          {result.pokemon2EffectiveStats.effectiveSpeed.toFixed(
                            1
                          )}
                          {result.pokemon2EffectiveStats.speedMultiplier !==
                            1 && (
                            <span className="text-xs ml-1 text-pink-400">
                              (×
                              {result.pokemon2EffectiveStats.speedMultiplier.toFixed(
                                2
                              )}
                              )
                            </span>
                          )}
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              <p className="text-xs text-gray-400 text-center mt-2">
                * Effective stats include ability modifiers and type advantages
              </p>
            </div>
          )}

          {/* NEW: Battle Score Formula Explanation */}
          <div className="mt-6 bg-slate-900/50 border border-slate-600/30 rounded-lg p-4">
            <h4 className="text-sm font-bold text-gray-300 mb-3 text-center">
              Battle Calculation Breakdown
            </h4>

            {/* Turn-to-KO Calculation */}
            <div className="mb-4 pb-4 border-b border-slate-700">
              <p className="text-xs font-semibold text-gray-300 mb-2 text-center">
                Damage & Turns to KO
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                <div className="bg-purple-900/20 rounded p-2">
                  <p className="font-semibold text-purple-300 mb-1">
                    {formatPokemonName(result.pokemon1)} vs{" "}
                    {formatPokemonName(result.pokemon2)}
                  </p>
                  <p className="text-gray-400">
                    • Offense:{" "}
                    {result.pokemon1EffectiveStats?.effectiveOffense.toFixed(0)}
                  </p>
                  <p className="text-gray-400">
                    • Enemy Defense:{" "}
                    {result.pokemon2EffectiveStats?.effectiveDefense.toFixed(0)}
                  </p>
                  <p className="text-gray-400">
                    • Damage/Turn: {window._battleCalcs?.damage1.toFixed(1)} HP
                  </p>
                  <p className="text-purple-400 font-semibold mt-1">
                    → {window._battleCalcs?.turnsToKO1 || "?"} turn
                    {window._battleCalcs?.turnsToKO1 !== 1 ? "s" : ""} to KO
                  </p>
                </div>
                <div className="bg-pink-900/20 rounded p-2">
                  <p className="font-semibold text-pink-300 mb-1">
                    {formatPokemonName(result.pokemon2)} vs{" "}
                    {formatPokemonName(result.pokemon1)}
                  </p>
                  <p className="text-gray-400">
                    • Offense:{" "}
                    {result.pokemon2EffectiveStats?.effectiveOffense.toFixed(0)}
                  </p>
                  <p className="text-gray-400">
                    • Enemy Defense:{" "}
                    {result.pokemon1EffectiveStats?.effectiveDefense.toFixed(0)}
                  </p>
                  <p className="text-gray-400">
                    • Damage/Turn: {window._battleCalcs?.damage2.toFixed(1)} HP
                  </p>
                  <p className="text-pink-400 font-semibold mt-1">
                    → {window._battleCalcs?.turnsToKO2 || "?"} turn
                    {window._battleCalcs?.turnsToKO2 !== 1 ? "s" : ""} to KO
                  </p>
                </div>
              </div>
              <p className="text-xs text-gray-500 text-center mt-2">
                {window._battleCalcs?.turnsToKO1 ===
                window._battleCalcs?.turnsToKO2
                  ? "Same KO speed → Winner determined by Speed stat"
                  : "Different KO speeds → Faster KO wins"}
              </p>
            </div>

            {/* Score Calculation */}
            <div>
              <p className="text-xs font-semibold text-gray-300 mb-2 text-center">
                Battle Score Formula
              </p>
              <p className="text-center mb-3">
                <span className="font-mono bg-slate-800 px-2 py-1 rounded text-xs text-gray-300">
                  Score = (Offense × 30%) + (Survivability × 40%) + (Speed ×
                  20%) + Efficiency Bonus
                </span>
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                <div className="space-y-1 bg-purple-900/20 rounded p-2">
                  <p className="text-purple-300 font-semibold">
                    {formatPokemonName(result.pokemon1)}:
                  </p>
                  <p className="text-gray-400">
                    • Offense:{" "}
                    {result.pokemon1EffectiveStats?.effectiveOffense.toFixed(0)}{" "}
                    × 0.30 ={" "}
                    {(
                      result.pokemon1EffectiveStats?.effectiveOffense * 0.3
                    ).toFixed(0)}
                  </p>
                  <p className="text-gray-400">
                    • Survival: ({result.pokemon1EffectiveStats?.baseHP} HP +{" "}
                    {result.pokemon1EffectiveStats?.effectiveDefense.toFixed(0)}{" "}
                    Def) × 0.40 ={" "}
                    {(
                      (result.pokemon1EffectiveStats?.baseHP +
                        result.pokemon1EffectiveStats?.effectiveDefense) *
                      0.4
                    ).toFixed(0)}
                  </p>
                  <p className="text-gray-400">
                    • Speed:{" "}
                    {result.pokemon1EffectiveStats?.effectiveSpeed.toFixed(0)} ×
                    0.20 ={" "}
                    {(
                      result.pokemon1EffectiveStats?.effectiveSpeed * 0.2
                    ).toFixed(0)}
                  </p>
                  <p className="text-gray-400">• Efficiency: Fast KO bonus</p>
                  <p className="font-bold text-purple-400 pt-1">
                    = {result.score1} total
                  </p>
                </div>
                <div className="space-y-1 bg-pink-900/20 rounded p-2">
                  <p className="text-pink-300 font-semibold">
                    {formatPokemonName(result.pokemon2)}:
                  </p>
                  <p className="text-gray-400">
                    • Offense:{" "}
                    {result.pokemon2EffectiveStats?.effectiveOffense.toFixed(0)}{" "}
                    × 0.30 ={" "}
                    {(
                      result.pokemon2EffectiveStats?.effectiveOffense * 0.3
                    ).toFixed(0)}
                  </p>
                  <p className="text-gray-400">
                    • Survival: ({result.pokemon2EffectiveStats?.baseHP} HP +{" "}
                    {result.pokemon2EffectiveStats?.effectiveDefense.toFixed(0)}{" "}
                    Def) × 0.40 ={" "}
                    {(
                      (result.pokemon2EffectiveStats?.baseHP +
                        result.pokemon2EffectiveStats?.effectiveDefense) *
                      0.4
                    ).toFixed(0)}
                  </p>
                  <p className="text-gray-400">
                    • Speed:{" "}
                    {result.pokemon2EffectiveStats?.effectiveSpeed.toFixed(0)} ×
                    0.20 ={" "}
                    {(
                      result.pokemon2EffectiveStats?.effectiveSpeed * 0.2
                    ).toFixed(0)}
                  </p>
                  <p className="text-gray-400">• Efficiency: Fast KO bonus</p>
                  <p className="font-bold text-pink-400 pt-1">
                    = {result.score2} total
                  </p>
                </div>
              </div>
              <p className="text-xs text-gray-500 text-center mt-3">
                When scores differ by less than 40 points, Speed becomes the
                tiebreaker
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

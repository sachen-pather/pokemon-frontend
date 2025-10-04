"use client";

import { useState, useEffect } from "react";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";
import {
  filterPokemon,
  getTypes,
  getAbilities,
  getPokemon,
} from "../services/pokemonApi";
import PokemonCard from "../components/PokemonCard";
import LoadingSpinner from "../components/LoadingSpinner";
import StatBar from "../components/StatBar";
import { formatPokemonName } from "../utils/helpers";
import { getTypeColor } from "../utils/typeColors";

export default function FilterView() {
  const [filters, setFilters] = useState({
    Type: "",
    Ability: "",
    HpRange: [0, 255],
    AttackRange: [0, 255],
    DefenseRange: [0, 255],
    SpecialAttackRange: [0, 255],
    SpecialDefenseRange: [0, 255],
    SpeedRange: [0, 255],
    TotalRange: [0, 1530],
  });

  const [types, setTypes] = useState([]);
  const [abilities, setAbilities] = useState([]);
  const [results, setResults] = useState([]);
  const [selectedPokemon, setSelectedPokemon] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    loadTypesAndAbilities();
  }, []);

  const loadTypesAndAbilities = async () => {
    try {
      const [typesData, abilitiesData] = await Promise.all([
        getTypes(),
        getAbilities(),
      ]);
      setTypes(typesData);
      setAbilities(abilitiesData);
    } catch (err) {
      setError("Failed to load filter options");
    }
  };

  const handleFilterChange = (field, value) => {
    setFilters({ ...filters, [field]: value });
  };

  const handleApplyFilters = async () => {
    setLoading(true);
    setError("");
    setSelectedPokemon(null);

    try {
      // Convert ranges back to individual Min/Max values for API
      const apiFilters = {
        Type: filters.Type,
        Ability: filters.Ability,
        MinHp: filters.HpRange[0],
        MaxHp: filters.HpRange[1],
        MinAttack: filters.AttackRange[0],
        MaxAttack: filters.AttackRange[1],
        MinDefense: filters.DefenseRange[0],
        MaxDefense: filters.DefenseRange[1],
        MinSpecialAttack: filters.SpecialAttackRange[0],
        MaxSpecialAttack: filters.SpecialAttackRange[1],
        MinSpecialDefense: filters.SpecialDefenseRange[0],
        MaxSpecialDefense: filters.SpecialDefenseRange[1],
        MinSpeed: filters.SpeedRange[0],
        MaxSpeed: filters.SpeedRange[1],
        MinTotal: filters.TotalRange[0],
        MaxTotal: filters.TotalRange[1],
      };

      const filtered = await filterPokemon(apiFilters);
      setResults(filtered);

      if (filtered.length === 0) {
        setError("No Pokémon match the selected filters");
      }
    } catch (err) {
      setError(err.message);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setFilters({
      Type: "",
      Ability: "",
      HpRange: [0, 255],
      AttackRange: [0, 255],
      DefenseRange: [0, 255],
      SpecialAttackRange: [0, 255],
      SpecialDefenseRange: [0, 255],
      SpeedRange: [0, 255],
      TotalRange: [0, 1530],
    });
    setResults([]);
    setError("");
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
      <h2 className="text-2xl font-bold text-center text-white">
        Filter Pokémon
      </h2>

      {!selectedPokemon && (
        <div className="bg-slate-800 border border-purple-500/30 rounded-lg p-6 shadow-xl">
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-300">
                  Type
                </label>
                <select
                  value={filters.Type}
                  onChange={(e) => handleFilterChange("Type", e.target.value)}
                  className="w-full px-3 py-2 bg-slate-900 border border-purple-500/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="">All Types</option>
                  {types.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-gray-300">
                  Ability
                </label>
                <select
                  value={filters.Ability}
                  onChange={(e) =>
                    handleFilterChange("Ability", e.target.value)
                  }
                  className="w-full px-3 py-2 bg-slate-900 border border-purple-500/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="">All Abilities</option>
                  {abilities.map((ability) => (
                    <option key={ability} value={ability}>
                      {ability}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* HP Range */}
            <div>
              <label className="block text-sm font-medium mb-3 text-gray-300">
                HP: {filters.HpRange[0]} - {filters.HpRange[1]}
              </label>
              <Slider
                range
                min={0}
                max={255}
                value={filters.HpRange}
                onChange={(value) => handleFilterChange("HpRange", value)}
                trackStyle={[{ backgroundColor: "#a855f7" }]}
                handleStyle={[
                  { borderColor: "#a855f7", backgroundColor: "#a855f7" },
                  { borderColor: "#a855f7", backgroundColor: "#a855f7" },
                ]}
                railStyle={{ backgroundColor: "#334155" }}
              />
            </div>

            {/* Attack Range */}
            <div>
              <label className="block text-sm font-medium mb-3 text-gray-300">
                Attack: {filters.AttackRange[0]} - {filters.AttackRange[1]}
              </label>
              <Slider
                range
                min={0}
                max={255}
                value={filters.AttackRange}
                onChange={(value) => handleFilterChange("AttackRange", value)}
                trackStyle={[{ backgroundColor: "#a855f7" }]}
                handleStyle={[
                  { borderColor: "#a855f7", backgroundColor: "#a855f7" },
                  { borderColor: "#a855f7", backgroundColor: "#a855f7" },
                ]}
                railStyle={{ backgroundColor: "#334155" }}
              />
            </div>

            {/* Defense Range */}
            <div>
              <label className="block text-sm font-medium mb-3 text-gray-300">
                Defense: {filters.DefenseRange[0]} - {filters.DefenseRange[1]}
              </label>
              <Slider
                range
                min={0}
                max={255}
                value={filters.DefenseRange}
                onChange={(value) => handleFilterChange("DefenseRange", value)}
                trackStyle={[{ backgroundColor: "#a855f7" }]}
                handleStyle={[
                  { borderColor: "#a855f7", backgroundColor: "#a855f7" },
                  { borderColor: "#a855f7", backgroundColor: "#a855f7" },
                ]}
                railStyle={{ backgroundColor: "#334155" }}
              />
            </div>

            {/* Special Attack Range */}
            <div>
              <label className="block text-sm font-medium mb-3 text-gray-300">
                Special Attack: {filters.SpecialAttackRange[0]} -{" "}
                {filters.SpecialAttackRange[1]}
              </label>
              <Slider
                range
                min={0}
                max={255}
                value={filters.SpecialAttackRange}
                onChange={(value) =>
                  handleFilterChange("SpecialAttackRange", value)
                }
                trackStyle={[{ backgroundColor: "#a855f7" }]}
                handleStyle={[
                  { borderColor: "#a855f7", backgroundColor: "#a855f7" },
                  { borderColor: "#a855f7", backgroundColor: "#a855f7" },
                ]}
                railStyle={{ backgroundColor: "#334155" }}
              />
            </div>

            {/* Special Defense Range */}
            <div>
              <label className="block text-sm font-medium mb-3 text-gray-300">
                Special Defense: {filters.SpecialDefenseRange[0]} -{" "}
                {filters.SpecialDefenseRange[1]}
              </label>
              <Slider
                range
                min={0}
                max={255}
                value={filters.SpecialDefenseRange}
                onChange={(value) =>
                  handleFilterChange("SpecialDefenseRange", value)
                }
                trackStyle={[{ backgroundColor: "#a855f7" }]}
                handleStyle={[
                  { borderColor: "#a855f7", backgroundColor: "#a855f7" },
                  { borderColor: "#a855f7", backgroundColor: "#a855f7" },
                ]}
                railStyle={{ backgroundColor: "#334155" }}
              />
            </div>

            {/* Speed Range */}
            <div>
              <label className="block text-sm font-medium mb-3 text-gray-300">
                Speed: {filters.SpeedRange[0]} - {filters.SpeedRange[1]}
              </label>
              <Slider
                range
                min={0}
                max={255}
                value={filters.SpeedRange}
                onChange={(value) => handleFilterChange("SpeedRange", value)}
                trackStyle={[{ backgroundColor: "#a855f7" }]}
                handleStyle={[
                  { borderColor: "#a855f7", backgroundColor: "#a855f7" },
                  { borderColor: "#a855f7", backgroundColor: "#a855f7" },
                ]}
                railStyle={{ backgroundColor: "#334155" }}
              />
            </div>

            {/* Total Stats Range */}
            <div>
              <label className="block text-sm font-medium mb-3 text-gray-300">
                Total Stats: {filters.TotalRange[0]} - {filters.TotalRange[1]}
              </label>
              <Slider
                range
                min={0}
                max={1530}
                step={10}
                value={filters.TotalRange}
                onChange={(value) => handleFilterChange("TotalRange", value)}
                trackStyle={[{ backgroundColor: "#a855f7" }]}
                handleStyle={[
                  { borderColor: "#a855f7", backgroundColor: "#a855f7" },
                  { borderColor: "#a855f7", backgroundColor: "#a855f7" },
                ]}
                railStyle={{ backgroundColor: "#334155" }}
              />
            </div>
          </div>

          <div className="flex gap-4 mt-6">
            <button
              onClick={handleApplyFilters}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all shadow-lg"
            >
              Apply Filters
            </button>
            <button
              onClick={handleReset}
              className="px-6 py-3 bg-slate-700 text-gray-300 rounded-lg hover:bg-slate-600 transition-colors"
            >
              Reset
            </button>
          </div>
        </div>
      )}

      {error && (
        <div className="bg-red-900/50 border border-red-500 text-red-200 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {loading && <LoadingSpinner />}

      {!loading && !selectedPokemon && results.length > 0 && (
        <div>
          <p className="text-center text-gray-400 mb-4">
            Found {results.length} Pokémon
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {results.map((pokemon) => (
              <PokemonCard
                key={pokemon.id}
                pokemon={pokemon}
                onClick={handleSelectPokemon}
              />
            ))}
          </div>
        </div>
      )}

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

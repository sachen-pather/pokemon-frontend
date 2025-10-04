"use client";

import { formatPokemonName } from "../utils/helpers";
import { getTypeColor } from "../utils/typeColors";

export default function PokemonCard({ pokemon, onClick }) {
  return (
    <div
      onClick={() => onClick && onClick(pokemon)}
      className="bg-slate-800 border border-purple-500/30 rounded-lg p-4 hover:shadow-xl hover:shadow-purple-500/30 hover:border-purple-500 transition-all cursor-pointer transform hover:scale-105 duration-200"
    >
      <div className="text-center">
        <p className="text-gray-400 text-sm">#{pokemon.id}</p>
        <h3 className="text-xl font-bold capitalize mb-2 text-white">
          {formatPokemonName(pokemon.name)}
        </h3>

        {pokemon.spriteUrl && (
          <div className="bg-slate-900/50 rounded-lg p-2 mb-2">
            <img
              src={pokemon.spriteUrl || "/placeholder.svg"}
              alt={pokemon.name}
              className="w-24 h-24 mx-auto"
            />
          </div>
        )}

        {pokemon.types && (
          <div className="flex gap-2 justify-center mt-2">
            {pokemon.types.map((type) => (
              <span
                key={type}
                className="px-3 py-1 rounded-full text-white text-sm font-medium shadow-lg"
                style={{ backgroundColor: getTypeColor(type) }}
              >
                {type}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

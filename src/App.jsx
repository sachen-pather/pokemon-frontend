"use client";

import { useState } from "react";
import SearchView from "./views/SearchView";
import ListView from "./views/ListView";
import CompareView from "./views/CompareView";
import FilterView from "./views/FilterView";
import TypesView from "./views/TypesView";
import AbilitiesView from "./views/AbilitiesView";

export default function App() {
  const [activeTab, setActiveTab] = useState("search");

  const tabs = [
    { id: "search", label: "Search", icon: "" },
    { id: "list", label: "List", icon: "" },
    { id: "compare", label: "Compare", icon: "" },
    { id: "filter", label: "Filter", icon: "" },
    { id: "types", label: "Types", icon: "" },
    { id: "abilities", label: "Abilities", icon: "" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <header className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white shadow-2xl">
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-4xl font-bold text-center tracking-wide">
            Pokémon Explorer
          </h1>
          <p className="text-center text-purple-100 mt-2 text-sm">
            Discover, Compare & Master
          </p>
        </div>
      </header>

      {/* Navigation Tabs */}
      <nav className="bg-slate-800/90 backdrop-blur-sm shadow-xl sticky top-0 z-10 border-b border-purple-500/30">
        <div className="container mx-auto px-4">
          <div className="flex overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 min-w-max px-6 py-4 font-medium transition-all duration-200 ${
                  activeTab === tab.id
                    ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white border-b-4 border-yellow-400 shadow-lg"
                    : "bg-transparent text-gray-300 hover:bg-slate-700/50 hover:text-white"
                }`}
              >
                <span className="mr-2">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {activeTab === "search" && <SearchView />}
        {activeTab === "list" && <ListView />}
        {activeTab === "compare" && <CompareView />}
        {activeTab === "filter" && <FilterView />}
        {activeTab === "types" && <TypesView />}
        {activeTab === "abilities" && <AbilitiesView />}
      </main>
    </div>
  );
}

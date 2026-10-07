import React from "react";

const MEAL_TYPES = ["All", "Breakfast", "Lunch", "Dinner", "Snacks"];

export default function NutritionFilters({ filters, onChange }) {
  const update = (field, value) => onChange({ ...filters, [field]: value });

  return (
    <div className="nutrition-filters">
      <div className="filter-group">
        {MEAL_TYPES.map((type) => (
          <button
            key={type}
            className={filters.mealType === type ? "chip active" : "chip"}
            onClick={() => update("mealType", type)}
            type="button"
          >
            {type}
          </button>
        ))}
      </div>

      <div className="filter-group">
        <label>
          Date
          <input
            type="date"
            value={filters.date || ""}
            onChange={(e) => update("date", e.target.value)}
          />
        </label>
        <label>
          From
          <input
            type="date"
            value={filters.startDate || ""}
            onChange={(e) => update("startDate", e.target.value)}
          />
        </label>
        <label>
          To
          <input
            type="date"
            value={filters.endDate || ""}
            onChange={(e) => update("endDate", e.target.value)}
          />
        </label>
        <input
          type="text"
          placeholder="Search food..."
          value={filters.search || ""}
          onChange={(e) => update("search", e.target.value)}
        />
        <button type="button" className="secondary" onClick={() => onChange({ mealType: "All" })}>
          Clear filters
        </button>
      </div>
    </div>
  );
}

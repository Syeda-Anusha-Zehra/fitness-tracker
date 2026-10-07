import React from "react";
import ProgressRing from "../ProgressRing";

// Rough daily reference targets, just to give the rings something to fill toward
const TARGETS = { calories: 2000, protein: 100, carbs: 250, fat: 70 };

export default function DailyTotals({ totals, date }) {
  if (!totals) return null;

  return (
    <div className="daily-totals-rings-wrapper">
      <div className="daily-totals-header">
        <h3>Today's Nutrition — {date}</h3>
      </div>
      <div className="ring-stats-row">
        <ProgressRing
          id="nutrition-cal"
          value={totals.calories}
          max={TARGETS.calories}
          centerText={totals.calories}
          sublabel="kcal"
          label="Calories"
        />
        <ProgressRing
          id="nutrition-protein"
          value={totals.protein}
          max={TARGETS.protein}
          centerText={`${totals.protein}g`}
          sublabel="protein"
          label="Protein"
        />
        <ProgressRing
          id="nutrition-carbs"
          value={totals.carbs}
          max={TARGETS.carbs}
          centerText={`${totals.carbs}g`}
          sublabel="carbs"
          label="Carbs"
        />
        <ProgressRing
          id="nutrition-fat"
          value={totals.fat}
          max={TARGETS.fat}
          centerText={`${totals.fat}g`}
          sublabel="fat"
          label="Fat"
        />
      </div>
    </div>
  );
}

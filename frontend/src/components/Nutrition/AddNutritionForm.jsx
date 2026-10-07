import React, { useState } from "react";

const MEAL_TYPES = ["Breakfast", "Lunch", "Dinner", "Snacks"];

const emptyForm = {
  foodName: "",
  quantity: "",
  calories: "",
  protein: "",
  carbs: "",
  fat: "",
  mealType: "Breakfast",
  date: new Date().toISOString().slice(0, 10),
};

const numericFields = ["quantity", "calories", "protein", "carbs", "fat"];

export default function AddNutritionForm({ onSubmit, onCancel, submitting }) {
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const validate = () => {
    const next = {};
    if (!form.foodName.trim()) next.foodName = "Food name is required.";
    if (!form.date) next.date = "Date is required.";
    if (!MEAL_TYPES.includes(form.mealType)) next.mealType = "Select a valid meal type.";

    numericFields.forEach((field) => {
      const value = form[field];
      if (value === "" || value === null) {
        next[field] = "This field is required.";
      } else if (isNaN(Number(value))) {
        next[field] = "Must be a number.";
      } else if (Number(value) < 0) {
        next[field] = "Cannot be negative.";
      }
    });

    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    const payload = {
      ...form,
      foodName: form.foodName.trim(),
      quantity: Number(form.quantity),
      calories: Number(form.calories),
      protein: Number(form.protein),
      carbs: Number(form.carbs),
      fat: Number(form.fat),
    };

    onSubmit(payload).then((ok) => {
      if (ok) setForm(emptyForm);
    });
  };

  return (
    <form className="nutrition-form" onSubmit={handleSubmit} noValidate>
      <h3>Add Nutrition</h3>

      <div className="form-row">
        <label>Meal Type</label>
        <select name="mealType" value={form.mealType} onChange={handleChange}>
          {MEAL_TYPES.map((type) => (
            <option key={type} value={type}>{type}</option>
          ))}
        </select>
        {errors.mealType && <span className="field-error">{errors.mealType}</span>}
      </div>

      <div className="form-row">
        <label>Food Name</label>
        <input
          type="text"
          name="foodName"
          value={form.foodName}
          onChange={handleChange}
          placeholder="e.g. Grilled chicken breast"
        />
        {errors.foodName && <span className="field-error">{errors.foodName}</span>}
      </div>

      <div className="form-grid">
        <div className="form-row">
          <label>Quantity</label>
          <input type="number" name="quantity" min="0" step="any" value={form.quantity} onChange={handleChange} />
          {errors.quantity && <span className="field-error">{errors.quantity}</span>}
        </div>
        <div className="form-row">
          <label>Calories (kcal)</label>
          <input type="number" name="calories" min="0" step="any" value={form.calories} onChange={handleChange} />
          {errors.calories && <span className="field-error">{errors.calories}</span>}
        </div>
        <div className="form-row">
          <label>Protein (g)</label>
          <input type="number" name="protein" min="0" step="any" value={form.protein} onChange={handleChange} />
          {errors.protein && <span className="field-error">{errors.protein}</span>}
        </div>
        <div className="form-row">
          <label>Carbs (g)</label>
          <input type="number" name="carbs" min="0" step="any" value={form.carbs} onChange={handleChange} />
          {errors.carbs && <span className="field-error">{errors.carbs}</span>}
        </div>
        <div className="form-row">
          <label>Fat (g)</label>
          <input type="number" name="fat" min="0" step="any" value={form.fat} onChange={handleChange} />
          {errors.fat && <span className="field-error">{errors.fat}</span>}
        </div>
        <div className="form-row">
          <label>Date</label>
          <input type="date" name="date" value={form.date} onChange={handleChange} />
          {errors.date && <span className="field-error">{errors.date}</span>}
        </div>
      </div>

      <div className="form-actions">
        <button type="submit" disabled={submitting}>
          {submitting ? "Saving..." : "Save"}
        </button>
        <button type="button" className="secondary" onClick={onCancel} disabled={submitting}>
          Cancel
        </button>
      </div>
    </form>
  );
}

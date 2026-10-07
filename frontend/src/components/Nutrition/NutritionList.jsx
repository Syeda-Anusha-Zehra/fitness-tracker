import React, { useState } from "react";

const MEAL_TYPES = ["Breakfast", "Lunch", "Dinner", "Snacks"];

function EditRow({ record, onCancel, onSave, saving }) {
  const [form, setForm] = useState({
    foodName: record.foodName,
    quantity: record.quantity,
    calories: record.calories,
    protein: record.protein,
    carbs: record.carbs,
    fat: record.fat,
    mealType: record.mealType,
    date: new Date(record.date).toISOString().slice(0, 10),
  });

  const handleChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSave = () => {
    onSave(record._id, {
      ...form,
      quantity: Number(form.quantity),
      calories: Number(form.calories),
      protein: Number(form.protein),
      carbs: Number(form.carbs),
      fat: Number(form.fat),
    });
  };

  return (
    <tr>
      <td colSpan={9}>
        <div className="edit-row-form">
          <select name="mealType" value={form.mealType} onChange={handleChange}>
            {MEAL_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
          </select>
          <input type="text" name="foodName" value={form.foodName} onChange={handleChange} placeholder="Food name" />
          <input type="number" name="quantity" value={form.quantity} onChange={handleChange} placeholder="Qty" min="0" step="any" />
          <input type="number" name="calories" value={form.calories} onChange={handleChange} placeholder="Cal" min="0" step="any" />
          <input type="number" name="protein" value={form.protein} onChange={handleChange} placeholder="Protein" min="0" step="any" />
          <input type="number" name="carbs" value={form.carbs} onChange={handleChange} placeholder="Carbs" min="0" step="any" />
          <input type="number" name="fat" value={form.fat} onChange={handleChange} placeholder="Fat" min="0" step="any" />
          <input type="date" name="date" value={form.date} onChange={handleChange} />
          <button onClick={handleSave} disabled={saving}>{saving ? "Saving..." : "Save"}</button>
          <button type="button" className="secondary" onClick={onCancel} disabled={saving}>Cancel</button>
        </div>
      </td>
    </tr>
  );
}

export default function NutritionList({ records, onDelete, onUpdate, loading }) {
  const [editingId, setEditingId] = useState(null);
  const [saving, setSaving] = useState(false);

  if (loading) return <p className="muted">Loading nutrition records...</p>;
  if (!(records || []).length) return <p className="muted">No nutrition records found.</p>;

  const handleSave = async (id, payload) => {
    setSaving(true);
    const ok = await onUpdate(id, payload);
    setSaving(false);
    if (ok) setEditingId(null);
  };

  return (
    <table className="nutrition-table">
      <thead>
        <tr>
          <th>Meal</th>
          <th>Food</th>
          <th>Qty</th>
          <th>Cal</th>
          <th>Protein</th>
          <th>Carbs</th>
          <th>Fat</th>
          <th>Date</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        {(records || []).map((r) =>
          editingId === r._id ? (
            <EditRow
              key={r._id}
              record={r}
              onCancel={() => setEditingId(null)}
              onSave={handleSave}
              saving={saving}
            />
          ) : (
            <tr key={r._id}>
              <td><span className={`badge badge-${r.mealType.toLowerCase()}`}>{r.mealType}</span></td>
              <td>{r.foodName}</td>
              <td>{r.quantity}</td>
              <td>{r.calories}</td>
              <td>{r.protein}g</td>
              <td>{r.carbs}g</td>
              <td>{r.fat}g</td>
              <td>{new Date(r.date).toLocaleDateString()}</td>
              <td>
                <button className="link-edit" onClick={() => setEditingId(r._id)}>Update</button>
                <button className="link-danger" onClick={() => onDelete(r._id)}>Delete</button>
              </td>
            </tr>
          )
        )}
      </tbody>
    </table>
  );
}

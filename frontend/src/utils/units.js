export const kgToLb = (kg) => Math.round(kg * 2.20462 * 10) / 10;
export const lbToKg = (lb) => Math.round((lb / 2.20462) * 10) / 10;
export const cmToIn = (cm) => Math.round(cm * 0.393701 * 10) / 10;
export const inToCm = (inches) => Math.round((inches / 0.393701) * 10) / 10;

// Convert a stored-in-kg/cm value to the display unit for the given preference
export const displayWeight = (kg, units) => (units === "imperial" ? kgToLb(kg) : kg);
export const displayHeight = (cm, units) => (units === "imperial" ? cmToIn(cm) : cm);

// Convert a value entered in the display unit back to kg/cm for storage
export const toStoredWeight = (value, units) => (units === "imperial" ? lbToKg(value) : value);
export const toStoredHeight = (value, units) => (units === "imperial" ? inToCm(value) : value);

export const weightUnitLabel = (units) => (units === "imperial" ? "lb" : "kg");
export const heightUnitLabel = (units) => (units === "imperial" ? "in" : "cm");

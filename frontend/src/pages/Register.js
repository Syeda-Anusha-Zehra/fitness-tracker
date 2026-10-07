import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const emptyForm = {
  name: "",
  email: "",
  password: "",
  confirmPassword: "",
  gender: "",
  age: "",
  height: "",
  weight: "",
};

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
    if (errors[name]) setErrors((er) => ({ ...er, [name]: "" }));
  };

  const validate = () => {
    const next = {};
    if (!form.name.trim()) next.name = "Name is required.";
    if (!form.email.trim()) next.email = "Email is required.";
    else if (!/\S+@\S+\.\S+/.test(form.email)) next.email = "Enter a valid email.";
    if (!form.gender) next.gender = "Select Male or Female.";
    if (!form.password) next.password = "Password is required.";
    else if (form.password.length < 6) next.password = "At least 6 characters.";
    if (form.password !== form.confirmPassword) next.confirmPassword = "Passwords do not match.";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    const payload = {
      name: form.name.trim(),
      email: form.email.trim(),
      password: form.password,
      gender: form.gender,
      age: form.age !== "" ? Number(form.age) : undefined,
      height: form.height !== "" ? Number(form.height) : undefined,
      weight: form.weight !== "" ? Number(form.weight) : undefined,
    };
    const result = await register(payload);
    setLoading(false);

    if (result.success) {
      navigate("/dashboard"); // redirect to dashboard after registration
    } else {
      setErrors((er) => ({ ...er, form: result.error }));
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-hero">
        <span className="hero-mark" aria-hidden="true">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
            <path d="M13 2 4 14h6l-1 8 9-12h-6l1-8Z" fill="currentColor" />
          </svg>
        </span>
        <h1>Create your account</h1>
        <p>Start tracking your nutrition and fitness goals.</p>
      </div>

      <form className="auth-form" onSubmit={handleSubmit} noValidate>
        {errors.form && <div className="error-banner">{errors.form}</div>}

        <div className="form-row">
          <label>Name</label>
          <input type="text" name="name" value={form.name} onChange={handleChange} />
          {errors.name && <span className="field-error">{errors.name}</span>}
        </div>

        <div className="form-row">
          <label>Email</label>
          <input type="email" name="email" value={form.email} onChange={handleChange} />
          {errors.email && <span className="field-error">{errors.email}</span>}
        </div>

        <div className="form-row">
          <label>Gender</label>
          <div className="gender-options">
            <label className={`gender-pill ${form.gender === "Male" ? "active" : ""}`}>
              <input
                type="radio"
                name="gender"
                value="Male"
                checked={form.gender === "Male"}
                onChange={handleChange}
              />
              Male
            </label>
            <label className={`gender-pill ${form.gender === "Female" ? "active" : ""}`}>
              <input
                type="radio"
                name="gender"
                value="Female"
                checked={form.gender === "Female"}
                onChange={handleChange}
              />
              Female
            </label>
          </div>
          {errors.gender && <span className="field-error">{errors.gender}</span>}
        </div>

        <div className="form-grid">
          <div className="form-row">
            <label>Age</label>
            <input type="number" name="age" min="10" max="120" value={form.age} onChange={handleChange} />
          </div>
          <div className="form-row">
            <label>Height (cm)</label>
            <input type="number" name="height" min="50" max="300" value={form.height} onChange={handleChange} />
          </div>
          <div className="form-row">
            <label>Weight (kg)</label>
            <input type="number" name="weight" min="10" max="500" value={form.weight} onChange={handleChange} />
          </div>
        </div>

        <div className="form-row">
          <label>Password</label>
          <input type="password" name="password" value={form.password} onChange={handleChange} />
          {errors.password && <span className="field-error">{errors.password}</span>}
        </div>

        <div className="form-row">
          <label>Confirm Password</label>
          <input type="password" name="confirmPassword" value={form.confirmPassword} onChange={handleChange} />
          {errors.confirmPassword && <span className="field-error">{errors.confirmPassword}</span>}
        </div>

        <button type="submit" disabled={loading}>{loading ? "Creating account..." : "Register"}</button>

        <p className="auth-switch">
          Already have an account? <Link to="/login">Log in</Link>
        </p>
      </form>
    </div>
  );
}

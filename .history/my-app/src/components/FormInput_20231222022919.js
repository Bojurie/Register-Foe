import React from "react";

const FormInput = ({ label, name, value, onChange, onBlur }) => {
  return (
    <div>
      <label>{label}</label>
      <input
        type="password"
        name="password"
        value={formData.password}
        onChange={handleChange}
      />
    </div>
  );
};

export default FormInput;

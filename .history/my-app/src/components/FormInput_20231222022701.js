import React from "react";

const FormInput = ({ label, name, value, onChange, onBlur }) => {
  return (
    <div>
      <label>{label}</label>
      <input
        type="text"
        name="username"
        value={formData.username}
        onChange={handleChange}
      />
    </div>
  );
};

export default FormInput;

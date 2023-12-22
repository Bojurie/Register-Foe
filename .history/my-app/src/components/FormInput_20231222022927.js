import React from "react";

const FormInput = ({ label}) => {
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

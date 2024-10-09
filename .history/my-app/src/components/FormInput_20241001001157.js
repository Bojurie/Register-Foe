import React from "react";

const FormInput = ({ label, name, value, onChange }) => {
  return (
    <div className="login-input">
      <label>{label}</label>
      <input
        type="text"
        name={name}
        value={value}
        onChange={onChange}
      />
    </div>
  );
};

export default FormInput;
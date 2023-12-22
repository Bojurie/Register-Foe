import React from "react";

const FormInput = ({ label, name, value, onChange, onBlur }) => {
  return (
    <div>
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

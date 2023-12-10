// FormInput.js

// FormInput.js

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
        onBlur={onBlur}
      />
    </div>
  );
};

export default FormInput;

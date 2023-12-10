import React from "react";

import './FormTitle.css'

export function FormTitle(props) {
  const { className, text } = props;
  return <h1 className={`${className} form-title`}>{text}</h1>;
}

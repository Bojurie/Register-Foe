import React from "react";

import './FormTitle.css'

export function FormTitle(props) {
  const { className, text } = props;
  return <h1 className={`${className} form-title`}>{text}</h1>;
}


// const FormTitle = () => {
//   const [title,setTitle ] = useState({
//     title: {
//       S
//     }
//   })
//   return (
//     <>
//       <div className='formTitle_heading'>
//         <h1>Register Form</h1>
//       </div>
//     </>
//   )
// }

// export default FormTitle

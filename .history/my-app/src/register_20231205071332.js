import Form from './components/Form';
import {FormTitle }from './components/FormTitle';
import './Home.css';

function Home() {
  return (
    <div className="registerIn_page">
      <div className="register-wrapper">
        <div className="register-form-header_wrapper">
          <div className="register-form-header_title">
            <FormTitle className="sign-in-form__title" text="Register" />
          </div>
        </div>

        <div className="Home_form_wrapper">
          <Form className="Home_form" />
        </div>
      </div>
    </div>
  );
}

export default Home;

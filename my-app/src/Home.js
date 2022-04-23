import Form from './components/Form';
import {FormTitle }from './components/FormTitle';
import './Home.css';

function Home() {
  return (
    <div className="Home">
      <div className='Home_wrapper'>
          <div className='Home_formTitle_wrapper'>
            <FormTitle className="home-header" text="Register Form"/> 
          </div>
          <div className='Home_form_wrapper'>
            <Form className='Home_form' />
          </div>
      </div>
    </div>
  );
}

export default Home;

import Form from './components/Form';
import FormTitle from './components/FormTitle';
import './App.css';

function App() {
  return (
    <div className="App">
      <div className='App_wrapper'>
          <div className='App_formTitle_wrapper'>
            <FormTitle className='App_formTile' />
          </div>
          <div className='App_form_wrapper'>
            <Form className='App_form' />
          </div>
      </div>
    </div>
  );
}

export default App;

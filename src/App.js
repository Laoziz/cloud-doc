<<<<<<< Updated upstream
import logo from './logo.svg';
import './App.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
=======
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import FileSearch from './components/FileSearch';
function App() {
  return (
    <div className="App container-fluid">
      <div className="row">
        <div className="col bg-light left-panel">
          <FileSearch
            title="云文档"
            onFileSearch={(value) => {console.log(value)}}
          />
        </div>
        <div className="col bg-primary right-panel">
          <h1>
            this is right
          </h1>
        </div>
      </div>
>>>>>>> Stashed changes
    </div>
  );
}

export default App;

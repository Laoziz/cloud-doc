import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import FileSearch from './components/FileSearch';
import FileList from './components/FileList';
import data from '../src/utils/data';
import BtnBottom from './components/BtnBottom';
import { faPlus, faFileImport } from '@fortawesome/free-solid-svg-icons'
function App() {
  console.log(data);
  return (
    <div className="App container-fluid px-0">
      <div className="row no-gutters">
        <div className="col-4 bg-light left-panel">
          <FileSearch
            title="我的云文档"
            onFileSearch={(value) => {console.log(value)}}
          />
          <FileList
            files={data}
            onFileClick={(id)=>{console.log('onFileClick:', id)}}
            onSaveEdit={(id, value)=>{console.log("editid:",id,value)}}
            onFileDelete={(id)=>{console.log('onFileDelete:', id)}}
          >
          </FileList>
          <div className='row no-gutters button-group'>
            <div className="col">
              <BtnBottom
                text="新建"
                colorClass="btn-primary"
                icon={faPlus}
                onClick={() =>{console.log("新建")}}
              ></BtnBottom>
            </div>
            <div className="col">
              <BtnBottom
                text="导入"
                colorClass="btn-success"
                icon={faFileImport}
                onClick={() =>{console.log("导入")}}
              ></BtnBottom>
            </div>
          </div>
        </div>
        <div className="col-8 bg-light right-panel">
          <h1>
            {"this is right"}
          </h1>
        </div>
      </div>
    </div>
  );
}

export default App;

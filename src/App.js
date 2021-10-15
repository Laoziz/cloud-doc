import FileSearch from './components/FileSearch';
import FileList from './components/FileList';
import data from '../src/utils/data';
import BtnBottom from './components/BtnBottom';
import TableList from './components/TableList';
import SimpleMDE from 'react-simplemde-editor';
import { faPlus, faFileImport } from '@fortawesome/free-solid-svg-icons';
import React, {useState, useEffect} from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'easymde/dist/easymde.min.css';

function App() {
  console.log(data);
  const [files, setFiles] = useState(data)
  const [activeFileID, setActiveFileID] = useState(1);
  const [openFileIDs, setOpenFileIDs] = useState([1])
  const [unsaveFileIDs, setUnsaveFileIDs] = useState([])
  const [searchFiles, setSearchFiles] = useState([])
  const openFiles = openFileIDs.map(openID => {
    return files.find(file => file.id == openID)
  });
  const activeFile = files.find(file => file.id == activeFileID);
  const FileClick = (fileID) => {
    if (!openFileIDs.includes(fileID)) {
      setOpenFileIDs([...openFileIDs, fileID])
    }
    setActiveFileID(fileID)
  }
  const TabClick = (fileID) => {
    setActiveFileID(fileID)
  }
  const CloseTab = (fileID) => {
    const newOpenIDs = openFileIDs.filter(openID => openID != fileID);
    setOpenFileIDs(newOpenIDs);
    if (newOpenIDs.length > 0) {
      setActiveFileID(newOpenIDs[0])
    } else {
      setActiveFileID(null)
    }
  }
  const FileChange = (fileID, value) => {
    const newFiles = files.map(file => {
      if (file.id == fileID) {
        file.body = value
      }
      return file
    })
    setFiles(newFiles)
  }
  const SaveEdit = (fileID, title) => {
    const newFiles = files.map(file => {
      if (file.id == fileID) {
        file.title = title
      }
      return file
    })
    setFiles(newFiles)
  }
  const DeleteFile = (fileID) => {
    const newFiles = files.filter(file => file.id != fileID)
    console.log('fileID', fileID)
    console.log('newFiles', newFiles)
    setFiles(newFiles)
    CloseTab(fileID)
  }
  const FileSearch = (key) => {
    const newFiles = files.filter(file => file.title.includes(key))
    setSearchFiles(newFiles)
  }
  const FileArr = searchFiles.length > 0 ? searchFiles : files;
  return (
    <div className="App container-fluid px-0 py-0">
      <div className="row no-gutters">
        <div className="col-3 bg-light left-panel">
          <FileSearch
            title="我的云文档"
            onFileSearch={FileSearch}
          />
          <FileList
            files={FileArr}
            onFileClick={FileClick}
            onSaveEdit={SaveEdit}
            onFileDelete={DeleteFile}
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
        <div className="col-9 bg-light right-panel">
          { !activeFileID &&
            <div className="start-page">
              {'选择或者新建 Makedown 文档'}
            </div>
          }
          { activeFileID && 
            <>
              <TableList
                files={openFiles}
                activeId={activeFileID}
                unSaveId={unsaveFileIDs}
                onTabClick={TabClick}
                onCloseTab={CloseTab}
              />
              <SimpleMDE
                key={activeFile && activeFile.id}
                value={activeFile && activeFile.body}
                onChange={(value) => {FileChange(activeFile.id, value)}}
                options={
                  {
                    minHeight: '620px',
                  }
                }
              />
            </>
          }

        </div>
      </div>
    </div>
  );
}

export default App;

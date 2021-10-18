import { v4 as uuidv4 } from 'uuid';
import SimpleMDE from 'react-simplemde-editor';
import { faPlus, faFileImport, faSave} from '@fortawesome/free-solid-svg-icons';
import React, {useState, useEffect} from 'react';
import FileSearch from './components/FileSearch';
import FileList from './components/FileList';
import data from '../src/utils/data';
import BtnBottom from './components/BtnBottom';
import TableList from './components/TableList';
import {flattenArr, objToArr} from '../src/utils/helper';
import fileHelper from './utils/fileHelper';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'easymde/dist/easymde.min.css';
const {join} = window.require('path');
const {remote} = window.require('electron');
// const Store = window.require('electron-store');
// const fileStore = new Store();
// fileStore.set('file', 'my boby');
// console.log(fileStore.get('file'));
// const saveFileToStore = (files) => {
//   // const saveFileObj = objToArr(files).reduce((result, file) => {
//   //   const {id, path, title, createTS} = file;
//   //   result[id] = {id,path,title,createTS};
//   //   return result;
//   // }, {});
//   // fileStore.set('files', saveFileObj);
// }
function App() {
  const fileFlatten = flattenArr(data);
  const [files, setFiles] = useState(fileFlatten)
  const [activeFileID, setActiveFileID] = useState();
  const [openFileIDs, setOpenFileIDs] = useState([])
  const [unsaveFileIDs, setUnsaveFileIDs] = useState([])
  const [searchFiles, setSearchFiles] = useState([])
  const saveLocation = remote.app.getPath('documents');
  const openFiles = openFileIDs.map(openID => {
    return files[openID]
  });
  const activeFile = files[activeFileID];
  const filesArr = objToArr(files);

  // file click
  const FileClick = (fileID) => {
    if (!openFileIDs.includes(fileID)) {
      setOpenFileIDs([...openFileIDs, fileID])
    }
    setActiveFileID(fileID)
  }

  // tab click
  const TabClick = (fileID) => {
    setActiveFileID(fileID)
  }
  
  // close tab
  const CloseTab = (fileID) => {
    const newOpenIDs = openFileIDs.filter(openID => openID !== fileID);
    setOpenFileIDs(newOpenIDs);
    if (newOpenIDs.length > 0) {
      setActiveFileID(newOpenIDs[0])
    } else {
      setActiveFileID(null)
    }
  }

  // file change
  const FileChange = (fileID, value) => {
    const newFiles = {...files, [fileID]: {...files[fileID], body: value}}
    setFiles(newFiles)
    setUnsaveFileIDs(unsaveFileIDs.includes(fileID) ? unsaveFileIDs : [...unsaveFileIDs, fileID])
  }

  // save title
  const updateFileName = (fileID, title, isNew) => {
    const newFiles = {...files, [fileID]: {...files[fileID], title, isNew: false}}
    const newPath = join(saveLocation, `${title}.md`);
    if (isNew) {
      fileHelper.writeFile(newPath, files[fileID].body).then(() => {
        setFiles(newFiles);
        // saveFileToStore(newFiles);
      });
    } else {
      fileHelper.renameFile(join(saveLocation, `${files[fileID].title}.md`), 
      newPath).then(() => {
          setFiles(newFiles)
          // saveFileToStore(newFiles);
      });
    }
    
    if (searchFiles.length > 0) {
      const newSearchFiles = searchFiles.map(file => {
        if (file.id === fileID) {
          file.title = title
        }
        return file
      });
      setSearchFiles(newSearchFiles);
    }
  }

  // delete file
  const DeleteFile = (fileID) => {
    const {[fileID]: value, ...deleteFiles} = files
    setFiles(deleteFiles)
    CloseTab(fileID)
    if (searchFiles.length > 0) {
      const newSearchFiles = searchFiles.filter(file => file.id !== fileID);
      setSearchFiles(newSearchFiles)
    }
  }

  // search file
  const SearchFile = (key) => {
    console.log(key)
    if (key === '') {
      setSearchFiles([])
    } else {
      const newFiles = filesArr.filter(file => file.title.includes(key))
      setSearchFiles(newFiles)
    }
  }

  // create file
  const createNewFile = () => {
    const uuid = uuidv4();
    const newFiles = {
      ...files,
      [uuid]: {
        id: uuid,
        body: `this file uuid: ${uuid}`,
        title: '',
        createTS: new Date().getTime(),
        isNew: true
      }
    };
    setFiles(newFiles);
  }

  //export file
  const exportFile = () => {

  }

  const saveCurrentFile = () => {
    fileHelper.writeFile(join(saveLocation, `${activeFile.title}.md`), activeFile.body).then(() => {
      setUnsaveFileIDs(unsaveFileIDs.filter(fileID => fileID !== activeFile.id));
    });
  }
  
  const FileArr = searchFiles.length > 0 ? searchFiles : filesArr;
  return (
    <div className="App container-fluid px-0 py-0">
      <div className="row no-gutters">
        <div className="col-3 bg-light left-panel">
          <FileSearch
            title="我的云文档"
            onFileSearch={SearchFile}
          />
          <FileList
            files={FileArr}
            onFileClick={FileClick}
            onSaveEdit={updateFileName}
            onFileDelete={DeleteFile}
          />
          <div className='row no-gutters button-group'>
            <div className="col">
              <BtnBottom
                text="新建"
                colorClass="btn-primary"
                icon={faPlus}
                onClick={createNewFile}
              />
            </div>
            <div className="col">
              <BtnBottom
                text="导入"
                colorClass="btn-success"
                icon={faFileImport}
                onClick={exportFile}
              />
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
                    minHeight: '599px',
                  }
                }
              />
              <BtnBottom
                text="保存"
                colorClass="btn-primary"
                icon={faSave}
                onClick={saveCurrentFile}
              />
            </>
          }

        </div>
      </div>
    </div>
  );
}

export default App;

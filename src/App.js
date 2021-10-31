import { v4 as uuidv4 } from 'uuid';
import SimpleMDE from 'react-simplemde-editor';
import { faPlus, faFileImport, faSave} from '@fortawesome/free-solid-svg-icons';
import React, {useState, useEffect} from 'react';
import FileSearch from './components/FileSearch';
import FileList from './components/FileList';
// import data from '../src/utils/data';
import BtnBottom from './components/BtnBottom';
import TableList from './components/TableList';
import {flattenArr, objToArr} from '../src/utils/helper';
import fileHelper from './utils/fileHelper';
import useIpcRender from './hooks/useIpcRender';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'easymde/dist/easymde.min.css';
const {join, basename, extname, dirname} = window.require('path');
const {remote} = window.require('electron');

console.log('start')
let Store = window.require('electron-store');
const fileStore = new Store({'name': 'Files Data'});
const settingsStore = new Store({name: 'Settings'})
const saveFileToStore = (files) => {
  const saveFileObj = objToArr(files).reduce((result, file) => {
    const {id, path, title, createTS} = file;
    result[id] = {id, path ,title,createTS};
    return result;
  }, {});
  fileStore.set('files', saveFileObj);
}
function App() {
  const [files, setFiles] = useState(fileStore.get('files') || {})
  const [activeFileID, setActiveFileID] = useState();
  const [openFileIDs, setOpenFileIDs] = useState([])
  const [unsaveFileIDs, setUnsaveFileIDs] = useState([])
  const [searchFiles, setSearchFiles] = useState([])
  console.log('saveFileLocation:', settingsStore.get('savedFileLocation'));
  const saveLocation = settingsStore.get('savedFileLocation') || remote.app.getPath('documents');
  const openFiles = openFileIDs.map(openID => {
    return files[openID]
  });
  const activeFile = files[activeFileID];
  const filesArr = objToArr(files);

  // file click
  const FileClick = (fileID) => {
    const currentFile = files[fileID];
    if (!currentFile.isLoaded) {
      fileHelper.readFile(currentFile.path).then(value => {
        const newFile = {...files[fileID], body: value, isLoaded: true}
        setFiles({...files, [fileID]: newFile})
      });
    }
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
    if (value !== files[fileID].body) {
      const newFiles = {...files, [fileID]: {...files[fileID], body: value}}
      setFiles(newFiles)
      setUnsaveFileIDs(unsaveFileIDs.includes(fileID) ? unsaveFileIDs : [...unsaveFileIDs, fileID])
    }
  }

  // save title
  const updateFileName = (fileID, title, isNew) => {
    const newPath = isNew ? join(saveLocation, `${title}.md`): join(dirname(files[fileID].path), `${title}.md`);
    const newFiles = {...files, [fileID]: {...files[fileID], title, isNew: false, path: newPath}}
    if (isNew) {
      console.log('newPath:', newPath);
      fileHelper.writeFile(newPath, files[fileID].body).then(() => {
        setFiles(newFiles);
        saveFileToStore(newFiles);
      });
    } else {
      fileHelper.renameFile(files[fileID].path, newPath).then(() => {
          setFiles(newFiles)
          saveFileToStore(newFiles);
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
    const {[fileID]: file, ...deleteFiles} = files
    if (file.isNew) {
      setFiles(deleteFiles)
    } else {
      fileHelper.deleteFile(file.path).catch(err => {
        console.log('deleteFile:', err.toString())
      })
      setFiles(deleteFiles)
      saveFileToStore(deleteFiles)
      CloseTab(fileID)
      if (searchFiles.length > 0) {
        const newSearchFiles = searchFiles.filter(file => file.id !== fileID);
        setSearchFiles(newSearchFiles)
      }
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
        isNew: true,
        path: ''
      }
    };
    setFiles(newFiles);
  }

  //export file
  const exportFile = () => {
    remote.dialog.showOpenDialog({
      title: '选择导入的mkdown文件',
      properties: ['openFile', 'multiSelections'],
      filters: [
        {name: 'MakeDown Files', extensions: ['md']}
      ]
    }, paths => {
      console.log(paths)
      if (Array.isArray(paths)) {
        const filteredPaths = paths.filter(path => {
          const isAdded = Object.values(files).find(file => file.path === path)
          return !isAdded
        })
        const addFiles = filteredPaths.map(path => {
          return {
            id: uuidv4(),
            path,
            title: basename(path, extname(path))
          }
        })
        const newFiles = {...files, ...flattenArr(addFiles)}
        setFiles(newFiles)
        saveFileToStore(newFiles)
        if (addFiles.length > 0) {
          remote.dialog.showMessageBox({
            type: 'info',
            title: `成功导入${addFiles.length}个文件`,
            message: `成功导入${addFiles.length}个文件`
          })
        }
      }
    })
  }

  const saveCurrentFile = () => {
    fileHelper.writeFile(activeFile.path, activeFile.body).then(() => {
      setUnsaveFileIDs(unsaveFileIDs.filter(fileID => fileID !== activeFile.id));
    });
  }
  useIpcRender({
    'create-new-file': createNewFile,
    'import-file': exportFile,
    'save-edit-file': saveCurrentFile,
  });
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
                    minHeight: '625px',
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

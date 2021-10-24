const fs = window.require('fs').promises;

const fileHelper = {
  readFile: (path) => {
    // 判断文件是否存在，不存在删除数据
    return fs.readFile(path, {encoding: 'utf8'});
  },
  writeFile: (path, content) => {
    // 判断同名
    return fs.writeFile(path, content, {encoding: 'utf8'});
  },
  renameFile: (path, newPath) => {
    return fs.rename(path, newPath);
  },
  deleteFile: (path) => {
    return fs.unlink(path);
  }
}

export default fileHelper;
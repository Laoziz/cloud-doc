
// var config = new qiniu.conf.Config();
const accessKey = 'c6SBtDfJfWNsXHDhUBv3Pc36pKeeGt3qqhMv4Lmt';
const secretKey = 'itPMJqtosWUCiHCKdT85lLViNm6nPlMhBeoetDRB';
var localFile = "C:\\Users\\laoziz\\Desktop\\test-new\\first.md";
const path = require('path')
var key='how.md';
let downloadPath = path.join(__dirname, key)

const QiniuManager = require('../cloud-doc/src/utils/QiniuManage');
const qiniu = new QiniuManager(accessKey, secretKey, 'hgzhou');
// qiniu.upLoadFile(key, localFile).then((data) => {
//   console.log(data)
// }).catch(err => {
//   console.log(JSON.stringify(err))
// });
// qiniu.deleteFile(key).then((data) => {
//   console.log(data)
// }).catch(err => {
//   console.log(JSON.stringify(err))
// });
// qiniu.getBucketDomain().then((data) => {
//   console.log(data)
// }).catch(err => {
//   console.log(JSON.stringify(err))
// });
// qiniu.generateDownloadLink(key).then(data => {
//   console.log(data)
//   return qiniu.generateDownloadLink('first.md')
// }).then(data => {
//   console.log(data)
// })

qiniu.downloadFile(key, downloadPath).then(data => {
  console.log('success',JSON.stringify(data))
}).catch(err => {
  console.log(err.toString())
})
// qiniu.deleteFile(key)
// var mac = new qiniu.auth.digest.Mac(accessKey, secretKey);
// var config = new qiniu.conf.Config();
// var bucketManager = new qiniu.rs.BucketManager(mac, config);
// var publicBucketDomain = 'http://r1n0osx0y.hd-bkt.clouddn.com';
// // 公开空间访问链接
// var publicDownloadUrl = bucketManager.publicDownloadUrl(publicBucketDomain, key);
// console.log(publicDownloadUrl);
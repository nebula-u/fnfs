const http = require('http')
const fs = require('fs')
const path = require('path')
const url = require('url')

const sharePath = '/home/nebulau/aliyunpan/'

function getFileList(Path, res){
    Path = sharePath+Path
    if (!Path.endsWith(path.sep)) {
        Path = Path + path.sep
    }

    // 定义返回给前端程序的数组对象
    let fileList = []
    let fileAndFolderList = []

    // 为了避免给浏览器响应空，导致浏览器数组越界
    var emptyFile = { name: "empty", type: "empty", size: 0, date: "empty", path: '/'+path.relative(sharePath, Path+'empty')}
    fileAndFolderList.push(emptyFile)

    // 当路径有效时，才进行刷新处理
    if (fs.existsSync(Path)) {

        // 读取所有文件
        const files = fs.readdirSync(Path);

        for (let i = 0; i < files.length; i++) {

            // 定义每一个文件需要反馈给前端的属性
            var fileInfo = { name: "", type: "", size: 0, date: "", path: ""}

            // 填写文件名
            fileInfo.name = files[i]

            // 填写文件路径
            let currentFile = Path + fileInfo.name
            fileInfo.path = '/' + path.relative(sharePath, currentFile)
            // console.log('8:' + path.relative(sharePath, currentFile))

            // 获取文件大小、修改日期等详细信息
            let stats = fs.lstatSync(currentFile);
            
            // 填充文件修改日期
            fileInfo.date = stats.mtime.getFullYear()                                       + '-' + 
                            (Array(2).join(0) + (stats.mtime.getMonth() + 1)).slice(-2)     + '-' + 
                            (Array(2).join(0) + stats.mtime.getDate()).slice(-2)            + ' ' +
                            (Array(2).join(0) + stats.mtime.getHours()).slice(-2)           + ':' + 
                            (Array(2).join(0) + stats.mtime.getMinutes()).slice(-2)         + ':' + 
                            (Array(2).join(0) + stats.mtime.getSeconds()).slice(-2)

            // 填充文件类型、大小
            if (stats.isDirectory()){
                fileInfo.type = '.folder'
                fileInfo.size = 0
            }
            else{
                var lastPoingPos = fileInfo.name.lastIndexOf(".")
                if((-1 == lastPoingPos) || (0 == lastPoingPos)){
                    fileInfo.type = '.file'
                }
                else{
                    fileInfo.type = fileInfo.name.slice(fileInfo.name.lastIndexOf(".") + 1)
                }
                fileInfo.size = stats.size
            }
            
            // 将当前文件信息压入数组中
            if(fileInfo.type === '.folder'){
                fileAndFolderList.push(fileInfo);
            }else{
                fileList.push(fileInfo)
            }
        }
    } else {
        console.warn('指定的目录 '+ Path +' 不存在！')
    }

    fileAndFolderList = fileAndFolderList.concat(fileList)

    // 像前端页面返回列表信息
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ list: fileAndFolderList }));
}

function getFile(Path, res) {
    Path = sharePath+Path;
    const Name = path.basename(Path)
    const encodedFileName = encodeURIComponent(Name);
    res.setHeader('Content-Disposition', `attachment; filename=${encodedFileName}`);
    res.setHeader('Content-Length', fs.lstatSync(Path).size);
    const fileStream = fs.createReadStream(Path);
    fileStream.pipe(res);
}

const server = http.createServer((req, res) => {
    var request = decodeURIComponent(req.url)
    if('/' === request){
        request = '/index.html'
    }
    RequestSegment = request.split('/')

    console.log(request)

    if('get-file-list' === RequestSegment[1]){
        getFileList(path.relative('/get-file-list', request), res)
        return;
    }

    if('get-file' === RequestSegment[1]){
        // console.log(path.relative('/get-file', request))
        getFile(path.relative('/get-file', request), res)
        return
    }
    
    fileName = path.join('.', request)

    fs.readFile(fileName, (err, data)=>{
        res.writeHead(200)
        res.end(data)
    })
})

server.listen(1080, ()=>{
    console.log('server running at http://localhost:1080/')
})

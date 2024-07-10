const http = require('http')
const fs = require('fs')
const path = require('path')
const url = require('url')

const sharePath = '/home/nebulau/aliyunpan/'

function updatePage(Path, res){
    Path = sharePath+Path
    if (!Path.endsWith(path.sep)) {
        Path = Path + path.sep
    }

    // console.log('#: ' + Path)

    // 定义返回给前端程序的数组对象
    let FileList = []

    // 当路径有效时，才进行刷新处理
    if (fs.existsSync(Path)) {

        // 读取所有文件
        const files = fs.readdirSync(Path);

        for (let i = 0; i < files.length; i++) {

            // 定义每一个文件需要反馈给前端的属性
            var FileInfo = { name: "", type: "", size: 0, date: "", path: ""}

            // 填写文件名
            FileInfo.name = files[i]

            // 填写文件路径
            let currentFile = Path + FileInfo.name
            FileInfo.path = '/' + path.relative(sharePath, currentFile)
            // console.log('8:' + path.relative(sharePath, currentFile))

            // 获取文件大小、修改日期等详细信息
            let stats = fs.lstatSync(currentFile);
            
            // 填充文件修改日期
            FileInfo.date = stats.mtime.getFullYear()                                       + '-' + 
                            (Array(2).join(0) + (stats.mtime.getMonth() + 1)).slice(-2)     + '-' + 
                            (Array(2).join(0) + stats.mtime.getDate()).slice(-2)            + ' ' +
                            (Array(2).join(0) + stats.mtime.getHours()).slice(-2)           + ':' + 
                            (Array(2).join(0) + stats.mtime.getMinutes()).slice(-2)         + ':' + 
                            (Array(2).join(0) + stats.mtime.getSeconds()).slice(-2)

            // 填充文件类型、大小
            if (!stats.isDirectory()){
                FileInfo.type = currentFile.substr(currentFile.lastIndexOf(".") + 1)
                FileInfo.size = stats.size
            }
            else{
                FileInfo.type = 'folder'
                FileInfo.size = 0
            }
            
            // 将当前文件信息压入数组中
            FileList.push(FileInfo);
        }
    } else {
        console.warn('指定的目录 '+ Path +' 不存在！')
    }

    // 像前端页面返回列表信息
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ list: FileList }));
}

const server = http.createServer((req, res) => {
    var request = decodeURIComponent(req.url)
    if('/' === request){
        request = '/index.html'
    }
    RequestSegment = request.split('/')

    // console.log('@ ' + request)
    if('file-list-update' === RequestSegment[1]){
        updatePage(path.relative('/file-list-update', request), res)
        return;
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

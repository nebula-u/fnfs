const http = require('http')
const fs = require('fs')
const path = require('path')
const url = require('url')

const sharePath = '/home/nebulau/aliyunpan/05_影音/《大明王朝1566》独家超清修复版/'

function updatePage(Path, res){
    let FileList = []
    if (fs.existsSync(Path)) {
        const files = fs.readdirSync(Path);
        for (let i = 0; i < files.length; i++) {
            var FileInfo = { name: "", type: "", size: 0, date: "" }
            FileInfo.name = files[i]
            let currentFile = Path + '/' + FileInfo.name;
            let stats = fs.lstatSync(currentFile);
            
            FileInfo.date = stats.mtime.getFullYear()                                       + '-' + 
                            (Array(2).join(0) + (stats.mtime.getMonth() + 1)).slice(-2)     + '-' + 
                            (Array(2).join(0) + stats.mtime.getDate()).slice(-2)            + ' ' +
                            (Array(2).join(0) + stats.mtime.getHours()).slice(-2)           + ':' + 
                            (Array(2).join(0) + stats.mtime.getMinutes()).slice(-2)         + ':' + 
                            (Array(2).join(0) + stats.mtime.getSeconds()).slice(-2)

            if (!stats.isDirectory()){
                FileInfo.type = currentFile.substr(currentFile.lastIndexOf(".") + 1)
                FileInfo.size = stats.size
            }
            else{
                FileInfo.type = 'folder'
                FileInfo.size = 0
            }
            
            FileList.push(FileInfo);
        }
    } else {
        console.warn(`指定的目录 ${filePath} 不存在！`);
    }

    // console.log(FileList)
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ list: FileList }));
}

const server = http.createServer((req, res) => {
    var request = req.url
    if('/' === request){
        request = '/index.html'
    }

    if('/file-list-update' === request){
        updatePage(sharePath, res)
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

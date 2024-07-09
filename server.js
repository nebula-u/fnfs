const http = require('http')
const fs = require('fs')
const path = require('path')
const url = require('url')

const sharePath = 'C:\\Users\\moooi\\Documents\\pan'

function updatePage(Path, res){
    let FileList = []
    if (fs.existsSync(Path)) {
        const files = fs.readdirSync(Path);
        for (let i = 0; i < files.length; i++) {
            var FileInfo = { name: "", type: "", size: 0, date: "", time: "" }
            FileInfo.name = files[i]
            let currentFile = Path + '/' + FileInfo.name;
            let stats = fs.lstatSync(currentFile);
            FileInfo.date = stats.mtime.toString().substr(0, 10)
            FileInfo.time = stats.mtime.toString().substr(11, 19)
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

    console.log(FileList)
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ list: FileList }));
}

const server = http.createServer((req, res) => {
    var request = req.url
    if('/' === request){
        request = '/index.html'
    }

    if('/file-list-update' === request){
        updatePage('D:\\01_书籍\\', res)
        return;
    }
    
    fileName = path.join('.', request)

    fs.readFile(fileName, (err, data)=>{
        res.writeHead(200)
        res.end(data)
    })
})

server.listen(80, ()=>{
    console.log('server running at http://localhost:80/')
})

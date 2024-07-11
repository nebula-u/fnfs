// 父页面
var parentWindow = window.parent;

function getFile(Path, Name) {
    url = '/get-file' + Path
    const link = document.createElement('a');
    link.href = url;
    link.download = Name; // 自定义文件名
    console.log(Name)
    link.style.display = 'none';
    document.body.appendChild(link);
    link.click();
    URL.revokeObjectURL(link.href); // 释放 URL 对象
    document.body.removeChild(link);
}

function getFileList(Path) {
    var listDiv = document.getElementById('file-list')
    while (listDiv.firstChild) {
        listDiv.removeChild(listDiv.firstChild)
    }
    url = '/get-file-list' + Path

    fetch(url)
        .then(response => response.json())
        .then(json => {
            for (let i = 1; i < json.list.length; i++) {
                // 1. 创建一个文件项
                const file = document.createElement('div');

                // 2. 设置文件id和class和path
                file.id = i
                if (0 === i % 2) {
                    file.classList.add('file-item-o')
                } else {
                    file.classList.add('file-item-j')
                }

                // 3. 创建和设置文件的名称div
                const fileName = document.createElement('div')
                fileName.id = 'file-name'
                fileName.classList.add('master')
                fileName.title = json.list[i].path
                fileName.innerText = json.list[i].name

                // 4. 创建和设置文件的日期div
                const fileDate = document.createElement('div')
                fileDate.id = 'file-date'
                fileDate.classList.add('standby')
                fileDate.innerText = (json.list[i].date)

                // 5. 创建和设置文件的类型div
                const fileType = document.createElement('div')
                fileType.id = 'file-type'
                fileType.classList.add('standby')
                fileType.innerText = json.list[i].type

                // 6. 创建和设置文件的大小div
                const fileSize = document.createElement('div')
                fileSize.id = 'file-size'
                fileSize.classList.add('standby')
                if (json.list[i].size < 1024) {
                    fileSize.innerText = json.list[i].size + 'B'
                }
                else if (json.list[i].size < 1024 * 1024) {
                    fileSize.innerText = (json.list[i].size / 1024).toFixed(2) + 'KB'
                }
                else if (json.list[i].size < 1024 * 1024 * 1024) {
                    fileSize.innerText = (json.list[i].size / (1024 * 1024)).toFixed(2) + 'MB'
                }
                else if (json.list[i].size < 1024 * 1024 * 1024 * 1024) {
                    fileSize.innerText = (json.list[i].size / (1024 * 1024 * 1024)).toFixed(2) + 'GB'
                }

                if (json.list[i].type === '.folder') {
                    fileSize.innerText = ''
                }

                // 7. 创建和设置文件的操作div
                const fileOpti = document.createElement('div')
                fileOpti.id = 'file-opti'
                fileOpti.classList.add('standby')
                fileOpti.innerText = '删除'

                // 8. 将各个子项div添加到文件项div中
                file.append(fileName)
                file.append(fileDate)
                file.append(fileType)
                file.append(fileSize)
                file.append(fileOpti)

                // 9. 将文件项div添加到列表中
                listDiv.append(file)
            }

            // 10.维护当前页面显示的路径
            var pos = json.list[0].path.lastIndexOf('/')
            parentWindow.curDisplayPath = json.list[0].path.substr(0, pos)
            if ('' === parentWindow.curDisplayPath) {
                parentWindow.curDisplayPath = '/'
            }
            var path_level_1 = parent.document.getElementById('path-level-1')
            path_level_1.innerText = parentWindow.curDisplayPath

            // 10. 给各个文件的文件名添加点击事件
            const oFileList = document.getElementById('file-list')

            const allFiles = oFileList.childNodes
            allFiles.forEach(function (file) {
                const nameDiv = file.querySelector('#file-name')
                const path = nameDiv.getAttribute('title')

                nameDiv.addEventListener('click', () => {
                    var fileType = file.querySelector('#file-type').innerText
                    // 给文件夹添加点击事件
                    if ('.folder' === fileType) {
                        parentWindow.historyPath = []
                        getFileList(path)
                    }
                    //给文件添加点击事件
                    else {
                        getFile(path, file.querySelector('#file-name').innerText)
                    }
                })
            })
        })
        .catch(err => console.log('request failed: ' + err))
}

window.onload = function () {
    // 刚打开网页时，显示根目录文件列表
    getFileList('')
}
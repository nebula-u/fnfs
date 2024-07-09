window.onload = function () {
    var listDiv = document.getElementById('file-list')
    fetch('/file-list-update')
    .then(response=>response.json())
    .then(json=>{
        for(let i = 0; i < json.list.length; i++){
            // 1. 创建一个文件项
            const file = document.createElement('div');

            // 2. 设置文件id和class
            file.id = i
            if(0 === i%2){
                file.classList.add('file-item-o')
            }else{
                file.classList.add('file-item-j')
            }
            
            // 3. 创建和设置文件的名称div
            const fileName = document.createElement('div')
            fileName.id = 'file-name'
            fileName.classList.add('master')
            fileName.title = json.list[i].name
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
            if(json.list[i].size < 1024){
                fileSize.innerText = json.list[i].size + 'B'
            }
            else if(json.list[i].size < 1024*1024){
                fileSize.innerText = (json.list[i].size/1024).toFixed(2) + 'KB'
            }
            else if(json.list[i].size < 1024*1024*1024){
                fileSize.innerText = (json.list[i].size/(1024*1024)).toFixed(2) + 'MB'
            }
            else if(json.list[i].size < 1024*1024*1024*1024){
                fileSize.innerText = (json.list[i].size/(1024*1024*1024)).toFixed(2) + 'GB'
            }

            if(json.list[i].type === 'folder'){
                fileSize.innerText = ''
            }

            // 7. 创建和设置文件的操作div
            const fileOpti = document.createElement('div')
            fileOpti.id = 'file-opti'
            fileOpti.classList.add('standby')
            fileOpti.innerText = ''

            // 8. 将各个子项div添加到文件项div中
            file.append(fileName)
            file.append(fileDate)
            file.append(fileType)
            file.append(fileSize)
            file.append(fileOpti)

            // 9. 将文件项div添加到列表中
            listDiv.append(file)
        }
    })
    .catch(err=>console.log('request failed: ' + err))
}
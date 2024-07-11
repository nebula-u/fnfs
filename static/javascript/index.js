var curDisplayPath = ''
var historyPath = []    //用于前向跳页

window.onload = function () {
    const oBackBtn = document.getElementById('back')
    const oFrontBtn = document.getElementById('front')
    // 需要调用子页面函数（后续应该将此函数重构进父页面）
    var childWindow = window.frames['file-list-ifream']
    oBackBtn.addEventListener('click', function () {
        var pos = curDisplayPath.lastIndexOf('/')
        if('/' != curDisplayPath){
            var lastLevel = curDisplayPath.substr(0, pos)
            childWindow.contentWindow.getFileList(lastLevel)
            historyPath.push(curDisplayPath)
        }
        else{
            // 当前已经是顶层目录
        }
    })
    oFrontBtn.addEventListener('click', function () {
        if(historyPath.length>0){
            var p = historyPath.pop()
            childWindow.contentWindow.getFileList(p)
        }
        else{
            // 没有前向路径
        }
    })
}
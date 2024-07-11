var curDisplayPath = ''

window.onload = function () {
    // var childWindow = document.frames['file-list-ifream']
    const oLastLevelBtn = document.getElementById('back')
    oLastLevelBtn.addEventListener('click', function () {
        var childWindow = window.frames['file-list-ifream']
        console.log(childWindow)
        var pos = curDisplayPath.lastIndexOf('/')
        var lastLevel = curDisplayPath.substr(0, pos)
        console.log(window.frames['file-list-ifream'].contentWindow.getFileList(lastLevel))
    })
}
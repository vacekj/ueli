import fs from 'fs'
import path from 'path'
import { exec } from 'child_process'
import { ipcRenderer } from 'electron'
import { lstatSync } from 'original-fs';

let fileIcon = 'icons8-file'
let folderIcon = 'icons8-opened-folder'

export default class FileBrowser {
    constructor() {
        this.name = 'File Browser'        
    }

    getName() {
        return this.name
    }

    isValid(filePath) {
        let regex = new RegExp(/[a-z]:[\\/]/ig)
        return regex.test(filePath) && (fs.existsSync(filePath) || fs.existsSync(path.dirname(filePath)))
    }

    execute(filePath) {
        exec(`start "" "${filePath}"`, (err, stdout, sterr) => {
            if (err)
                throw err
            else
                ipcRenderer.send('hide-main-window')
        })
    }

    getSearchResult(userInput) {
        if (fs.existsSync(userInput)) {
            let filePath = userInput
            let stats = fs.lstatSync(filePath)
            if (stats.isDirectory()) {
                return getResultFromDirectory(filePath, userInput)
            }
            else if (stats.isFile()) {
                return [{
                    name: path.basename(filePath),
                    execArg: filePath,
                    icon: fileIcon
                }]
            }
        }
        else if (fs.existsSync(path.dirname(userInput))) {
            return getResultFromDirectory(path.dirname(userInput), userInput)
        }
    }
}

function getResultFromDirectory(folderPath, userInput) {
    folderPath = path.win32.normalize(folderPath)
    let folderSeparator = folderPath.endsWith('\\') ? '' : '\\'
    let files = fs.readdirSync(folderPath)
    let searchFileName = path.basename(userInput)
    let result = []

    for (let file of files) {
        try {
            let filePath = `${folderPath}${folderSeparator}${path.win32.normalize(file)}`
            let stats = fs.lstatSync(filePath)

            if (stats.isSymbolicLink())
                continue

            let isDirectory = stats.isDirectory()
            let fileName = path.basename(filePath)

            if (userInput.endsWith('\\') || filePath.toLowerCase().indexOf(searchFileName.toLowerCase()) > -1)
                result.push({
                    name: fileName,
                    execArg: filePath,
                    icon: isDirectory ? folderIcon : fileIcon
                })
        }
        catch (err) {
            continue
        }

    }

    return result
}
import { Router, type Request, type Response } from "express";
import fs from 'fs';
import path from 'path';
import { isArray, isString } from "./utils.js";
import { smbr_config } from "./config.js";

let fileList : string[] = [];
export function reloadFileListFromDisk() : boolean{
    const result : string[] = [];

    function readDirRecursive(dir : string, prefix = '') {
        const entries = fs.readdirSync(dir, { withFileTypes: true });

        for (const entry of entries) {
            const fullPath = path.join(dir, entry.name);
            const relativePath = prefix ? `${prefix}|${entry.name}` : entry.name;

            if (entry.isFile()) {
                result.push(relativePath);
            } else if (entry.isDirectory()) {
                readDirRecursive(fullPath, prefix ? `${prefix}|${entry.name}` : entry.name);
            }
        }
    }

    try {
        readDirRecursive(smbr_config.configFilesTarget);
        fileList = result;
        return true;
    } catch (err) {
        console.error("unable to reload config file list:\n",err);
        fileList = [];
        return false;
    }
}

function fileSpecifierCheck(specifier : string | string[] | undefined, res : Response) : specifier is string{
    if(!specifier){
        res.status(400).send("missing file specifier");
        return false;
    }
    if(isArray(specifier)){
        res.status(400).send("use \"|\" for subdirectories");
        return false;
    }
    if(specifier.includes("..")){
        res.status(403).send("Illegal acces to file: "+specifier);
        console.warn("Illegal acces to file:",specifier,"detected");
        return false;
    }
    return true;
}




export function getFileList(req : Request, res : Response) {
    if(fileList.length === 0){
        if(!reloadFileListFromDisk()){
            res.status(500).send("unable to read file list");
            return;
        }
    }
    res.status(200).json(fileList);
}

export function getFileListReload(req : Request, res : Response) {
    if(!reloadFileListFromDisk()){
        res.status(500).send("unable to read file list");
        return;
    }
    res.status(200).json(fileList);
}

export function getFileContent(req: Request, res: Response){
    const fileName = req.params.userPath;
    if(!fileSpecifierCheck(fileName,res)){
        return;
    }

    const fileNameSplit = fileName.split("|");

    var fileData = "";
    try {
        fileData = fs.readFileSync(path.join(smbr_config.configFilesTarget,...fileNameSplit),'utf8');
    } catch (error) {
        res.status(404).send("file not found");
        return;
    }
    res.status(200).send({
        name: fileName,
        content: fileData
    });
    return;
}

export function setFileContent(req : Request, res : Response){
    const fileName = req.params.userPath;
    if(!fileSpecifierCheck(fileName,res)){
        return;
    }

    const fileNameSplit = fileName.split("|");

    if(!isString(req.body.name) || !isString(req.body.content)){
        res.status(400).send("invalid request body, missing required fields");
        return;
    }

    if(req.body.name!=fileName){
        res.status(400).send("invalid request body, name missmatch");
        return;
    }

    try {
        fs.writeFileSync(path.join(smbr_config.configFilesTarget,...fileNameSplit),req.body.content);
    } catch (error) {
        res.status(500).send("unable to write to file");
        console.error("failed to write to config file: "+fileName+" errror:\n",error);
        return;
    }

    res.status(200).send("file updated successfully");

    reloadFileListFromDisk();
}

export function deleteFile(req : Request, res : Response){
    const fileName = req.params.userPath;
    if(!fileSpecifierCheck(fileName,res)){
        return;
    }

    const fileNameSplit = fileName.split("|");
    try {
        fs.unlinkSync(path.join(smbr_config.configFilesTarget,...fileNameSplit));
    } catch (error) {
        res.status(500).send("failed to delete file");
        console.error("failed to delete config file: "+fileName+" errror:\n",error);
        return;
    }
    res.status(200).send("file deleted successfully");

    reloadFileListFromDisk();
}








export const configFilesRouter = Router();
configFilesRouter.get("/", getFileList);
configFilesRouter.patch("/", getFileListReload);
configFilesRouter.get("/:userPath", getFileContent);
configFilesRouter.put("/:userPath", setFileContent);
configFilesRouter.delete("/:userPath", deleteFile);
import { fileURLToPath } from 'url';
import path from 'path';
import express from 'express';
import chalk from 'chalk';
import cors from 'cors';
import { configFilesRouter } from './config-endpoints.js';
import { serviceStatusRouter } from './service-status.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const distPath = path.join(__dirname, '..', '..', '..', 'client', 'dist');




{
    //colors all error outputs RED and warn outputs in YELLOW and debug in GREY (debug is not printed at all when verbose mode isn't on)
    function pad(num : number, size: number) : string {
        let s : string = num.toString();
        while (s.length < size){
            s = "0" + s;
        }
        return s;
    }

    function consoleTimestamp(): string{
        let time : Date = new Date();
        return chalk.gray(
            `[${pad(time.getHours(),2)}:`+
            `${pad(time.getMinutes(),2)}:`+
            `${pad(time.getSeconds(),2)}:`+
            `${pad(time.getMilliseconds(),3)}]`
        ) 
    }

    const originalLog = console.log;
    console.log = (...args) => {
        originalError(consoleTimestamp(),...args);
    };

    const originalError = console.error;
    console.error = (...args) => {
        originalError(consoleTimestamp(),chalk.red(...args));
    };

    const originalWarn = console.warn;
    console.warn = (...args) => {
        originalWarn(consoleTimestamp(),chalk.yellow(...args));
    };

    const originalDebug = console.debug;
    console.debug = (...args) => {
        if (verboseMode){
            originalDebug(consoleTimestamp(),chalk.gray(...args));
        }
    };
}

let debugMode = false;
let verboseMode = false;
let noFrontEnd = false;
process.argv.forEach(function (val, index, array) {
    if(val == "-d"){
        console.warn("Running in DEBUG MODE");
        debugMode = true;
    }
    if(val == "-v"){
        console.warn("Running in VERBOSE MODE");
        verboseMode = true;
    }
    if(val == "--no-frontend"){
        console.warn("Running in NO FRONTEND MODE");
        noFrontEnd = true;
    }
});








const app = express();
app.use(cors()); 
app.use(express.json());
app.use(express.static(distPath));
app.use('/config-files', configFilesRouter);
app.use('/services-status', serviceStatusRouter);

if(!noFrontEnd){
    app.use((req, res) => {
        res.sendFile(path.join(distPath, 'index.html'));
    });
}

const PORT = 8000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
const express = require('express');
const path = require('path');
const crypto = require('crypto');
const fs = require('fs');
const app = express();

let scanProgress = {
    totalFiles: 0,
    scannedFiles: 0,
    infectedFiles: []
};

const virusSignatures = {
    "e99a18c428cb38d5f260853678922e03": "FakeVirus.A",
    "ab56b4d92b40713acc5af89985d4b786": "FakeVirus.B",
    "d41d8cd98f00b204e9800998ecf8427e": "FakeVirus.C"
};

app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));

function scanDirectory(directory) {
    const fileList = [];
    const walkSync = (dir) => {
        const files = fs.readdirSync(dir);
        files.forEach((file) => {
            const filePath = path.join(dir, file);
            if (fs.statSync(filePath).isDirectory()) {
                walkSync(filePath);
            } else {
                fileList.push(filePath);
            }
        });
    };
    walkSync(directory);
    return fileList;
}

function calculateHash(filePath, algorithm = 'md5') {
    return new Promise((resolve, reject) => {
        const hash = crypto.createHash(algorithm);
        const stream = fs.createReadStream(filePath);

        stream.on('data', (data) => {
            hash.update(data);
        });

        stream.on('end', () => {
            resolve(hash.digest('hex'));
        });

        stream.on('error', (err) => {
            reject(err);
        });
    });
}

async function scanForViruses(fileList) {
    scanProgress.totalFiles = fileList.length;
    scanProgress.scannedFiles = 0;
    scanProgress.infectedFiles = [];

    for (const file of fileList) {
        try {
            console.log(`Scanning file: ${file}`);  
            const fileHash = await calculateHash(file);
            console.log(`File hash: ${fileHash}`);  
            
            if (virusSignatures[fileHash]) {
                console.log(`Infected file: ${file}`);  
                scanProgress.infectedFiles.push({
                    file,
                    virusName: virusSignatures[fileHash]
                });
            }
            scanProgress.scannedFiles += 1;
        } catch (err) {
            console.error(`Error scanning file: ${file}`, err);  
            scanProgress.infectedFiles.push({
                file,
                virusName: `Error: ${err.message}`
            });
        }
        await new Promise(resolve => setTimeout(resolve, 100)); 
    }
}


app.get('/', (req, res) => {
    res.render('index', { results: null });
});

app.post('/scan', async (req, res) => {
    try {
        const rootDirectory = path.join(__dirname, 'testdirectory');  
  
        const fileList = scanDirectory(rootDirectory);
        await scanForViruses(fileList);

        let results = "No viruses found.";
        if (scanProgress.infectedFiles.length > 0) {
            results = "Warning! Infected files found:<br>";
            scanProgress.infectedFiles.forEach(({ file, virusName }) => {
                results += `File: ${file} is infected with ${virusName}<br>`;
            });
        }
        
        res.json({
            success: true,
            threats: scanProgress.infectedFiles.map(item => `File: ${item.file} is infected with ${item.virusName}`)
        });
    } catch (error) {
        console.error('Error during scan:', error);
        res.status(500).json({ success: false, message: 'Scan failed', error: error.message });
    }
});


const PORT = process.env.PORT || 3002; // Set your desired port number

app.listen(PORT, () => {
    console.log(`Server started on http://localhost:${PORT}`);
});

app.get('/progress', (req, res) => {
    res.json(scanProgress);
});


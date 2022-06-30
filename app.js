
// Load requirements 
let ftp = require("basic-ftp");
let formidable = require("formidable");
let http = require("http");
let url = require("url");
let fs = require("fs");

let express = require("express");
let app = express();
// app.set('view engine', 'pug');
// app.set('views', './views');
app.use(express.static('public'));

app.get("/", (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
});

// Serve file upload
app.post("/fileupload", (req, res) => {
    var form = new formidable.IncomingForm();
    
    // Move the file from temporary folder to root folder
    form.parse(req, function (err, fields, files) {
        var oldpath = files.filetoupload.filepath;
        var newpath = __dirname + "/" + files.filetoupload.originalFilename;
        
        fs.rename(oldpath, newpath, function (err) {
            if (err) throw err;
            uploadFilesToFTP(files.filetoupload.originalFilename);
            res.sendFile(__dirname + "/public/fileupload.html");
        });
    });
});

app.listen(8080, () => {});

// Function for uploading a file from server root to FTP server specified by IP
async function uploadFilesToFTP(fileName) {
    const client = new ftp.Client()
    client.ftp.verbose = false;

    try {
        // Access the server
        // !!! WRITE THE CORRECT IP ADDRESS HERE !!!
        await client.access({
            host: "192.168.100.26",
            port: 2221,
            user: "android",
            password: "1234",
            secure: false,
        });
        // Upload the file to FTP server
        await client.uploadFrom(fileName, fileName);
        fs.unlink(fileName, (err) => {
            if (err) throw err;
        });
    }
    
    catch(err) {
        console.log(err);
    }
    client.close();
}

// Load requirements 
let ftp = require("basic-ftp");
let formidable = require("formidable");
let http = require("http");
let url = require("url");
let fs = require("fs");

// Start server
http.createServer(function (req, res){
    // Start uploading files on submit button click
    if (req.url == '/fileupload') {
        var form = new formidable.IncomingForm();

        // Move the file from temporary folder to root folder
        form.parse(req, function (err, fields, files) {
            var oldpath = files.filetoupload.filepath;
            var newpath = __dirname + "/" + files.filetoupload.originalFilename;
            
            fs.rename(oldpath, newpath, function (err) {
                if (err) throw err;
                uploadFilesToFTP(files.filetoupload.originalFilename);
                res.write('Soubor je uspesne na serveru!');
                res.end();
            });
        });
    } else {
        // Parse url
        var q = url.parse(req.url, true);
        // Get name of accessed file
        var filename = "." + q.pathname;
        // Read the accessed file 
        fs.readFile(filename, function(err, data){
        if (err) {
            res.writeHead(404, {'Content-Type': 'text/html'});
            return res.end("404 Not Found");
            } 

        res.writeHead(200, {'Content-Type': 'text/html'});
        // Display the read file (html)
        res.write(data);
        return res.end();
    })}
}).listen(8080);


// Function for uploading a file from server root to FTP server specified by IP
async function uploadFilesToFTP(fileName) {
    const client = new ftp.Client()
    client.ftp.verbose = false;

    try {
        // Access the server
        // !!! WRITE THE CORRECT IP ADDRESS HERE !!!
        await client.access({
            host: "192.168.199.211",
            port: 2221,
            user: "android",
            password: "1234",
            secure: false,
        })
        // Upload the file to FTP server
        await client.uploadFrom(fileName, fileName);
    }
    
    catch(err) {
        console.log(err);
    }
    client.close();
}
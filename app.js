
// Load requirements 
let ftp = require("basic-ftp");
let formidable = require("formidable");
let http = require("http");
let url = require("url");
let fs = require("fs");

// Start server
http.createServer(function (req, res){
    if (req.url == '/fileupload') {
        var form = new formidable.IncomingForm();
        form.parse(req, function (err, fields, files) {
            var oldpath = files.filetoupload.filepath;
            var newpath = __dirname + "/" + files.filetoupload.originalFilename;
            fs.rename(oldpath, newpath, function (err) {
                if (err) throw err;
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
        res.write(data);
        return res.end();
    })}
}).listen(8080);


// example();

// async function example() {
//     const client = new ftp.Client()
//     client.ftp.verbose = true
//     try {
//         await client.access({
//             host: "192.168.12.11",
//             port: 2221,
//             user: "android",
//             password: "1234",
//             secure: false,
//         })
//         console.log(await client.list())
//         await client.uploadFrom("README.md", "README_FTP_TLS.md")
//         await client.downloadTo("README_COPY_TLS.md", "README_FTP_TLS.md")
//     }
//     catch(err) {
//         console.log(err)
//     }
//     client.close()
// }
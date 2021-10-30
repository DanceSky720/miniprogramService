const url = require("url")
const fs = require("fs")

function page(name,res) {
    fs.readFile(__dirname + `../../public/html/${name}.html`, "utf-8", (err, data) => {
            if (err) {
                res.statusCode = 404;
                res.setHeader("Content-Type", "text/plain");
                res.end("Not Found!");
            } else {
                res.statusCode = 200;
                res.setHeader("Content-Type", "text/html");
                res.end(data);
            }
        });
    }

    module.exports={
        page:page,
      
    }
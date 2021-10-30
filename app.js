const express = require("express");
const app = express();
const port = 3000;
const defaultUrl = "http://37104q568t.qicp.vip"
const dbHelp = require("./util/dbHelp")
const fs = require("fs");
const util = require("./util/util");


app.listen(port, () => {
    app.use(express.static("public"));
    console.log(`${defaultUrl}/`)
})

app.get("/", (req, res) => {
    util.page("index", res)
})

app.get('/getavatar', async (req, res) => {
    await dbHelp.getavatar().then(msg => {
        res.json(msg)
        res.end()
    })
})

app.get("/login", async (req, res) => {
    await dbHelp.login(req).then(msg => {
        res.json(msg)
        res.end()
    })
})

app.get("/registerPage", (req, res) => {
    util.page("register", res)
})

app.get("/updateuser", async (req, res) => {
    await dbHelp.updateuser(req).then(msg => {
        res.json(msg)
        res.end()
    })
})

app.get("/emailCheck", async (req, res) => {
    let newEmail;
    await dbHelp.checkEmail(req).then(msg => {
        newEmail = msg
    })
    if (newEmail) {
        res.json({
            state: "该邮箱可以使用"
        })
    } else {
        res.json({
            state: "该邮箱已注册"
        })
    }
    res.end();
})

app.get("/register", async (req, res) => {
    let newEmail;
    await dbHelp.checkEmail(req).then(msg => {
        newEmail = msg
    })
    if (newEmail) {
        await dbHelp.register(req).then(msg => {
            res.json(msg)
        })
    } else {
        res.json({
            state: "该邮箱已注册!"
        })
    }
    res.end()
})



app.get("/createsonglist", async (req, res) => {
    await dbHelp.createsonglist(req).then(msg => {
        res.json(msg)
        res.end()
    })
})

app.get("/listaddmusic", async (req, res) => {
    await dbHelp.addmusic(req).then(msg => {
        res.json(msg)
        res.end()
    })
})
app.get("/getsonglist", async (req, res) => {
    await dbHelp.getsonglist(req).then(msg => {
        res.json(msg)
        res.end()
    })
})

app.get("/deletesonglist", async (req, res) => {

    await dbHelp.deletesonglist(req).then(msg => {
        res.json(msg)
        res.end()
    })
})

app.get("/songlistmusic", async (req, res) => {
    await dbHelp.songlistmusic(req).then(msg => {
        res.json(msg)
        res.end()
    })
})
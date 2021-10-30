const mysql = require("mysql");
const url = require("url");
const defaultUrl = "http://37104q568t.qicp.vip"
const defaultBg = defaultUrl + "/image/default_bg.jpg"
const dfSonglistPic = defaultUrl + "/image/default_songlist.jpeg"
const avatar = defaultUrl + "/image/default_1.png"

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "123456",
    database: "day"
})

db.connect((err) => {
    if (err) throw err;
    console.log("数据库连接成功...");
})

function getavatar(params) {
    return new Promise((resolve, reject) => {
        let sql = "SELECT * FROM avatars"
        query(sql).then(res => {
            resolve(res)
        }).catch(err => {
            reject(err)
        })

    })
}

function login(req) {
    return new Promise((resolve, reject) => {
        let {
            email,
            password
        } = parse(req)
        email = mysql.escape(email)
        password = mysql.escape(password)
        let sql = `SELECT * FROM user WHERE  email=${email} AND password=${password}`
        query(sql).then(res => {
            let data;
            if (res.length > 0) {
                data = res[0]
                data.state = "ok"
            } else {
                data = {
                    state: '账号或密码有误'
                }
            }
            resolve(data)
        }).catch(err => {
            reject(err)
        })
    })
}

function updateuser(req) {
    return new Promise((resolve, reject) => {
        let {
            name,
            email,
            password,
            avatar,
            uid
        } = parse(req)
        name = mysql.escape(name)
        email = mysql.escape(email)
        password = mysql.escape(password)
        avatar = mysql.escape(avatar)
        uid = mysql.escape(uid)

        let sql = `UPDATE USER SET NAME=${name}, PASSWORD=${password}, EMAIL=${email} ,AVATAR=${avatar} WHERE UID=${uid}`

        query(sql).then(res => {
            if (res.affectedRows > 0) {
                resolve({
                    state: "更改成功"
                })
            } else {
                resolve({
                    state: "更改失败"
                })
            }
            resolve(res)
        }).catch(err => {
            reject(err)
        })


    })
}



function checkEmail(req) {
    return new Promise((resolve, reject) => {
        let {
            email
        } = parse(req)
        email = mysql.escape(email)
        let sql = `SELECT email FROM user WHERE email=${email}`
        query(sql).then(res => {
            if (res.length > 0) {
                resolve(false)
            } else {
                resolve(true)
            }
        }).catch(err => {
            reject(err)
        })

    })

}

function register(req) {
    return new Promise((resolve, reject) => {
        let {
            name,
            password,
            email
        } = parse(req)
        name = mysql.escape(name)
        password = mysql.escape(password)
        email = mysql.escape(email)
        let s = [];
        let hexDigits = "0123456789abcdefghijklmnopqrstuvwxyz";
        for (let i = 0; i < 36; i++) {
            s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
        }
        s[14] = "4";
        s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1);
        s[8] = s[13] = s[18] = s[23] = "-";
        let uuid = s.join("");
        let sql = `INSERT INTO user VALUE(null,'${uuid}',${name},${password},${email},'${defaultBg}','${avatar}')`
        query(sql).then(res => {
            if (res.affectedRows > 0) {
                res.state = "注册成功"
            } else {
                res.state = "注册失败"
            }
            resolve(res)
        }).catch(err => {
            reject(err)
        })
    })

}

function createsonglist(req) {
    return new Promise((resolve, reject) => {
        let {
            title,
            uid,
            details
        } = parse(req)
        title = mysql.escape(title)
        uid = mysql.escape(uid)
        details = mysql.escape(details)
        var char = "-";
        let nowDate = null
        if (nowDate == null) {
            nowDate = new Date();
        }
        var day = nowDate.getDate();
        var month = nowDate.getMonth() + 1; //注意月份需要+1
        var year = nowDate.getFullYear();
        //补全0，并拼接
        let createtime = year + char + completeDate(month) + char + completeDate(day);
        let sql = `INSERT INTO songlist VALUE(null,${title},${uid},${details},${createtime},'${dfSonglistPic}',0) `

        query(sql).then(res => {
            if (res.affectedRows > 0) {
                resolve({
                    state: "创建成功"
                })
            } else {
                resolve({
                    state: "创建失败"
                })
            }
        }).catch(err => {
            reject(err)
        })
    })
}

function getsonglist(req) {
    return new Promise((resolve, reject) => {
        let {
            uid
        } = parse(req)
        uid = mysql.escape(uid)
        let sql = `SELECT * FROM songlist WHERE uid= ${uid}`
        query(sql).then(res => {
            resolve(res)
        }).catch(err => {
            reject(err)
        })
    })


}

function addmusic(req) {
    return new Promise((resolve, reject) => {
        let {
            name,
            songid,
            url,
            picurl,
            singer,
            listid
        } = parse(req)

        let sql = ` INSERT INTO music VALUE (null,'${name}','${songid}','${url}','${picurl}','${singer}','${listid}')`
        query(sql).then(res => {
            if (res.affectedRows > 0) {
                resolve({
                    state: "添加成功"
                })
            } else {
                resolve({
                    state: "添加失败"
                })
            }
        }).catch(err => {
            reject(err)
        })
    })
}

function deletesonglist(req) {
    return new Promise((resolve, reject) => {
        let {
            uid,
            cid
        } = parse(req)
        uid = mysql.escape(uid)
        cid = mysql.escape(cid)
        let sql = `DELETE FROM songlist WHERE cid=${cid} and uid=${uid}`
        query(sql).then(res => {
            if (res.affectedRows > 0) {
                resolve({
                    state: "删除成功"
                })
            } else {
                resolve({
                    state: "删除失败"
                })
            }
        }).catch(err => {
            reject(err)
        })
    })

}

function songlistmusic(req) {
    return new Promise((resolve, reject) => {
        let {
            listid
        } = parse(req)
        listid = mysql.escape(listid)
        let sql = `SELECT * FROM music WHERE listid=${listid}`
        query(sql).then(res => {
            resolve(res)
        }).catch(err => {
            reject(err)
        })

    })

}

function completeDate(value) {
    return value < 10 ? "0" + value : value;
}

function query(sql) {
    return new Promise((resolve, reject) => {
        db.query(sql, (err, res) => {
            if (err) {
                console.log("Error on sql = " + sql);
                reject(err)
            } else {
                resolve(res)
            }
        })
    })
}

function parse(req) {
    return url.parse(req.url, true).query
}


module.exports = {
    register: register,
    checkEmail: checkEmail,
    getavatar: getavatar,
    login: login,
    createsonglist: createsonglist,
    addmusic: addmusic,
    getsonglist: getsonglist,
    deletesonglist: deletesonglist,
    songlistmusic: songlistmusic,
    updateuser: updateuser
}
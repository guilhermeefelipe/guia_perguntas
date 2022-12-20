const express = require("express");
const app = express();
const bodyparser = require("body-parser")
const connection = require("./database/database")
const Pergunta = require("./database/Pergunta")
const Resposta = require("./database/Resposta")

connection.authenticate().then(() => {
}).catch((msgerro) => {
    console.log(msgerro)    
})

app.set('view engine','ejs')
app.use(express.static(__dirname + '/public'));
app.use(bodyparser.urlencoded({extended: false}))
app.unlock(bodyparser.json())

app.get("/", (req, res) => {
    Pergunta.findAll({raw: true, order:[
        ["id","DESC"]
    ]}).then(perguntas => {
        console.log(perguntas)
        res.render("index", {
            perguntas: perguntas
        })
    })
    
})

app.get("/perguntar", (req, res) => {
    res.render("perguntar")
})


app.post("/salvarpergunta",(req,res) => {
    Pergunta.create({
        titulo: req.body.titulo,
        descricao: req.body.descricao
    }).then(() => {
        res.redirect("/")
    });
});

app.get("/pergunta/:id", (req, res) => {
    Pergunta.findOne({
        where: {id: req.params.id}
    }).then(pergunta => {
        if(pergunta != undefined){

            Resposta.findAll({
                where: {perguntaId: pergunta.id},
                order: [["id","DESC"]]
            }).then(respostas => {
                res.render("pergunta", {
                    pergunta: pergunta,
                    respostas: respostas
                })
            })
        }else{
            res.redirect("/")
        }
    })
})

app.post("/responder",(req,res) => {
    Resposta.create({
        corpo: req.body.corpo,
        perguntaId: req.body.perguntaId
    }).then(() => {
        res.redirect("/pergunta/" + req.body.perguntaId)
    });
});

app.listen(8080,()=>{
})
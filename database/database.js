const Sequalize = require("sequelize")

const connection = new Sequalize("guiaperguntas", "root", "root", {
    host: "localhost",
    dialect: "mysql"
})

module.exports = connection
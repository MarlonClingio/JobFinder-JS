const express = require("express");
const expressHandlebars = require("express-handlebars")
const app = express();
const path = require('path')
const db = require('./db/connection');
const bodyParser = require('body-parser');
const job = require('./models/Job');
const Sequelize = require('sequelize');
const Op = Sequelize.Op

const PORT = 3000;

app.listen(PORT, function () {
  console.log(`O express está rodando na porta ${PORT}...`);
});

// body parser
app.use(bodyParser.urlencoded({ extended: false }));

// Handle bars
app.set('views', path.join(__dirname, 'views'));
app.engine('handlebars', expressHandlebars.engine({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');

// static folder
app.use(express.static(path.join(__dirname, 'public')))

// DB Connection
db
  .authenticate()
  .then(() => {
    console.log("Conectou ao banco com Sucesso!")
  })
  .catch(err => {
    console.log("Ocorreu um erro ao conectar", err)
  })

// Routes
app.get('/', (req, res) => {

  let search = req.query.job;
  let query = '%' + search + '%'

  if (!search) {
    job.findAll({
      order: [
        ["createdAt", "DESC"]
      ]
    })
      .then(jobs => {
        res.render('index', {
          jobs
        })
      })
      .catch(err => console.log(err))
  } else {
    job.findAll({
      where: { title: { [Op.like]: query } },
      order: [
        ["createdAt", "DESC"]
      ]
    })
      .then(jobs => {
        res.render('index', {
          jobs, search
        })
      })
      .catch(err => console.log(err))
  }
})

// jobs Routers
app.use('/jobs', require('./routes/jobs'))
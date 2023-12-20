const express = require('express');
const router = express.Router();
const job = require('../models/Job');

//Detalhe da vaga
router.get('/view/:id', (req, res) => job.findOne({
  where: { id: req.params.id }
}).then(job => {
  res.render('view', {
    job
  });
}).catch(err => console.log(err))
)


// form da rota de envio
router.get('/add', (req, res) => {
  res.render('add')
})

router.post('/add', (req, res) => {
  let { title, description, salary, company, email, new_job } = req.body;

  //Insert
  job.create({
    title,
    description,
    salary,
    company,
    email,
    new_job
  })
    .then(() => res.redirect('/'))
    .catch(err => console.log(err));
});

module.exports = router
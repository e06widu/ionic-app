const express = require('express')
const cors = require('cors')
const app = express()

const myBudget = require('./data/myBudget.json');
const goals = require('./data/goals.json');
const spendDashboard = require('./data/spendDashboard');
const myTransactions = require('./data/myTransactions');
const setAlert = require('./data/setAlert');
const filter = require('./data/filter');
const myIncome = require('./data/myIncome');
const mySpend = require('./data/mySpend');

app.use(cors())

app.get('/my-budget', (req, res) => {
    res.send(myBudget);
});
app.get('/goals', (req, res) => {
    res.send(goals);
});
app.get('/spend-dashboard', (req, res) => {
    res.send(spendDashboard);
});
app.get('/my-transactions', (req, res) => {
    res.send(myTransactions);
});
app.get('/set-alert', (req, res) => {
    res.send(setAlert);
});
app.get('/filter', (req, res) => {
    res.send(filter);
});
app.get('/myIncome', (req, res) => {
    res.send(myIncome);
});
app.get('/mySpend', (req, res) => {
    res.send(mySpend);
});

app.listen(process.env.PORT || 8080, () => console.log('Server app listening on port 8080!'))

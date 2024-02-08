const express = require('express');
const router = express.Router();

router.get('/', async (req, res) => {
 try {
    const tests = await TestModel.find({});
    res.render('index', { tests: tests });
 } catch (error) {
    res.status(500).send({ error: 'Error fetching data from MongoDB' });
 }
});

module.exports = router;

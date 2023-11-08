const router = require('express').Router();


router.get('/about', (req, res) => {
   
    res.render('index');
});



module.exports = router;    
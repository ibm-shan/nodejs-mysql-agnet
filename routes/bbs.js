const router = require("express").Router(); // api를 router를 이용하여 작성한다. 
const verify = require('../auth/verify-token'); // token  검사 



router.get('/', (req, res) => {
    res.send('good ~~');
});

module.exports = router;
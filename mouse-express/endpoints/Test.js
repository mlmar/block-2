const express = require('express');
const router = express.Router();

/* intercept all urls that start with /test
 */
router.get('/', (req, res) => {
  res.send(respond(0, null, "TEST ROOT"));
})

router.get('/ping', (req, res) => {
  res.send(respond(0, null, "PINGED"));
})

module.exports = router;
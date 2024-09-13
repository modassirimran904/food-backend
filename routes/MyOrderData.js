const express = require('express')
const Order = require('../models/Orders')
const router = express.Router()

router.post('/myOrderData', async (req, res) => {
  
  try {

    //console.log(req.body.email)
    let myData = await Order.findOne({ email: req.body.email })
    res.json({ orderData: myData })
    //console.log("order datin backend me aaya ai ", myData)

  } catch (error) {
    res.send('Error', error.message)
  }
})

module.exports = router

const express = require('express')
const Order = require('../models/Orders')
const router = express.Router()

router.post('/orderData', async (req, res) => {
  let data = req.body.order_data || []
// console.log("order datin backend me aaya ai ", data)
  await data.splice(0, 0, { Order_date: req.body.order_date })

  //if email not exisitng in db then create: else: InsertMany()
  let eId = await Order.findOne({ email: req.body.email })

  if (eId === null) {
    try {
      await Order.create({
        email: req.body.email,
        order_data: [data]
      }).then(() => {
        res.json({ success: true })
      })
    } catch (error) {
      console.log(error.message)
      res.send('Server Error', error.message)
    }
  } else {
    try {
      await Order.findOneAndUpdate(
        { email: req.body.email },
        { $push: { order_data: data } }
      ).then(() => {
        res.json({ success: true })
        
      })
    } catch (error) {
      console.log(error.message)
      res.send('Server Error', error.message)
    }
  }
})
module.exports = router

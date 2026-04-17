const crypto = require('crypto');
const querystring = require('qs');
const moment = require('moment');
const Transaction = require('../models/Transaction');
const Booking = require('../models/Booking');

const vnp_TmnCode = process.env.VNP_TMN_CODE;
const vnp_HashSecret = process.env.VNP_HASH_SECRET;
const vnp_Url = process.env.VNP_URL;
const vnp_ReturnUrl = process.env.VNP_RETURN_URL;

function sortObject(obj) {
  let sorted = {};
  let keys = Object.keys(obj).sort();
  for (let key of keys) {
    sorted[key] = obj[key];
  }
  return sorted;
}

exports.createPayment = async (req, res) => {
  try {
    const { bookingId, amount, orderInfo } = req.body;
    const booking = await Booking.findById(bookingId);
    if (!booking) return res.status(404).json({ error: 'Booking not found' });

    const date = new Date();
    const createDate = moment(date).format('YYYYMMDDHHmmss');
    const orderId = moment(date).format('DDHHmmss') + bookingId.slice(-6);
    const ipAddr = req.headers['x-forwarded-for'] || req.connection.remoteAddress;

    let vnp_Params = {
      vnp_Version: '2.1.0',
      vnp_Command: 'pay',
      vnp_TmnCode: vnp_TmnCode,
      vnp_Locale: 'vn',
      vnp_CurrCode: 'VND',
      vnp_TxnRef: orderId,
      vnp_OrderInfo: orderInfo || `Thanh toan don hang ${orderId}`,
      vnp_OrderType: 'other',
      vnp_Amount: amount * 100,
      vnp_ReturnUrl: vnp_ReturnUrl,
      vnp_IpAddr: ipAddr,
      vnp_CreateDate: createDate,
    };

    vnp_Params = sortObject(vnp_Params);
    let signData = querystring.stringify(vnp_Params, { encode: false });
    let hmac = crypto.createHmac('sha512', vnp_HashSecret);
    let signed = hmac.update(Buffer.from(signData, 'utf-8')).digest('hex');
    vnp_Params['vnp_SecureHash'] = signed;
    const paymentUrl = vnp_Url + '?' + querystring.stringify(vnp_Params, { encode: false });

    await Transaction.create({
      bookingId,
      amount,
      orderInfo,
      paymentMethod: 'vnpay',
      transactionId: orderId,
      status: 'pending'
    });

    res.json({ paymentUrl });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

exports.vnpayReturn = async (req, res) => {
  try {
    let vnp_Params = req.query;
    let secureHash = vnp_Params['vnp_SecureHash'];
    delete vnp_Params['vnp_SecureHash'];
    delete vnp_Params['vnp_SecureHashType'];

    vnp_Params = sortObject(vnp_Params);
    let signData = querystring.stringify(vnp_Params, { encode: false });
    let hmac = crypto.createHmac('sha512', vnp_HashSecret);
    let signed = hmac.update(Buffer.from(signData, 'utf-8')).digest('hex');

    if (secureHash === signed) {
      const orderId = vnp_Params['vnp_TxnRef'];
      const responseCode = vnp_Params['vnp_ResponseCode'];
      const transaction = await Transaction.findOne({ transactionId: orderId });
      if (transaction) {
        transaction.status = responseCode === '00' ? 'success' : 'failed';
        transaction.responseCode = responseCode;
        await transaction.save();
      }
      if (responseCode === '00') {
        const booking = await Booking.findById(transaction.bookingId);
        if (booking) {
          booking.status = 'confirmed';
          booking.paymentStatus = 'paid';
          booking.paymentMethod = 'vnpay';
          await booking.save();
        }
        res.redirect(`${process.env.FRONTEND_URL}/booking/success?bookingId=${transaction.bookingId}`);
      } else {
        res.redirect(`${process.env.FRONTEND_URL}/booking/failed`);
      }
    } else {
      console.error('Chữ ký không hợp lệ', { received: secureHash, computed: signed });
      res.redirect(`${process.env.FRONTEND_URL}/booking/failed`);
    }
  } catch (err) {
    console.error(err);
    res.redirect(`${process.env.FRONTEND_URL}/booking/failed`);
  }
};
// Webhook IPN (nếu cần)
exports.vnpayIpn = async (req, res) => {
  // Tương tự như return, nhưng trả về JSON
};
import Stripe from 'stripe';
import Order from '../models/Order.js';
import Product from '../models/Product.js';
import User from '../models/User.js';
// ------------------------
// STRIPE WEBHOOKS
// ------------------------
export const stripeWebhooks = async (req, res) => {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  switch (event.type) {
    case 'payment_intent.succeeded': {
      const paymentIntent = event.data.object;

      const session = await stripe.checkout.sessions.list({
        payment_intent: paymentIntent.id,
      });
      const { orderId, userId } = session.data[0].metadata;

      await Order.findByIdAndUpdate(orderId, { isPaid: true });
      await User.findByIdAndUpdate(userId, { cartItems: {} });
      break;
    }
    case 'payment_intent.payment_failed': {
      const paymentIntent = event.data.object;
      const session = await stripe.checkout.sessions.list({
        payment_intent: paymentIntent.id,
      });
      const { orderId } = session.data[0].metadata;

      await Order.findByIdAndDelete(orderId);
      break;
    }
  }

  res.json({ received: true });
};
// ------------------------
// PLACE ORDER COD
// ------------------------
export const placeOrderCOD = async (req, res) => {
  try {
    const userId = req.user._id; // từ middleware authUser
    const { items, address } = req.body;

    if (!address || !items || items.length === 0) {
      return res.json({ success: false, message: 'Invalid data' });
    }

    // Tính tổng tiền
    let amount = await items.reduce(async (acc, item) => {
      const product = await Product.findById(item.product);
      return (await acc) + product.offerPrice * item.quantity;
    }, 0);

    amount += Math.floor(amount * 0.02); // 2% tax

    await Order.create({
      userId,
      items,
      address,
      amount,
      paymentType: 'COD',
    });

    return res.json({ success: true, message: 'Order placed successfully' });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

// ------------------------
// PLACE ORDER STRIPE
// ------------------------
export const placeOrderStripe = async (req, res) => {
  try {
    const userId = req.user._id;
    const { items, address } = req.body;
    const { origin } = req.headers;

    if (!address || !items || items.length === 0) {
      return res.json({ success: false, message: 'Invalid data' });
    }

    let productData = [];
    let amount = await items.reduce(async (acc, item) => {
      const product = await Product.findById(item.product);
      productData.push({
        name: product.name,
        price: product.offerPrice,
        quantity: item.quantity,
      });
      return (await acc) + product.offerPrice * item.quantity;
    }, 0);

    amount += Math.floor(amount * 0.02);

    const order = await Order.create({
      userId,
      items,
      address,
      amount,
      paymentType: 'Online',
    });

    const stripeInstance = new Stripe(process.env.STRIPE_SECRET_KEY);

    const line_items = productData.map((item) => ({
      price_data: {
        currency: 'usd',
        product_data: { name: item.name },
        unit_amount: Math.floor(item.price * 100),
      },
      quantity: item.quantity,
    }));

    const session = await stripeInstance.checkout.sessions.create({
      line_items,
      mode: 'payment',
      success_url: `${origin}/loader?next=my-order`,
      cancel_url: `${origin}/cart`,
      metadata: {
        orderId: order._id.toString(),
        userId: userId.toString(),
      },
    });

    return res.json({ success: true, url: session.url });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

// ------------------------
// GET ORDERS BY USER
// ------------------------
export const getUserOrders = async (req, res) => {
  try {
    const userId = req.user._id;
    const orders = await Order.find({ userId, $or: [{ paymentType: 'COD' }, { isPaid: true }] })
      .populate('items.product address')
      .sort({ createdAt: -1 });

    return res.json({ success: true, orders });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

// ------------------------
// GET ALL ORDERS (ADMIN / SELLER)
// ------------------------
export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find({ $or: [{ paymentType: 'COD' }, { isPaid: true }] })
      .populate('items.product address')
      .sort({ createdAt: -1 });

    return res.json({ success: true, orders });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

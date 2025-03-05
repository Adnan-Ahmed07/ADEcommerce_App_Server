import paypal from '@paypal/paypal-server-sdk';

const createTransaction = async (req, res) => {
  const { amount, userId } = req.body;

  // Validate input
  if (!amount || !userId) {
    return res.status(400).json({
      success: false,
      message: "Amount and userId are required",
    });
  }

  try {
    // Configure PayPal environment
    const environment = new paypal.core.SandboxEnvironment(
      process.env.PAYPAL_CLIENT_ID,
      process.env.PAYPAL_CLIENT_SECRET
    );
    const client = new paypal.core.PayPalHttpClient(environment);

    // Create order request
    const request = new paypal.orders.OrdersCreateRequest();
    request.prefer("return=representation");
    request.requestBody({
      intent: 'CAPTURE',
      purchase_units: [{
        amount: {
          currency_code: "USD",
          value: parseFloat(amount).toFixed(2) // Ensure proper format
        },
        reference_id: `REF-${Date.now()}`,
        description: `Transaction for user ${userId}`
      }]
    });

    // Execute request
    const response = await client.execute(request);
    const order = response.result;

    res.status(201).json({
      success: true,
      message: "Transaction created successfully",
      orderId: order.id,
      amount: order.purchase_units[0].amount.value,
      currency: order.purchase_units[0].amount.currency_code,
      status: order.status,
      links: order.links
    });

  } catch (err) {
    console.error('PayPal API Error:', err);
    res.status(500).json({
      success: false,
      message: "Failed to create transaction",
      error: err.message
    });
  }
}
const CreateOrder=async(req,res)=>{
const {paypal_order_id,paypal_payment_id,userId,cartItems,deliveryDate,address}=req.body;
const key_secret=process.env.PAYPAL_KEY_ID;
const generated_signature=crypto.createHmac('sha256',key_secret).update(paypal_order_id+"|"+paypal_payment_id)
.digest('hex')
if(generated_signature===userId){ 
  try{ 
    const transaction =await Transaction.create({  
      user:userId,
      orderId:paypal_order_id,
      paymentId:paypal_payment_id,
      status:'Success',
      amount: cartItems.reduce((total, item) => total + (item?.quantity || 0) * (item?.price || 0), 0),
    });
    const order= await order.create({  
     user:userId,
     address,
     deliveryDate,
     items:cartItems?.map((item)=>({ 
      product:item?._id,
      quantity:item?.quantity,
     })),
     status:'Order Placed',
    });
    transaction.order=order._id;
    await transaction.save()
    res.json({ 
      success:true,
      message:'Paymet Verified',
      order,
    })

  }catch(error){ 
    res.status(500).json({ 
      status:'failed',
      message:'Failed to create transcation or order',
      error,
    });
  }
}
};
const getOrdersByUserId=async(req,res)=>{ 
  const {userId}=req.params;
  try{ 
    const orders=await order.find({ 
      user:userId
    })
     .populate('user','name email')
     .populate('items.product','name price image_uri ar_uri')
     .sort({createdAt:-1});
     if(!orders || orders.length ===0){ 
      return res.status(404).json({  
        success:false,
        message:'No orders found for this user',
      });
     }
     res.status(200).json({ 
      success:true,
      orders,
     })
  }catch(error){  
    res.status(500).json({  
      success:false,
      message:'Failed to Retrieve orders',
      error:err.message,
    });
  }
}
export { createTransaction,CreateOrder, getOrdersByUserId};
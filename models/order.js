import mongoose,{Document,Schema} from 'mongoose';
const ItemSchema =new Schema({ 
  product:{ 
    type:mongoose.Schema.Types.ObjectId,
    ref:'Product',
    required:true,
  },
  quantity:{ 
    type:Number,
    required:true,
  },
});
const orderSchema = new Schema({
  items:[ItemSchema],
  user:{ 
    type:mongoose.Schema.Types.ObjectId,
    ref:'User',
    required:true,
  },
 
  deliveryDate:{ 
    type:Date,
    required:true,
  },
  address:{ 
    type:String,
    
  },
  items:{type:[ItemSchema],required:true},
  status:{ 
    type:String,
    enum:[
      'Order Placed',
      'Shipping',
      'Delivered',
      'Cancelled',
      ],
    default:'Order Placed',
    required:true,
  },
  createdAt:{type:Date,default:Date.now},
  updatedAt:{type:Date,default:Date.now}
});
const Order= mongoose.model('Order',orderSchema);
export default Order;
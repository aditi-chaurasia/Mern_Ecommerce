import React, { useState,useEffect } from 'react';
import Layout from '../components/Layout/Layout';
import { useCart } from '../context/cart';
import { useAuth } from '../context/auth';
import { useNavigate } from 'react-router-dom';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import DropIn from "braintree-web-drop-in-react";
import axios from 'axios';
import toast from 'react-hot-toast';

function CartPage() {
    const [cart, setCart] = useCart(); 
    const [auth, setAuth] = useAuth();
    const[clientToken,setClientToken]=useState("");
    const[instance,setinstance]=useState("")
    const[loading,setLoading]=useState(false)
    const navigate = useNavigate();

    // total price
    const totalPrice = () => {
        try {
            let total = 0;
            cart?.forEach((item) => {
                total += item.price;
            });
            return total.toLocaleString("en-US", {
                style: "currency",
                currency: "USD"
            });
        } catch (error) {
            console.log(error);
            return "$0.00";
        }
    }

    // delete item
    const removeCartItem = (pid) => {
        try {
            let myCart = [...cart];
            let index = myCart.findIndex(item => item._id === pid);
            myCart.splice(index, 1);
            setCart(myCart);
            localStorage.setItem('cart',JSON.stringify(myCart))
        } catch (error) {
            console.log(error);
        }
    }

 //get payment gateway
 const getToken = async() =>{
    try{
        const{data}= await axios.get(`${process.env.REACT_APP_API}/api/product/braintree/token`)
        setClientToken(data?.clientToken)
    }
    catch(error){
        console.log(error)
    }
    
 }
 useEffect(()=>{
    getToken();
 },[auth?.token])

 //handlePayment
const handlePayment = async()=>{
 try{
    setLoading(true)
    const {nonce} = await instance.requestPaymentMethod()
    const {data} = await axios.post(`${process.env.REACT_APP_API}/api/product/braintree/payment`,{
        nonce,cart,
    })
    setLoading(false)
    localStorage.removeItem('cart')
    setCart([])
    navigate('dashboard/user/orders')
    toast.success('Payment sucessfully')
 }
 catch(error)
 {
    console.log(error)
    setLoading(false)
 }
};

    return (
        <Layout>
            <div className="container">
                <div className="row">
                    <div className="col-md-12">
                        <h1 className='text-center bg-light p-2'>
                            {`Hello ${auth?.token && auth?.user?.name}`}
                        </h1>
                        <h4 className='text-center'>
                            {auth?.token ? 
                                (cart.length > 0 ? `You have ${cart.length} items in your cart.` : "Your Cart is empty") : 
                                "Please login to checkout"
                            }
                        </h4>
                    </div>
                </div>
                <div className='row'>
                    <div className='col-md-8'>
                        {
                            cart?.map(p => (
                                <div className='row m-2 flex-row' key={p._id}>
                                    <div className='col-md-4'>
                                        <Card.Img variant="top" src={`${process.env.REACT_APP_API}/api/product/product-photo/${p._id}`} />
                                    </div>
                                    <div className='col-md-8'>
                                        <h4>{p.name}</h4>
                                        <p>{p.description.substring(0, 30)}</p>
                                        <p>Price: ${p.price}</p>
                                        <Button variant="danger" onClick={() => removeCartItem(p._id)}>
                                            REMOVE
                                        </Button>
                                    </div>
                                </div>
                            ))
                        }
                    </div>
                    <div className='col-md-4 text-center'>
                        <h4>Cart Summary</h4>
                        <p>Total | Checkout | Payment</p>
                        <hr />
                        <h4>Total: {totalPrice()}</h4>
                        {auth?.user?.address ?(
                           <>
                           <div className='mb-3'>
                           <h4>Current Address</h4>
                           <h5>{auth?.user?.address}</h5>
                           <Button variant="outline-warning" onClick={() => navigate('/dashboard/user/profile')}>
                                          UPDATE ADDRESS
                            </Button>
                            </div>
                            </>
                        ):(
                            <div className='mb-3'>
                                {
                                    auth?.token ? (
                                        <Button variant="outline-warning"onClick={() => navigate('/dashboard/user/profile')}>Update Address</Button>
                                    ):(
                                        <Button variant="outline-warning"onClick={() => navigate('/login',{state:"/cart",})}>Please login</Button>

                                    )
                                }
                            </div>
                        )
                        }
                        <div className='mt-2'>
                            {
                                !clientToken || !cart?.length ?(""):
                                <>
                                
                                </>
                            }
                            <DropIn 
                            options={
                                {
                                    authorization:clientToken,
                                    paypal:{
                                        flow:'vault'
                                    }
                                }
                            }
                            onInstance={instance =>setinstance(instance)}
                            />
                            <Button variant="primary" onClick={handlePayment} 
                            disabled={!loading ||!instance ||!auth?.user?.address }>
                                         {loading ? "Processing" : "Make Payment"}
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    )
}

export default CartPage;

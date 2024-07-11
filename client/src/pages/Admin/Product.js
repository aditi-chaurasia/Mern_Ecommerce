import React, { useEffect, useState } from 'react';
import AdminMenu from '../../components/Layout/AdminMenu';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/auth';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import {Link} from 'react-router-dom';
import Layout from '../../components/Layout/Layout'




const Product = () => {
    const [products, setProducts] = useState([]);
    const [auth] = useAuth();

    // Fetch all products
    const getAllProducts = async () => {
        try {
            const { data } = await axios.get(`${process.env.REACT_APP_API}/api/product/get-product`,
                {
                    headers: {
                        Authorization: `Bearer ${auth.token}`                    
                    },
                }
            );
            setProducts(data.products);
        } catch (error) {
            toast.error("Something went wrong");
        }
    };

    useEffect(() => {
        getAllProducts();
    }, []); 

    return (
        <Layout title={"Dashboard - Get Product"}>
            <div className='col-md-3'>
           <AdminMenu/>
        </div>
                    <div className='row'>
                        {products?.map((p) => (
                          
                             <div className='col-md-3 mb-4 mr-2 mx-auto'>
                            <Link  key={p._id} to = {`/dashboard/admin/product/${p.slug}`}>
                           
                                <Card style={{ width: '18rem' }}>
                                    <Card.Img variant="top" 
                                    src={`${process.env.REACT_APP_API}/api/product/product-photo/${p._id}`} />
                                    <Card.Body>
                                        <Card.Title>{p.name}</Card.Title>
                                        <Card.Text>{p.description.substring(0,30)}....</Card.Text>
                                        <Button variant="primary">VIEW PRODUCT</Button>
                                    </Card.Body>
                                </Card>
                           
                            </Link> 
                            </div>
                         
                        ))}
                    </div>
        </Layout>
    );
};

export default Product;

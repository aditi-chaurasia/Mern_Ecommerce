import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout/Layout';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';

const ProductDetails = () => {
  const params = useParams();
  const [product, setProduct] = useState({});
  const [relatedProducts, setRelatedProducts] = useState([]);

  useEffect(() => {
    if (params?.slug) {
      getProduct();
    }
  }, [params?.slug]);

  const getProduct = async () => {
    try {
      const { data } = await axios.get(`${process.env.REACT_APP_API}/api/product/get-product/${params.slug}`);
      setProduct(data?.product);
      getSimilarProducts(data?.product?._id, data?.product.category?._id);
    } catch (error) {
      console.log(error);
    }
  };

  const getSimilarProducts = async (pid, cid) => {
    try {
      const { data } = await axios.get(`${process.env.REACT_APP_API}/api/product/related-product/${pid}/${cid}`);
      setRelatedProducts(data?.products);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Layout>
      <div className="container mt-2">
        <div className="row">
          <div className="col-md-6 text-center">
            <Card.Img
              variant="top"
              height="300"
              src={`${process.env.REACT_APP_API}/api/product/product-photo/${product._id}`}
            />
          </div>
          <div className="col-md-6">
            <h1>Product Details</h1>
            <h6>Name: {product.name}</h6>
            <h6>Description: {product.description}</h6>
            <h6>Price: {product.price}</h6>
            <h6>Category: {product.category?.name}</h6>
            <Button variant="primary">ADD TO CART</Button>
          </div>
        </div>
        <div className="row mt-4">
          <h1>Related Products</h1>
          {relatedProducts.length < 1 &&  (<p className='text-center'>No Similar Product Found</p>)}
          <div className="d-flex flex-wrap">
            {relatedProducts?.map((p) => (
              <div className="col-md-3 mb-4">
                <Card style={{ width: '18rem' }}>
                  <Card.Img variant="top" src={`${process.env.REACT_APP_API}/api/product/product-photo/${p?._id}`} />
                  <Card.Body>
                    <Card.Title>{p.name}</Card.Title>
                    <Card.Text>{p.description.substring(0, 30)}</Card.Text>
                    <Card.Text>${p.price}</Card.Text>
                    <Button variant="secondary ms-1">Add to Cart</Button>
                  </Card.Body>
                </Card>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ProductDetails;

import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout/Layout';
import axios from 'axios';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import { Checkbox, Radio } from 'antd';
import { Prices } from '../components/Prices';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/cart';
import toast from 'react-hot-toast';

function HomePage() {
    const [cart, setCart] = useCart();
    const navigate = useNavigate();
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [checked, setChecked] = useState([]);
    const [radio, setRadio] = useState([]);
    const [total, setTotal] = useState(0);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);

    const getAllCategories = async () => {
        try {
            const { data } = await axios.get(`${process.env.REACT_APP_API}/api/category/get-category`);
            if (data?.success) {
                setCategories(data?.category);
            }
        } catch (error) {
            console.log('Error fetching categories:', error);
        }
    };

    const getTotalProducts = async () => {
        try {
            const { data } = await axios.get(`${process.env.REACT_APP_API}/api/product/product-count`);
            setTotal(data?.total);
        } catch (error) {
            console.log('Error fetching total product count:', error);
        }
    };

    const getAllProducts = async () => {
        try {
            setLoading(true);
            const { data } = await axios.get(`${process.env.REACT_APP_API}/api/product/product-list/${page}`);
            setLoading(false);
            setProducts([...products, ...data.products]);
        } catch (error) {
            setLoading(false);
            console.log('Error fetching products:', error);
        }
    };

    const filterProducts = async () => {
        try {
            const { data } = await axios.post(`${process.env.REACT_APP_API}/api/product/product-filters`, {
                checked,
                radio,
            });
            setProducts(data?.products);
        } catch (error) {
            console.log('Error filtering products:', error);
        }
    };

    const handleCategoryFilter = (value, id) => {
        let updatedChecked = [...checked];
        if (value) {
            updatedChecked.push(id);
        } else {
            updatedChecked = updatedChecked.filter((categoryId) => categoryId !== id);
        }
        setChecked(updatedChecked);
    };

    const handlePriceFilter = (e) => {
        setRadio(e.target.value);
    };

    const resetFilters = () => {
        setChecked([]);
        setRadio([]);
        getAllProducts();
    };

    useEffect(() => {
        getAllCategories();
        getTotalProducts();
        getAllProducts();
    }, []);

    useEffect(() => {
        if (page > 1) {
            getAllProducts();
        }
    }, [page]);

    useEffect(() => {
        if (checked.length || radio.length) {
            filterProducts();
        } else {
            getAllProducts();
        }
    }, [checked, radio]);

    return (
        <Layout title="All Products - Best Offers">
            <div className='row mt-3'>
                <div className='col-md-2'>
                    <h4 className="text-center">Filter By Category</h4>
                    <div className="d-flex flex-column">
                        {categories?.map((category) => (
                            <Checkbox
                                key={category._id}
                                onChange={(e) => handleCategoryFilter(e.target.checked, category._id)}
                            >
                                {category.name}
                            </Checkbox>
                        ))}
                    </div>
                    <h4 className="text-center mt-4">Filter By Price</h4>
                    <div className="d-flex flex-column">
                        <Radio.Group onChange={handlePriceFilter}>
                            {Prices?.map((priceRange) => (
                                <Radio key={priceRange._id} value={priceRange.array}>
                                    {priceRange.name}
                                </Radio>
                            ))}
                        </Radio.Group>
                    </div>
                    <div className="d-flex flex-column mt-4">
                        <Button variant="danger" onClick={resetFilters}>
                            RESET FILTERS
                        </Button>
                    </div>
                </div>
                <div className='col-md-9'>
                    <div className='text-center'>
                        <h1 className='text-center'>All Products</h1>
                        <div className='d-flex flex-wrap justify-content-center'>
                            {products?.map((product) => (
                                <div key={product._id} className='col-md-3 mb-4'>
                                    <Card style={{ width: '18rem' }}>
                                        <Card.Img variant="top" src={`${process.env.REACT_APP_API}/api/product/product-photo/${product._id}`} />
                                        <Card.Body>
                                            <Card.Title>{product.name}</Card.Title>
                                            <Card.Text>{product.description.substring(0, 30)}</Card.Text>
                                            <Card.Text>${product.price}</Card.Text>
                                            <Button variant="primary ms-1" onClick={() => navigate(`/product/${product.slug}`)}>
                                                More Details
                                            </Button>
                                            <Button
                                                variant="secondary ms-1"
                                                onClick={() => {
                                                    setCart((prevCart) => {
                                                        const updatedCart = [...prevCart, product];
                                                        localStorage.setItem('cart', JSON.stringify(updatedCart));
                                                        return updatedCart;
                                                    });
                                                    toast.success("Item Added to Cart");
                                                }}
                                            >
                                                Add to Cart
                                            </Button>
                                        </Card.Body>
                                    </Card>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="m-2 p-3">
                        {products && products.length < total && (
                            <Button
                                variant="warning"
                                onClick={() => setPage(page + 1)}
                                disabled={loading}
                            >
                                {loading ? "Loading ..." : "Load More"}
                            </Button>
                        )}
                    </div>
                </div>
            </div>
        </Layout>
    );
}

export default HomePage;

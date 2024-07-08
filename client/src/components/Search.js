import React from 'react'
import Layout from './Layout/Layout'
import { useSearch } from '../context/search';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
function Search() {
    const[values,setValues]=useSearch()
  return (
    <Layout title={'Search results'}>
        <div className="container">
            <div className='text-center'>
                <h1>Search Results</h1>
                <h6>
             {
             (values.results.length < 1 ? 'No product found' : `Found ${values.results.length}`) 
            }
               </h6>
               <div className='d-flex flex-wrap'>
                     {values?.results.map((p) => (
                            <>
                             <div className='col-md-3 mb-4 mr-2 mx-auto'>                           
                                <Card style={{ width: '18rem' }}>
                                    <Card.Img variant="top" 
                                    src={`${process.env.REACT_APP_API}/api/product/product-photo/${p._id}`} />
                                    <Card.Body>
                                        <Card.Title>{p.name}</Card.Title>
                                        <Card.Text>{p.description.substring(0,30)}</Card.Text>
                                        <Card.Text>${p.price}</Card.Text>
                                        <Button variant="primary ms-1">More Details</Button>
                                        <Button variant="secondary ms-1">Add to Cart</Button>
                                    </Card.Body>
                                </Card>
                               </div>
                            </>
                        ))}
            </div>
            </div>
        </div>

    </Layout>
  )
}

export default Search
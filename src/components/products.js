import React from 'react'
import Axios from 'axios'
import { Link } from 'react-router-dom'
import {
    Button, Card, Modal
} from 'react-bootstrap'

class Products extends React.Component{
    constructor(props) {
        super(props)
        this.state = {
            data: []
        }
    }

    componentDidMount() {
        Axios.get("http://localhost:2000/products")
        .then((res) => {
            this.setState({data: res.data})
        })
        .catch((err) => console.log((err)))
    }

    renderModal 
    render() {
        return( 
            <div style={{padding: "50px"}}>
                <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-around'}}>
                    {this.state.data.map((item, index) => {
                        return(
                            <div>
                            <Card key={index} style={{ width: '18rem', marginBottom: '20px', display: 'flex', flexDirection: 'column' }}>
                                <Card.Img variant="top" src={item.img} style={{}} />
                                <Card.Body style={styles.cardBody}>
                                    <Card.Title style={{}}>{item.name}</Card.Title>
                                    <Card.Text style={{}}>Rp{item.price.toLocaleString()}</Card.Text>
                                    <Card.Text style={{}}>Stock: {item.stock}</Card.Text>
                                    <div style={{ display: 'flex', justifyContent: 'space-evenly' }}>
                                        <Button variant="warning" >Add to Wish List</Button>
                                        <Button variant="primary"  as={Link} to={`/detail?id=${item.id}`}>Buy Now</Button>
                                    </div>
                                </Card.Body>
                            </Card>
                            
                            </div>
                        )
                    })}
                </div>
            </div>
        )
    }
}
const styles = {
    cardBody: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
    }
}

export default Products
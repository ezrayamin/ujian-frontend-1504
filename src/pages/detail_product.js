import React from 'react'
import Axios from 'axios'
import { connect } from 'react-redux'
import { Redirect } from 'react-router-dom'
import {
    Image,
    Button,
    Modal,
} from 'react-bootstrap'

class ProductDetails extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            data: {},
            image: '',
            selectedSize: null,
            size: null,
            stock: 0,
            total: 0,
            toLogin: false,
            cartErr: false,
            toCart: false
        }
    }

    componentDidMount() {
        Axios.get(`http://localhost:2000/products${this.props.location.search}`)
            .then((res) => {
                this.setState({ data: res.data[0] })
            })
            .catch((err) => console.log(err))
    }

    handleAddToCart = () => {
        const { total, size, data, stock } = this.state
        if (!this.props.id) return this.setState({ toLogin: true })
        if (total === 0 || size === 0) return this.setState({ cartErr: true })

        let cartData = {
            name: data.name,
            image: data.img,
            price: data.price,
            qty: total,
            stock: data.stock,
            totalPrice: total * data.price
        }
        let tempCart = this.props.cart
        tempCart.push(cartData)

        Axios.patch(`http://localhost:2000/users/${this.props.id}`, { cart: tempCart })
            .then((res) => {
                console.log(res.data)
                this.setState({ toCart: true })
            })
            .catch((err) => console.log(err))
    }

    render() {
        const { data, total, stock, toLogin, toCart, cartErr } = this.state
        if (toLogin) return <Redirect to='/login' />
        if (toCart) return <Redirect to='/cart' />
        console.log(this.props.id)
        console.log(this.props.cart)
        console.log(this)

        return (
            <div style={{ display: 'flex', flexDirection: 'column' }}>
                <div style={{ marginTop: '50px', padding: '0 20px' }}>
                    <div style={{ display: 'flex', height: '100vh' }}>
                        <div style={styles.img1}>
                            <Image src={data.img} rounded style={{ height: '90%', width: '90%' }} />
                        </div>
                        <div style={styles.detail}>
                            <h6 style={{ fontSize: '16px', fontWeight: '600', letterSpacing: '3px', }}>Brand: {data.brand}</h6>
                            <h1 style={styles.name}>{data.name}</h1>
                            <h6 style={{ ...styles.price, textAlign: "center", marginTop: "7px" }}>{data.colour}</h6>
                            <br></br>
                            <b style={styles.price}>Rp{data.price ? data.price.toLocaleString() : false}</b>
                            <br></br>
                            <div style={styles.adjust}>
                                <div style={{ width: '40%' }}>
                                    <h5 style={{ lineHeight: '33px', letterSpacing: '2px' }}>Quantity: </h5>
                                    <div style={{ display: 'flex', backgroundColor: '#ffffff', justifyContent: 'space-between', height: '50%' }}>
                                        <Button
                                            disabled={total <= 0 ? true : false}
                                            onClick={() => this.setState({ total: total - 1 })}
                                            style={{
                                                color: 'black', backgroundColor: 'white', border: '1px solid black', flexBasis: "30%",
                                                borderRadius: '0px', fontSize: '24px'
                                            }}
                                        ><b>-</b></Button>
                                        <h2>{total}</h2>
                                        <Button
                                            disabled={total >= data.stock ? true : false}
                                            onClick={() => this.setState({ total: total + 1 })}
                                            style={{
                                                color: 'black', backgroundColor: 'white', border: '1px solid black', flexBasis: "30%",
                                                borderRadius: '0px', fontSize: '24px'
                                            }}
                                        ><b>+</b></Button>
                                    </div>
                                </div>
                            </div>
                            <br></br>
                            <br></br>
                            <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }}>
                                <Button onClick={this.handleAddToCart} style={{ width: '35vw', height: '7vh', backgroundColor: '#0A9A78' }}>Add to Cart</Button>
                            </div>
                        </div>
                    </div>
                </div>
                <Modal show={cartErr} onHide={() => this.setState({ cartErr: 0 })}>
                    <Modal.Body>Please Select the amount of product you want to buy</Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => this.setState({ cartErr: false })}>
                            Close
                            </Button>
                    </Modal.Footer>
                </Modal>
            </div>
        )
    }
}

const styles = {
    img1: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexBasis: '58%',
        borderRadius: '15px',
    },
    detail: {
        display: 'flex',
        flexDirection: 'column',
        flexBasis: '42%',
        padding: '15px',
        borderRadius: '15px',
        paddingTop: '30px'
    },
    total: {
        display: 'flex',
        alignItems: 'center'
    },
    adjust: {
        display: 'flex',
        flexDirection: 'column'
        // alignItems: 'center'
    },
    size: {
        display: 'flex',
        flexDirection: 'row',
        margin: "0 10px 0 10px",
        alignItems: "center",
        justifyContent: "space-between"
    },
    name: {
        fontSize: '32px',
        fontWeight: '600',
        letterSpacing: '6px',
        lineHeight: '40px',
        borderTop: "1px solid  #E3E3E3",
        borderBottom: "1px solid  #E3E3E3",
        padding: '8px 0 8px 0'
    },
    price: {
        fontSize: '24px',
        fontWeight: '600',
        letterSpacing: '3px',
        lineHeight: '33px',
        color: "#152536"
    },
    ctgr: {
        fontSize: '14px',
        lineHeight: '20px',
        margin: '9px 0 18px 15px',
        color: '#666666',
        textDecoration: 'underline'
    },
    desc: {
        color: '#666666',
        fontSize: '17px',
        fontWeight: '600',
        lineHeight: '20px',
        textDecoration: 'justify',
        width: '70vw'
    }
}
const mapStateToProps = (state) => {
    return {
        email: state.user.email,
    }
}
export default connect(mapStateToProps)(ProductDetails)
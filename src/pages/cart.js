import React from 'react'
import Axios from 'axios'
import { connect } from 'react-redux'
import {Redirect} from 'react-router-dom'
import { login } from '../action'
import {
    Button,
    Form,
    Table,
    Image,
    Modal,
} from 'react-bootstrap'

const url = 'http://localhost:2000/'

class Cart extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            selectedIndex: null,
            products: [],
            newId: '',
            qty: 0,
            newQty: 0,
            reqPay: false,
            errPay: false,
            toHistory: false, 
            reqPass: false,
            errPass: false,
            emptyCart: false
        }
    }

    // componentDidMount() {
    //     Axios.get(`${url}products`)
    //         .then((res) => this.setState({products: res.data}))
    //         .catch((err) => console.log(err))
    // }

    handleDelete = (index) => {
        console.log(index)
        let tempCart = this.props.cart
        tempCart.splice(index, 1)

        Axios.patch(`${url}users/${this.props.id}`, { cart: tempCart })
            .then((res) => {
                console.log(res.data)

                Axios.get(`${url}users/${this.props.id}`)
                    .then((res) => this.props.login(res.data))
                    .catch((err) => console.log(err))
            })
            .catch((err) => console.log(err))
    }

    // handleEdit ada di tabel

    handleMinus = () => {
        this.setState({ newQty: this.state.newQty - 1 })
    }

    handlePlus = () => {
        this.setState({newQty: this.state.newQty + 1 })
    }
    
    changeQty = (e) => {
        this.setState({ newQty: e.target.value })
    }

    handleDone = (index) => {
        let tempProduct = this.props.cart[index]

        tempProduct.qty = parseInt(this.state.newQty)
        tempProduct.size = this.state.newSize
        tempProduct.totalPrice = this.state.newQty * this.props.cart[index].price
        console.log(tempProduct)

        let tempCart = this.props.cart
        
        tempCart.splice(index, 1, tempProduct)
        console.log(tempCart)

        Axios.patch(`http://localhost:2000/users/${this.props.id}`, { cart: tempCart })
            .then((res) => {
                console.log(res.data)
                Axios.get(`http://localhost:2000/users/${this.props.id}`)
                    .then((res) => {
                        this.props.login(res.data)
                        this.setState({ selectedIndex: null })
                    })
                    .catch((err) => console.log(err))
            })
            .catch((err) => console.log(err))
    }

    grandTotal = () => {
        let counter = 0
        this.props.cart.map(item => counter += item.totalPrice)
        return counter
    }

    checkout = () => {
        if (this.props.cart.length === 0) return this.setState({emptyCart: true})
        this.setState({reqPass: true})
    }

    confPay = () => {
        let bayar = this.refs.payment.value
        let jual = this.grandTotal()
        // nominal bayar&harga jual
        if (bayar < jual) return this.setState({errPay: true})

        // siapkan data history
        let history = {
            username: this.props.username,
            date: new Date().toLocaleString(),
            total: jual,
            product: this.props.cart
        }
        console.log(history)

        Axios.post('http://localhost:2000/history', history)
            .then((res) => {
                console.log(res.data)

                Axios.patch(`http://localhost:2000/users/${this.props.id}`, {cart:[]})
                    .then((res) => {
                        console.log(res.data)

                        Axios.get(`http://localhost:2000/users/${this.props.id}`)
                            .then((res) => {
                                console.log(res.data)
                                this.props.login(res.data)
                                this.setState({reqPay: false, toHistory: true})
                            })
                            .catch((err) => console.log(err))
                    })
                    .catch((err) => console.log(err))
            })
            .catch((err) => console.log(err))
    }

    confPass = () => {
        let pass = this.refs.pass.value
        if(pass !== this.props.pass) return this.setState({errPass: true})

        this.setState(
            {reqPay: true, reqPass: false})
    }

    renderTHead = () => {
        return (
            <thead style={{ textAlign: "center" }}>
                <tr>
                    <th>Num</th>
                    <th>Name</th>
                    <th>Image</th>
                    <th>Price</th>
                    <th>Quantity</th>
                    <th>Total</th>
                    <th>Action</th>
                </tr>
            </thead>
        )
    }

    renderTBody = () => {
        return (
            <tbody>
                {this.props.cart.map((item, index) => {
                    if (this.state.selectedIndex === index) {
                        return (
                            <tr key={index}>
                                <td>{index + 1}</td>
                                <td>{item.name}</td>
                                <td style={{ textAlign: "center" }}>
                                    <Image style={{ width: 100, height: 100 }} src={item.image} rounded />
                                </td>
                                <td>Rp {item.price.toLocaleString()}</td>
                                <td>
                                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                                        <Button onClick={this.handleMinus} disabled={this.state.newQty <= 0 ? true : false}>
                                            <i className="fas fa-minus"></i>
                                        </Button>
                                        <Form.Control style={{ width: '100px' }} onChange={(e) => this.changeQty(e)} value={this.state.newQty} min={0} />
                                        <Button disabled={this.state.newQty >= parseInt(item.stock) ? true : false} onClick={this.handlePlus}>
                                            <i className="fas fa-plus"></i>
                                        </Button>
                                    </div>
                                </td>
                                <td style={{textAlign: 'center'}}>Rp {(this.state.newQty * item.price).toLocaleString()}</td>
                                <td style={{ textAlign: "center" }}>
                                    <Button variant='success' onClick={() => this.handleDone(index)} style={{ marginRight: '15px' }}>Done</Button>
                                    <Button variant='danger' onClick={() => this.setState({ selectedIndex: null })}>Cancel</Button>
                                </td>
                            </tr>
                        )
                    }
                    return (
                        <tr key={index}>
                            <td>{index + 1}</td>
                            <td>{item.name}</td>
                            <td style={{ textAlign: "center" }}>
                                <Image style={{ width: 100, height: 100 }} src={item.image} rounded />
                            </td>
                            <td style={{ textAlign: "center" }}>{item.size}</td>
                            <td style={{ textAlign: "center" }}>Rp {item.price.toLocaleString()}</td>
                            <td style={{ textAlign: "center" }}>{item.qty}</td>
                            <td style={{ textAlign: "center" }}>Rp {item.totalPrice.toLocaleString()}</td>
                            <td style={{ textAlign: "center" }}>
                                <Button variant='warning' onClick={() => this.setState({ selectedIndex: index, newQty: item.qty, newSize: item.size, newId: item.id })} style={{ marginRight: '15px' }}>Edit</Button>
                                <Button variant='danger' onClick={() => this.handleDelete(index)}>Delete</Button>
                            </td>
                        </tr>
                    )
                })}
            </tbody>
        )
    }

    render() {
        const {reqPay, errPay, reqPass, errPass, emptyCart, toHistory} = this.state
        // if (toHistory) return <Redirect to='/history' />
        console.log(this.props.cart)
        return (
            <div>
                <h1>Cart</h1>
                <Table>
                {this.renderTHead()}
                {this.renderTBody()}
                </Table>
                <h1>Rp {this.grandTotal().toLocaleString()} </h1>
                <div style={{display: 'flex', alignItems: 'center'}}>
                    <Button onClick={() => this.setState({reqPass: true})}  variant="success">Checkout</Button>
                </div>
                <Modal show={reqPass} onHide={() => this.setState({ reqPass: false })}>
                    <Modal.Header closeButton>
                        <Modal.Title>Confirmation</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form.Control ref="pass" placeholder="Input password to continue your payment"/>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => this.setState({ reqPass: false })}>
                            Close
                        </Button>
                        <Button variant="primary" onClick={this.confPass} >
                            Confirm
                        </Button>
                    </Modal.Footer>
                </Modal>
                <Modal show={errPass} onHide={() => this.setState({ errPass: false })}>
                    <Modal.Header closeButton>
                        <Modal.Title>Wrong Password</Modal.Title>
                    </Modal.Header>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => this.setState({ errPass: false })}>
                            Close
                        </Button>
                    </Modal.Footer>
                </Modal>
                <Modal show={reqPay} onHide={() => this.setState({ reqPay: false })}>
                    <Modal.Header closeButton>
                        <Modal.Title>Billing</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        Total = Rp {this.grandTotal().toLocaleString()}
                        <br></br>
                        <Form.Control ref="payment" placeholder="Please input the amount of money you need to pay"/>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => this.setState({ reqPay: false })}>
                            Close
                        </Button>
                        <Button variant="primary" onClick={this.confPay} >
                            Confirm
                        </Button>
                    </Modal.Footer>
                </Modal>
                <Modal show={errPay} onHide={() => this.setState({ errPay: false })}>
                    <Modal.Header closeButton>
                        <Modal.Title>Error</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>Your bill is Rp {this.grandTotal().toLocaleString()}</Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => this.setState({ errPay: false })}>
                            Close
                        </Button>
                    </Modal.Footer>
                </Modal>
                <Modal show={emptyCart} onHide={() => this.setState({ emptyCart: false })}>
                    <Modal.Header closeButton>
                        <Modal.Title>Cart is empty</Modal.Title>
                    </Modal.Header>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => this.setState({ emptyCart: false })}>
                            Close
                        </Button>
                    </Modal.Footer>
                </Modal>
            </div>
        )
    }
}
const mapStateToProps = (state) => {
    return {
        cart: state.user.cart,
        id: state.user.id,
        email: state.user.email,
        pass: state.user.password
    }
}
export default connect(mapStateToProps, { login })(Cart)
import React from 'react'
import Axios from 'axios'
import { connect } from 'react-redux'
import {Redirect} from 'react-router-dom'
import {
    Accordion,
    Table,
    Image,
    Card,
    Button
} from 'react-bootstrap'

import { getHistory } from '../action'

class History extends React.Component {
    componentDidMount() {
        Axios.get(`http://localhost:2000/history?email=${this.props.email}`)
            .then((res) => {
                console.log(res.data)
                this.props.getHistory(res.data)
            })
            .catch((err) => console.log(err))
    }

    renderIsi = () => {
        return (
            <Accordion>
                {this.props.history.map((item, index) => {
                    return (
                      <Card>
                          <Card.Header>
                          <Accordion.Toggle as={Button} eventKey={index + 1}>
                                Date: {item.date}, Total Purchasing: Rp {item.total.toLocaleString()}
                          </Accordion.Toggle>
                          </Card.Header>
                            <Accordion.Collapse eventKey={index + 1}>
                                <Table>
                                    <thead>
                                    <tr>
                                        <th>Num</th>
                                        <th>Name</th>
                                        <th>Image</th>
                                        <th>Price</th>
                                        <th>Quantity</th>
                                        <th>Total</th>
                                    </tr> 
                                    </thead>
                                    <tbody>
                                        {item.product.map((itemB, indexB) => {
                                            return (
                                                <tr>
                                                    <td>{indexB + 1}</td>
                                                    <td>{itemB.name}</td>
                                                    <td>
                                                        <Image src ={itemB.image} style={{ height: 100, width: 100 }} rounded />
                                                    </td>
                                                    <td>{itemB.price.toLocaleString()}</td>
                                                    <td>{itemB.qty}</td>
                                                    <td> Rp {itemB.totalPrice.toLocaleString()}</td>
                                                </tr>
                                            )
                                        })}
                                    </tbody>
                                </Table>
                            </Accordion.Collapse>
                      </Card>  
                    )
                })}
            </Accordion>
        )
    }

    render() {
        if (!this.props.email) return <Redirect to ='/login'/>
        return (
            <div>
                <h1>Transaction History</h1>
                {this.renderIsi()}
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        history: state.history,
        email: state.user.email
    }
}
export default connect(mapStateToProps, { getHistory })(History)
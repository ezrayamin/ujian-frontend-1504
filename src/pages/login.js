import React from 'react'
import Axios from 'axios'

import {
    InputGroup,
    FormControl,
    Button,
    Form,
    Modal
} from 'react-bootstrap'

import {connect} from 'react-redux'
import {Redirect, Link} from 'react-router-dom'
import {login} from '../action'

const url = 'http://localhost:2000/users'

class Login extends React.Component {
        constructor(props) {
            super(props)
            this.state = {
                eyePassA: false,
                eyePassB: false,
                emailFailed: [false, ""],
                passFailed: [false, ""],
                registerFailed: [false, ""]
            }
        }
        handleRegister = () => {
            const {emailFailed, passFailed} = this.state
            let email = this.refs.email.value
            let password = this.refs.pass.value
    
            if (!email || !password) return this.setState({registerFailed: [true, "Please input each form"]})
            
                Axios.get(`${url}?email=${email}`)
                .then((res) => {
                    console.log(res.data)
                    if (res.data.length !== 0) return this.setState({registerFailed: [true, "an account has already used this email"]})
                    
                    Axios.post('http://localhost:2000/users', {
                        password: password,
                        email: email,
                        cart: []
                    })
                        .then((res) => {
                            console.log(res.data)
                            console.log('Register berhasil')
                            this.setState({registerFailed: [false, ""]})
                            localStorage.id = res.data.id;
                            this.props.login(res.data)
                        })
                        .catch((err) => console.log(err))
                })
                .catch((err) => console.log(err))
        }
    
        emailCheck = (para) => {
            let email = para.target.value
            console.log(email)
            let check = /^(([^<>()\]\\.,;:\s@"]+(\.[^<>()\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        
            if (!check.test(email)) return this.setState({emailFailed: [true, "email is not valid"]})
            this.setState({emailFailed:[false, ""]})
        }
    
        passCheck = (para) => {
            let pass = para.target.value
            let symb = /[!@#$%^&*():;"'<>?,.|{[}]/
            let numb = /[0-9]/
    
            if (!symb.test(pass) || !numb.test(pass) || pass.length < 6) return this.setState({ passFailed: [true, "*Must include symbol, number, min 6 char"] })
            this.setState({passFailed: [false, ""]})
        }
    
        render() {
            const {eyePassA, eyePassB, emailFailed, passFailed, registerFailed} = this.state
    
            if (this.props.email) return <Redirect to = '/'/>
            return  (
                <div style={styles.container}>
                    <div style= {styles.center}>
                        <div>
                            <h1>Register</h1>
                        </div>
                        <div style= {{...styles.item, textAlign:"center"}}>
                            <InputGroup>
                                <InputGroup.Prepend>
                                    <InputGroup.Text id="basic-addon1" style={{ width: "45px", display: 'flex', justifyContent: 'center' }}>
                                        <i className="fas fa-envelope" />
                                    </InputGroup.Text>
                                </InputGroup.Prepend>
                                <FormControl
                                    placeholder="Email"
                                    aria-label="Email"
                                    aria-describedby="basic-addon1"
                                    style={{ height: "45px" }}
                                    ref="email"
                                    onChange={(para) => this.emailCheck(para)}
                                />
                            </InputGroup>
                            <Form.Text className="mb-3" style={{ textAlign: "left", color: "red", fontSize: '10px' }}>
                                {emailFailed[1]}
                            </Form.Text>
                            <InputGroup className="mb-3">
                                <InputGroup.Prepend style={{ cursor: 'pointer' }}
                                    onClick={() => this.setState({eyePassA : !eyePassA})}>
                                    <InputGroup.Text id="basic-addon1" style={{ width: "45px", display: 'flex', justifyContent: 'center' }}>
                                        <i className={eyePassA ? "fas fa-eye" : "fas fa-eye-slash"}></i>
                                    </InputGroup.Text>
                                </InputGroup.Prepend>
                                <FormControl
                                    placeholder="Password"
                                    aria-label="Password"
                                    aria-describedby="basic-addon1"
                                    style={{ height: "45px" }}
                                    type={eyePassA ? "text" : "password"}
                                    ref="pass"
                                    onChange={(para) => this.passCheck(para)}
                                />
                            </InputGroup>
                            <Form.Text className="mb-3" style={{ textAlign: "left", color: "red", fontSize: '10px' }}>
                                {passFailed[1]}
                            </Form.Text>
                            <Button onClick={this.handleRegister}>
                                Log include <i className="fas fa-user-plus" style={{ marginLeft: '15px' }}></i>
                            </Button>
                        </div>
                        <Modal show={registerFailed[0]} onHide={() => this.setState({ registerFailed: [false, ""] })}>
                            <Modal.Header closeButton>
                                <Modal.Title>Error</Modal.Title>
                            </Modal.Header>
                            <Modal.Body>{registerFailed[1]}</Modal.Body>
                            <Modal.Footer>
                                <Button variant="secondary" onClick={() => this.setState({ registerFailed: [false, ""] })}>
                                    Okay
                                </Button>
                            </Modal.Footer>
                        </Modal>
                    </div>
                </div>
            )
        }
    }
const styles = {
    container: {
        display: 'flex',
        justifyContent: 'center',
        backgroundSize: 'cover'
    },
    center: {
        marginTop: '100px',
        padding: '10px 30px',
        width: '350px',
        height: '50vh',
        backgroundColor: 'rgba(255, 255, 255, .5)'
    }
}

const mapStateToProps = (state) => {
    return {
        email: state.user.email
    }
}
export default connect (mapStateToProps, {login}) (Login)
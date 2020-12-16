import React from 'react'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import {
    Navbar,
    Nav,
    Dropdown
} from 'react-bootstrap'

// import action logout
import { logout } from '../action'

class Navigation extends React.Component {
    handleLogout = () => {
        localStorage.removeItem('id')
        this.props.logout()
    }

    render() {
        return (
            <Navbar expand="lg" fixed='top' style={{ height: '70px', backgroundColor: 'rgba(43, 104, 213, .7)' }}>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="mr-auto">
                        <Nav.Link as={Link} to='/' style={{ color: 'white' }}>Home</Nav.Link>
                    </Nav>
                    <Nav className="mr-auto">
                        <Nav.Link style={{ color: 'white' }} as={Link} to='/cart'>Cart</Nav.Link>
                    </Nav>
                    <Dropdown style={{ marginRight: '40px' }}>
                        <Dropdown.Toggle variant="success" id="dropdown-basic">
                            {this.props.email || "account"}
                        </Dropdown.Toggle>
                        <Dropdown.Menu>
                            {this.props.email
                                ?
                                <>
                                    <Dropdown.item>Transactions</Dropdown.item>
                                    <Dropdown.Item onClick={this.handleLogout}>Logout</Dropdown.Item>
                                </>
                                :
                                <>
                                    <Dropdown.Item as={Link} to='/login' >Login</Dropdown.Item>
                                   
                                </>
                            }
                        </Dropdown.Menu>
                    </Dropdown>
                </Navbar.Collapse>
            </Navbar>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        email: state.user.email
    }
}

export default connect(mapStateToProps, { logout })(Navigation)
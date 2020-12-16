import React from 'react'
import Axios from 'axios'
import {connect} from 'react-redux'
import {
Route, Switch
} from 'react-router-dom'


import Navigation from './components/navigation'
import Home from './pages/home'
import Login from './pages/login'
import ProductDetails from './pages/detail_product'
import Cart from './pages/cart'
import History from './pages/history' 

import {login, getHistory} from './action'

const url = 'http://localhost:2000/'

class App extends React.Component {
    componentDidMount() {
        Axios.get(`${url}users/${localStorage.id}`)
        .then((res) => {
            console.log(res.data);
            this.props.login(res.data)

            // menyimpan get history
            Axios.get(`${url}history?email=${this.props.email}`)
            .then((res) => {
                console.log(res.data)
                this.props.getHistory(res.data)
            })
            .catch((err) => console.log(err))
        })
        .catch((err) => console.log(err))
    }

    render() {
        return (
            <div>
                <Navigation/>
                <Switch>
                    <Route path = '/' component={Home} exact/>
                    <Route path = '/login' component={Login}/>
                    <Route path = '/detail' component={ProductDetails}/>
                    <Route path = '/cart' component={Cart}/>
                    <Route path = '/history' component={History} /> 
                </Switch>
            </div>
        )
    }
}
const mapStateToProps = (state) => {
    return {
        email: state.user.email
    }
}
export default connect(mapStateToProps, {login, getHistory}) (App)
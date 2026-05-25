import React, { Component } from 'react'
import { Button, Container, Col, Row } from 'reactstrap';

//import './css/Landing.css';
import LoginForm from '../forms/LoginForm';

class Landing extends Component {
    render() {
        return (
            <Container fluid>
                <div className="auth-area">
                    <h2>Find some new partner here</h2>
                    <div className="login-block">
                        <h4>Join mydating now</h4>
                        <LoginForm/>
                    </div>
                </div>
                <Row>
                    <Col>
                        <p className="text-center m-3">Powered by vevi studio</p>
                    </Col>
                </Row>
            </Container>
        )
    }
}
export default Landing;
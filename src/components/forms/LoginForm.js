import React, { Component } from 'react'
import TextField from '../common/TextField';
import {withRouter} from 'react-router-dom';
import { loginValidator } from '../common/Validator';
import { Button, FormGroup, Form, Label, Input } from 'reactstrap';
import PropTypes from 'prop-types';

class LoginForm extends Component {
    constructor(props) {
        super(props);
        
        this.state = {
            username: '',
            count: 0
        }

        this.onChange = this.onChange.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
    }

    onChange = (e)=> {
        this.setState({
            [e.target.name] : e.target.value
        });
    }

    onSubmit = (e)=> {
        e.preventDefault();
        if (this.isValid()) {
           this.props.history.push('/home');
        }
    }

    isValid = ()=> {
        let {errors, isValid} = loginValidator(this.state);

        return isValid;
    }

    render() {
        let { username } = this.state;
        return (
            <React.Fragment>
                <Form className="login-form" onSubmit={this.onSubmit}>
                    <FormGroup>
                        <Label className="form-label-text">Username</Label>
                        <Input type="text"
                            name="username"
                            placeholder="Enter Username"
                            onChange={this.onChange}/>
                        <Label className="form-label-text">Password</Label>
                        <Input type="password"
                            name="password"
                            placeholder="Enter Password"
                            onChange={this.onChange}/>
                    </FormGroup>
                    <Button className= "btn-login-block" color="primary">Login</Button>
                    <div className="text-center">
                        <a href="#">Sign Up</a>
                        <span className="p-2">|</span>
                        <a href="#">Forgot Password</a>
                    </div>
                </Form>
            </React.Fragment>
        )
    }
}

LoginForm.proptypes = {
    username: PropTypes.string.isRequired
}

export default withRouter(LoginForm);
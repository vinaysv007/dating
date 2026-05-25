import React from 'react';
import PropTypes from 'prop-types';

const TextField = (props) => {
    return (
        <React.Fragment>
            <input type={props.type}
            name={props.name}
            value={props.value}
            onChange={props.onChange} />
        </React.Fragment>
    )
}

TextField.proptypes = {
    type: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired
}

TextField.defaultProps = {
    type: 'text'
}

export default TextField;
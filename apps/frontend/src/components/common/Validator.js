import validator from 'validator';
import isEmpty from 'lodash/isEmpty'

export const loginValidator = (data) => {

    let errors = {}
    if (validator.isEmpty(data.username)) {
        errors.username = 'This field is mandatory';
    }

    return {
        errors,
        isValid: isEmpty(errors)
    }
}
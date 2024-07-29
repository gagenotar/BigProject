function validPassword(password) {
    const pattern = /(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*]).{8,}/

    if (pattern.test(password)) {
        console.log('Password adheres to all requirements')
        return true
    }

    return false;
}

function invalidPassword(password) {
    const tempPattern = /(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*]).{8,}/

    let pattern = /(?=.*[A-Z])/
    if (!pattern.test(password))
        console.log('Password does not contain an uppercase character')

    pattern = /(?=.*[a-z])/
    if (!pattern.test(password))
        console.log('Password does not contain a lowercase character')

    pattern = /(?=.*\d)/
    if (!pattern.test(password))
        console.log('Password does not contain a digit')

    pattern = /(?=.*[!@#$%^&*])/
    if (!pattern.test(password))
        console.log('Password does not contain a special character (!@#$%^&*)')

    pattern = /.{8,}/
    if (!pattern.test(password))
        console.log('Password is less than 8 characters long)')

    pattern = /(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*]).{8,}/
    return pattern.test(password);
}

module.exports = { validPassword, invalidPassword }
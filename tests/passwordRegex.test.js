const passwordRegex = require('./passwordRegex.js')

test('Password does not adhere to any of the standards', () => {
    password = ''
    expect(passwordRegex.invalidPassword(password)).toBeFalsy()
})

test('Testing a valid password', () => {
    password = 'Password123$'
    expect(passwordRegex.validPassword(password)).toBeTruthy()
})
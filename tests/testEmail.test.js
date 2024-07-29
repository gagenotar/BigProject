const testEmail = require('./testEmail.js')
require('dotenv').config()

test('Tests if an email is sent correctly using proper credentials', async () => {
    const user = process.env.EMAIL_USER
    const pass = process.env.EMAIL_PASSWORD
    await expect(testEmail.sendEmail(user, pass)).resolves.toMatch(/OK/)
})

test('Tests if an email is sent correctly using improper credentials', async () => {
    const user = ''
    const pass = ''
    await expect(testEmail.sendEmail(user, pass)).rejects.toThrow()
})
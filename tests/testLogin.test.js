const bcrypt = require('bcrypt');
const User = require('../models/User.js');
const { login } = require('./testLogin.js'); // Adjust the path as necessary
const { generateTokens } = require('../utils/tokenUtils.js');

jest.mock('bcrypt');
jest.mock('../models/User.js');
jest.mock('../utils/tokenUtils.js');

describe('Login function', () => {
  // Suppress console.error during tests
  beforeAll(() => {
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterAll(() => {
    console.error.mockRestore();
  });

  it('should reject with an error if email or username is invalid', async () => {
    console.log('Testing login with invalid email or username');
    User.findOne.mockResolvedValue(null);

    await expect(login('invalidUser', 'password123')).rejects.toThrow('Invalid email or username');
    console.log('Finished testing login with invalid email or username');
  });

  it('should reject with an error if email is not verified', async () => {
    console.log('Testing login with unverified email');
    const mockUser = { isVerified: false };
    User.findOne.mockResolvedValue(mockUser);

    await expect(login('testuser', 'password123')).rejects.toThrow('Email not verified. Please check your email for the verification code.');
    console.log('Finished testing login with unverified email');
  });

  it('should reject with an error if password is invalid', async () => {
    console.log('Testing login with invalid password');
    const mockUser = { isVerified: true, password: 'hashedpassword' };
    User.findOne.mockResolvedValue(mockUser);
    bcrypt.compare.mockResolvedValue(false);

    await expect(login('testuser', 'invalidpassword')).rejects.toThrow('Invalid password');
    console.log('Finished testing login with invalid password');
  });

  it('should resolve with tokens if login is successful', async () => {
    console.log('Testing successful login');
    const mockUser = { _id: '12345', isVerified: true, password: 'hashedpassword' };
    User.findOne.mockResolvedValue(mockUser);
    bcrypt.compare.mockResolvedValue(true);
    generateTokens.mockReturnValue({ accessToken: 'access-token', refreshToken: 'refresh-token' });

    await expect(login('testuser', 'password123')).resolves.toEqual({ accessToken: 'access-token', refreshToken: 'refresh-token', id: '12345' });
    console.log('Finished testing successful login');
  });

  it('should reject with an error if there is a server error', async () => {
    console.log('Testing login with server error');
    User.findOne.mockRejectedValue(new Error('Server error'));

    await expect(login('testuser', 'password123')).rejects.toThrow('Server error');
    console.log('Finished testing login with server error');
  });
});

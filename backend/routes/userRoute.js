import express from 'express';
import { loginValidation, registerValidation, changePasswordValidation } from '../validation/validation.js';
import { handleValidationErrors } from '../validation/handleValidationErrors.js';
import { Login, Register, getMe, getUsers, updateUser, changePassword, getSecurityInfo } from '../controllers/userController.js';
import { checkAuth } from '../validation/checkAuth.js';

const userrouter = express.Router();

userrouter.post('/register', registerValidation, handleValidationErrors, Register);
userrouter.post('/login', loginValidation, handleValidationErrors, Login);
userrouter.get('/me', checkAuth, getMe);
userrouter.get('/allusers', checkAuth, getUsers);
userrouter.patch('/:id', checkAuth, updateUser);
userrouter.post('/:id/change-password', checkAuth, changePasswordValidation, handleValidationErrors, changePassword);
userrouter.get('/security-info', checkAuth, getSecurityInfo);

export default userrouter;
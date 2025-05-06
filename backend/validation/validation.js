import {body} from 'express-validator';

export const registerValidation = [
    body('email', 'Error email format').isEmail(),
    body('password', 'Password min 6 symbols').isLength({min:6}),
    body('name', 'Name min 3 symbols').isLength({min: 3}),
    body('avatarUrl', "error image link").optional().isURL(),
];

export const loginValidation = [
    body('email', 'Error email format').isEmail(),
    body('password', 'Password min 6 symbols').isLength({min: 6}),
];

export const changePasswordValidation = [
    body('currentPassword', 'Текущий пароль обязателен').exists(),
    body('newPassword', 'Новый пароль должен быть минимум 8 символов').isLength({min: 8}),
];
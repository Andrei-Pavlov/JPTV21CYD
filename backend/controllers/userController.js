import Users from "../models/user.js";
import LoginHistory from "../models/loginHistory.js";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export const Login = async (req, res) => {
    try {
        const users = await Users.findAll({
            where: {
                email: req.body.email,
            },
            attributes: ['id', 'name', 'email', 'password', 'role', 'avatar', 'about', 'createdAt', 'lastPasswordChange']
        });

        if (!users || users.length === 0) {
            // Записываем неудачную попытку входа
            await LoginHistory.create({
                userId: null,
                device: req.headers['user-agent'] || 'Unknown Device',
                location: 'Unknown',
                status: 'Неудачно',
                ipAddress: req.ip
            });
            return res.status(404).json({msg: "Пользователь с таким email не найден"});
        }

        const user = users[0];
        const isValidPass = await bcrypt.compare(req.body.password, user.password);
        if (!isValidPass) {
            // Записываем неудачную попытку входа
            await LoginHistory.create({
                userId: user.id,
                device: req.headers['user-agent'] || 'Unknown Device',
                location: 'Unknown',
                status: 'Неудачно',
                ipAddress: req.ip
            });
            return res.status(400).json({msg: 'Неверный пароль'});
        }

        // Проверяем, является ли вход с нового устройства
        const previousLogins = await LoginHistory.findAll({
            where: {
                userId: user.id,
                device: req.headers['user-agent'] || 'Unknown Device'
            }
        });

        const loginStatus = previousLogins.length === 0 ? 'Подозрительно' : 'Успешно';

        // Записываем успешный вход
        await LoginHistory.create({
            userId: user.id,
            device: req.headers['user-agent'] || 'Unknown Device',
            location: 'Unknown', // В реальном приложении здесь можно использовать геолокацию
            status: loginStatus,
            ipAddress: req.ip
        });

        const token = jwt.sign({
            userId: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            avatar: user.avatar,
            about: user.about,
            createdAt: user.createdAt,
            lastPasswordChange: user.lastPasswordChange
        }, 'secretword123', {
            expiresIn: '30d',
        });

        res.cookie('token', token, {httpOnly: true, maxAge: 24 * 60 * 60 * 1000});

        res.json({
            userId: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            avatar: user.avatar,
            about: user.about,
            createdAt: user.createdAt,
            lastPasswordChange: user.lastPasswordChange,
            token
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({msg: "Ошибка сервера при попытке входа. Пожалуйста, попробуйте позже."});
    }
};

export const getMe = async (req, res) => {
    try {
        const user = await Users.findAll({
            where: {
                id: req.userId,
            },
        });
        if (!user) {
            return res.status(404).json({
                message: 'user not found',
            });
        }
        const userId = user[0].id;
        const name = user[0].name;
        const email = user[0].email;
        const role = user[0].role;
        const avatar = user[0].avatarUrl;
        const about = user[0].about;
        const createdAt = user[0].createdAt;
        
        res.json({userId, name, email, role, avatar, about, createdAt});
    }   catch (err) {
        return res.status(403).json({
            message: "no access query"
        })
    }
};


export const Register = async (req, res) => {
    try {
        const { name, email, password, confPassword, avatarUrl} = req.body;

        if (password !== confPassword) {
            return res.status(400).json({msg: "password and confirm password do not match"});
        }
        const salt = await bcrypt.genSalt();
        const hashPassword = await bcrypt.hash(password, salt);

        await Users.create({
            name: name,
            email: email,
            password: hashPassword,
            avatarUrl: avatarUrl,
        }).then((response) => {
            const userid = response.id;
            const token = jwt.sign({id: userid}, 'secretword123', {
                expiresIn: '30d',
            });

            res.json({userid, token});
        });
    }   catch (error) {
        console.log(error);
    }
};

export const getUsers = async (req, res) => {
    try {
        const users = await Users.findAll({
            attributes: ['id', 'name', 'email', 'role'],
        });
        res.json(users);
    }   catch (error) {
        console.log(error);
    }
};

export const updateUser = async (req, res) => {
    const { id } = req.params;
    const { name, password, avatarUrl, about } = req.body;

    try {
        const user = await Users.findByPk(id);
        if (!user) return res.status(404).json({ msg: "User not found" });

        if (name) user.name = name;
        if (password) user.password = await bcrypt.hash(password, await bcrypt.genSalt());
        if (avatarUrl) user.avatar = avatarUrl;
        if (about !== undefined) user.about = about;

        await user.save();

        const token = jwt.sign(
            { 
                userId: user.id, 
                name: user.name, 
                email: user.email, 
                role: user.role, 
                avatar: user.avatar,
                about: user.about,
                createdAt: user.createdAt
            },
            'secretword123',
            { expiresIn: '30d' }
        );

        res.json({ 
            userId: user.id, 
            name: user.name, 
            email: user.email, 
            role: user.role, 
            avatar: user.avatar,
            about: user.about,
            createdAt: user.createdAt,
            token 
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: "Server error" });
    }
};

export const changePassword = async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;
        const userId = req.userId;

        // Находим пользователя
        const user = await Users.findByPk(userId);
        if (!user) {
            return res.status(404).json({ msg: "Пользователь не найден" });
        }

        // Проверяем текущий пароль
        const isValidPass = await bcrypt.compare(currentPassword, user.password);
        if (!isValidPass) {
            return res.status(400).json({ msg: "Неверный текущий пароль" });
        }

        // Хешируем и сохраняем новый пароль
        const salt = await bcrypt.genSalt();
        const hashPassword = await bcrypt.hash(newPassword, salt);
        
        // Обновляем пароль и время последнего изменения
        await user.update({
            password: hashPassword,
            lastPasswordChange: new Date()
        });

        res.json({ 
            msg: "Пароль успешно изменен",
            lastPasswordChange: user.lastPasswordChange
        });
    } catch (error) {
        console.error('Ошибка при смене пароля:', error);
        res.status(500).json({ msg: "Ошибка сервера при смене пароля" });
    }
};

export const getSecurityInfo = async (req, res) => {
    try {
        const userId = req.userId;
        
        // Находим пользователя со всеми необходимыми полями
        const user = await Users.findOne({
            where: { id: userId },
            attributes: ['id', 'lastPasswordChange']
        });
        
        if (!user) {
            return res.status(404).json({ msg: "Пользователь не найден" });
        }

        // Получаем историю входов
        const loginHistory = await LoginHistory.findAll({
            where: { userId: userId },
            order: [['date', 'DESC']],
            limit: 10
        });

        // Проверяем наличие подозрительной активности
        const suspiciousActivity = loginHistory.some(entry => entry.status === 'Подозрительно');

        res.json({
            lastPasswordChange: user.lastPasswordChange,
            loginHistory: loginHistory,
            twoFactorEnabled: false,
            suspiciousActivity: suspiciousActivity
        });
    } catch (error) {
        console.error('Ошибка при получении информации о безопасности:', error);
        res.status(500).json({ msg: "Ошибка сервера при получении информации о безопасности" });
    }
};


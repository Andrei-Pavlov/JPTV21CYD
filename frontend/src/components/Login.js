import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext.js'; // Используем хук
import { Button, Card, Col, Container, Form, Row, Tabs, Tab, Alert } from 'react-bootstrap';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [msg, setMsg] = useState('');
  const [name, setName] = useState('');
  const [confPassword, setConfPassword] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [activeTab, setActiveTab] = useState('login');
  const navigate = useNavigate();
  const { login } = useAuth(); // Получаем функцию login из контекста

  const Auth = async (e) => {
    e.preventDefault();
    try {
      console.log('Attempting login with:', { email, password });
      
      const response = await axios.post('http://localhost:5000/users/login', {
        email: email,
        password: password
      });
      
      console.log('Login response:', response.data);
      
      if (response.data && response.data.token) {
        localStorage.setItem('token', response.data.token);
        
        // Сохраняем полные данные пользователя
        const userData = {
          userId: response.data.userId,
          name: response.data.name,
          email: response.data.email,
          role: response.data.role,
          avatar: response.data.avatar,
          about: response.data.about,
          createdAt: response.data.createdAt
        };
        
        console.log('Saving user data:', userData);
        localStorage.setItem('user', JSON.stringify(userData));
        
        await login(response.data.token);
        navigate('/');
      } else {
        setMsg('Ошибка входа: токен не получен');
      }
    } catch (error) {
      console.error('Ошибка входа:', error);
      if (error.response && error.response.data && error.response.data.msg) {
        setMsg(error.response.data.msg);
      } else {
        setMsg('Ошибка сервера при попытке входа');
      }
    }
  };

  const Register = async (e) => {
    e.preventDefault();
    try {
      if (password !== confPassword) {
        setMsg('Пароли не совпадают');
        return;
      }

      const response = await axios.post('http://localhost:5001/users/register', {
        name,
        email,
        password,
        confPassword,
        avatarUrl: avatarUrl || 'default-avatar.png'
      });

      if (response.data && response.data.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data));
        await login(response.data.token);
        navigate('/');
      } else {
        setMsg('Ошибка регистрации: токен не получен');
      }
    } catch (error) {
      console.error('Ошибка регистрации:', error);
      if (error.response && error.response.data && error.response.data.msg) {
        setMsg(error.response.data.msg);
      } else {
        setMsg('Ошибка сервера при регистрации');
      }
    }
  };

  return (
    <Container className="mt-5">
      <Row className="justify-content-center">
        <Col md={6}>
          <Card>
            <Card.Body>
              {msg && <Alert variant="danger">{msg}</Alert>}
              <Tabs
                activeKey={activeTab}
                onSelect={(k) => {
                  setActiveTab(k);
                  setMsg(''); // Очищаем сообщение об ошибке при переключении вкладок
                }}
                className="mb-3"
              >
                <Tab eventKey="login" title="Вход">
                  <Form onSubmit={Auth}>
                    <Form.Group className="mb-3">
                      <Form.Label>Email</Form.Label>
                      <Form.Control
                        type="email"
                        placeholder="Введите email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                    </Form.Group>

                    <Form.Group className="mb-3">
                      <Form.Label>Пароль</Form.Label>
                      <Form.Control
                        type="password"
                        placeholder="Введите пароль"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                      />
                    </Form.Group>

                    <Button variant="primary" type="submit" className="w-100">
                      Войти
                    </Button>
                  </Form>
                </Tab>

                <Tab eventKey="register" title="Регистрация">
                  <Form onSubmit={Register}>
                    <Form.Group className="mb-3">
                      <Form.Label>Имя</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Введите имя"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                      />
                    </Form.Group>

                    <Form.Group className="mb-3">
                      <Form.Label>Email</Form.Label>
                      <Form.Control
                        type="email"
                        placeholder="Введите email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                    </Form.Group>

                    <Form.Group className="mb-3">
                      <Form.Label>Пароль</Form.Label>
                      <Form.Control
                        type="password"
                        placeholder="Введите пароль"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                      />
                    </Form.Group>

                    <Form.Group className="mb-3">
                      <Form.Label>Подтверждение пароля</Form.Label>
                      <Form.Control
                        type="password"
                        placeholder="Подтвердите пароль"
                        value={confPassword}
                        onChange={(e) => setConfPassword(e.target.value)}
                        required
                      />
                    </Form.Group>

                    <Form.Group className="mb-3">
                      <Form.Label>URL аватара (необязательно)</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Введите URL изображения"
                        value={avatarUrl}
                        onChange={(e) => setAvatarUrl(e.target.value)}
                      />
                    </Form.Group>

                    <Button variant="primary" type="submit" className="w-100">
                      Зарегистрироваться
                    </Button>
                  </Form>
                </Tab>
              </Tabs>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

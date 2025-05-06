import React, { useState, useEffect } from 'react';
import { Container, Card, Table, Alert, Button, Form, Modal } from 'react-bootstrap';
import { useAuth } from './AuthContext';
import axios from 'axios';
import { jwtDecode } from "jwt-decode";
import './Security.css';

const Security = () => {
  const { user, isAuthenticated } = useAuth();
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [loginHistory, setLoginHistory] = useState([]);

  const [securityStatus, setSecurityStatus] = useState({
    lastPasswordChange: null,
    twoFactorEnabled: false,
    suspiciousActivity: true
  });

  useEffect(() => {
    const fetchSecurityInfo = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setError('Необходимо авторизоваться');
          return;
        }

        const response = await axios.get('http://localhost:5000/users/security-info', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.data) {
          const lastChange = new Date(response.data.lastPasswordChange);
          const now = new Date();
          const diffTime = Math.abs(now - lastChange);
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
          
          let lastChangeText;
          if (diffDays === 0) {
            lastChangeText = 'сегодня';
          } else if (diffDays === 1) {
            lastChangeText = 'вчера';
          } else if (diffDays < 30) {
            lastChangeText = `${diffDays} дней назад`;
          } else {
            const months = Math.floor(diffDays / 30);
            lastChangeText = `${months} месяцев назад`;
          }

          setSecurityStatus(prev => ({
            ...prev,
            lastPasswordChange: `${lastChangeText} (${lastChange.toLocaleString('ru-RU')})`,
            twoFactorEnabled: response.data.twoFactorEnabled || false,
            suspiciousActivity: response.data.suspiciousActivity || false
          }));

          // Устанавливаем историю входов
          if (response.data.loginHistory) {
            setLoginHistory(response.data.loginHistory.map(entry => ({
              id: entry.id,
              date: new Date(entry.date).toLocaleString('ru-RU'),
              device: entry.device,
              location: entry.location || 'Неизвестно',
              status: entry.status
            })));
          }
        }
      } catch (error) {
        console.error('Ошибка при получении информации о безопасности:', error);
        setError(error.response?.data?.msg || 'Ошибка при получении информации о безопасности');
      }
    };

    if (isAuthenticated) {
      fetchSecurityInfo();
    }
  }, [isAuthenticated]);

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setError('Новые пароли не совпадают');
      return;
    }

    if (passwordData.newPassword.length < 8) {
      setError('Новый пароль должен содержать минимум 8 символов');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Необходимо авторизоваться');
        return;
      }

      const decoded = jwtDecode(token);
      const userId = decoded.userId;

      const response = await axios.post(`http://localhost:5000/users/${userId}/change-password`, {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      }, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.data) {
        setSuccessMessage('Пароль успешно изменен');
        setShowPasswordModal(false);
        setPasswordData({
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        });
        
        // Обновляем информацию о безопасности после смены пароля
        const securityResponse = await axios.get('http://localhost:5000/users/security-info', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (securityResponse.data) {
          setSecurityStatus(prev => ({
            ...prev,
            lastPasswordChange: `${securityResponse.data.lastPasswordChange} (${new Date(securityResponse.data.lastPasswordChange).toLocaleString('ru-RU')})`,
            suspiciousActivity: false
          }));
        }
      }
    } catch (error) {
      console.error('Ошибка при смене пароля:', error);
      setError(error.response?.data?.msg || 'Ошибка при смене пароля');
    }
  };

  if (!isAuthenticated || !user) {
    return (
      <Container className="security-container">
        <h2>Безопасность</h2>
        <Alert variant="warning">
          Пожалуйста, войдите в систему для просмотра информации о безопасности
        </Alert>
      </Container>
    );
  }

  return (
    <Container className="security-container mt-4">
      <h1 className="text-center mb-4">Безопасность аккаунта</h1>
      {error && <Alert variant="danger">{error}</Alert>}
      {successMessage && <Alert variant="success">{successMessage}</Alert>}

      <Card className="mb-4">
        <Card.Body>
          <Card.Title>Статус безопасности</Card.Title>
          <div className="security-status">
            <Alert variant={securityStatus.suspiciousActivity ? "warning" : "success"}>
              {securityStatus.suspiciousActivity 
                ? "Обнаружена подозрительная активность! Рекомендуем сменить пароль."
                : "Ваш аккаунт в безопасности"}
            </Alert>
            <p>
              <strong>Последняя смена пароля:</strong> {securityStatus.lastPasswordChange}
              <Button 
                variant="link" 
                className="ms-2 change-password-btn"
                onClick={() => setShowPasswordModal(true)}
              >
                Изменить пароль
              </Button>
            </p>
            <p>
              <strong>Двухфакторная аутентификация:</strong> 
              <span className={securityStatus.twoFactorEnabled ? "text-success" : "text-danger"}>
                {securityStatus.twoFactorEnabled ? " Включена" : " Отключена"}
              </span>
            </p>
          </div>
        </Card.Body>
      </Card>

      <Card>
        <Card.Body>
          <Card.Title>История входов</Card.Title>
          <div className="table-responsive">
            <Table striped hover>
              <thead>
                <tr>
                  <th>Дата и время</th>
                  <th>Устройство</th>
                  <th>Местоположение</th>
                  <th>Статус</th>
                </tr>
              </thead>
              <tbody>
                {loginHistory.map(entry => (
                  <tr key={entry.id} className={entry.status === 'Подозрительно' ? 'table-warning' : entry.status === 'Неудачно' ? 'table-danger' : ''}>
                    <td>{entry.date}</td>
                    <td>{entry.device}</td>
                    <td>{entry.location}</td>
                    <td>
                      <span className={`status-badge ${entry.status === 'Успешно' ? 'success' : entry.status === 'Подозрительно' ? 'warning' : 'danger'}`}>
                        {entry.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        </Card.Body>
      </Card>

      {/* Модальное окно смены пароля */}
      <Modal show={showPasswordModal} onHide={() => setShowPasswordModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Изменение пароля</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handlePasswordChange}>
            <Form.Group className="mb-3">
              <Form.Label>Текущий пароль</Form.Label>
              <Form.Control
                type="password"
                value={passwordData.currentPassword}
                onChange={(e) => setPasswordData({...passwordData, currentPassword: e.target.value})}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Новый пароль</Form.Label>
              <Form.Control
                type="password"
                value={passwordData.newPassword}
                onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})}
                required
              />
              <Form.Text className="text-muted">
                Минимум 8 символов
              </Form.Text>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Подтвердите новый пароль</Form.Label>
              <Form.Control
                type="password"
                value={passwordData.confirmPassword}
                onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})}
                required
              />
            </Form.Group>
            <div className="d-flex justify-content-end gap-2">
              <Button variant="secondary" onClick={() => setShowPasswordModal(false)}>
                Отмена
              </Button>
              <Button variant="primary" type="submit">
                Изменить пароль
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </Container>
  );
};

export default Security; 
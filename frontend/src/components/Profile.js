import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Form, Modal, Alert } from 'react-bootstrap';
import { useAuth } from './AuthContext';
import axios from 'axios';
import './Profile.css';
import { jwtDecode } from "jwt-decode";
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  
  console.log('Current user data:', user);
  
  const [activityStats, setActivityStats] = useState({
    lastLogin: '13 апреля 2025, 19:42',
    last24h: 2,
    lastWeek: 6
  });
  const [showEditModal, setShowEditModal] = useState(false);
  const [editData, setEditData] = useState({
    username: '',
    about: '',
    avatarUrl: ''
  });
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [securityInfo, setSecurityInfo] = useState({
    lastPasswordChange: 'никогда',
    suspiciousActivity: false
  });

  useEffect(() => {
    if (user) {
      console.log('Setting edit data with user:', user);
      setEditData({
        username: user.name || '',
        about: user.about || 'В жизни — такой же: тихий, наблюдательный, но когда надо — быстро принимаю решения и иду до конца. Терпелив, но не пассивен. Если уж решил — доведу дело до победы.',
        avatarUrl: user.avatar || ''
      });
    }
  }, [user]);

  useEffect(() => {
    const fetchSecurityInfo = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) return;

        const response = await axios.get('http://localhost:5000/users/security-info', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.data && response.data.lastPasswordChange) {
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

          setSecurityInfo(prev => ({
            ...prev,
            lastPasswordChange: `${lastChangeText} (${lastChange.toLocaleString('ru-RU')})`,
            suspiciousActivity: response.data.suspiciousActivity || false
          }));

          // Обновляем статистику активности
          if (response.data.loginHistory && response.data.loginHistory.length > 0) {
            const last24h = response.data.loginHistory.filter(entry => {
              const entryDate = new Date(entry.date);
              const dayAgo = new Date(now - 24 * 60 * 60 * 1000);
              return entryDate > dayAgo;
            }).length;

            const lastWeek = response.data.loginHistory.filter(entry => {
              const entryDate = new Date(entry.date);
              const weekAgo = new Date(now - 7 * 24 * 60 * 60 * 1000);
              return entryDate > weekAgo;
            }).length;

            const lastLoginEntry = response.data.loginHistory[0];
            
            setActivityStats({
              lastLogin: new Date(lastLoginEntry.date).toLocaleString('ru-RU'),
              last24h,
              lastWeek
            });
          }
        }
      } catch (error) {
        console.error('Ошибка при получении информации о безопасности:', error);
      }
    };

    if (user) {
      fetchSecurityInfo();
    }
  }, [user]);

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const decoded = jwtDecode(token);
      const userId = decoded.userId;

      const response = await axios.patch(`http://localhost:5000/users/${userId}`, {
        name: editData.username,
        about: editData.about,
        avatar: editData.avatarUrl
      }, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.data) {
        setSuccessMessage('Профиль успешно обновлен');
        const updatedUser = {
          ...user,
          name: editData.username,
          about: editData.about,
          avatar: editData.avatarUrl
        };
        localStorage.setItem('user', JSON.stringify(updatedUser));
        
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      }

      setShowEditModal(false);
    } catch (error) {
      console.error('Ошибка при обновлении профиля:', error);
      setError(error.response?.data?.message || 'Ошибка при обновлении профиля');
    }
  };

  if (!isAuthenticated || !user) {
    return (
      <Container className="profile-container">
        <h2>Профиль</h2>
        <p>Пожалуйста, войдите в систему для просмотра профиля</p>
      </Container>
    );
  }

  return (
    <Container className="profile-container mt-4">
      <h1 className="text-center mb-4">Профиль</h1>
      {error && <div className="error-message">{error}</div>}
      {successMessage && <div className="success-message">{successMessage}</div>}
      
      <Row>
        <Col md={3}>
          <Card className="profile-card mb-3">
            <Card.Body className="text-center">
              {console.log('Avatar URL:', user?.avatar)}
              <div className="profile-photo-container mb-3">
                <img
                  src={user?.avatar || '/default-avatar.png'}
                  alt="Фото профиля"
                  className="profile-photo"
                  onError={(e) => {
                    console.log('Image load error, using default');
                    e.target.onerror = null;
                    e.target.src = '/default-avatar.png';
                  }}
                />
              </div>
              <Button 
                variant="outline-primary" 
                className="edit-profile-btn w-100"
                onClick={() => setShowEditModal(true)}
              >
                Редактировать профиль
              </Button>
            </Card.Body>
          </Card>

          <Card className="quote-card mb-3">
            <Card.Body>
              <h6>Цитата сегодняшнего дня гласит:</h6>
              <p className="quote-text">«Сила приходит к тем, кто терпел и продолжал»</p>
              <p className="quote-author">- Мастер Йи</p>
            </Card.Body>
          </Card>
        </Col>

        <Col md={6}>
          <Card className="info-card mb-3">
            <div className="user-info">
              <p><strong>Имя:</strong> {user?.name}</p>
              <p><strong>Email:</strong> {user?.email}</p>
              <p><strong>Дата Регистрации:</strong> {user?.createdAt ? new Date(user.createdAt).toLocaleString('ru-RU', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit'
              }).replace(',', '') : ''}</p>
            </div>

            <div className="about-me">
              <h5>Обо мне:</h5>
              <p>{user?.about || editData.about}</p>
            </div>
          </Card>

          <Card className="activity-card">
            <h5>Ваша активность за последние 24 часа</h5>
            <ul>
              <li>Последний вход: {activityStats.lastLogin}</li>
              <li>Входов за последние 24 часа: {activityStats.last24h}</li>
              <li>Входов за последнюю неделю: {activityStats.lastWeek}</li>
            </ul>
            <p className="text-muted">Если вы не узнаете какое-либо из действий, рекомендуем сменить пароль.</p>
          </Card>
        </Col>

        <Col md={3}>
          <Card className="security-card">
            <h5>Безопасность Аккаунта</h5>
            <div className="security-status">
              {securityInfo.suspiciousActivity && (
                <Alert variant="warning">
                  Последний вход с нового устройства
                </Alert>
              )}
              <div className="security-info-details">
                <p>
                  <span>
                    <strong>Последняя смена пароля:</strong> {securityInfo.lastPasswordChange}
                  </span>
                  <Button 
                    variant="link" 
                    className="change-password-btn"
                    onClick={() => navigate('/security')}
                  >
                    Изменить пароль
                  </Button>
                </p>
                <p>
                  <strong>Двухфакторная аутентификация:</strong> 
                  <span className="text-danger">Отключена</span>
                </p>
              </div>
            </div>
          </Card>

          <Card className="screenshot-card">
            <Card.Body>
              <h6>Фото последнего скриншота пользователя</h6>
              <div className="screenshot-placeholder">
                {/* Здесь будет отображаться скриншот */}
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Редактировать профиль</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleEditSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Имя пользователя</Form.Label>
              <Form.Control
                type="text"
                value={editData.username}
                onChange={(e) => setEditData({...editData, username: e.target.value})}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>О себе</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={editData.about}
                onChange={(e) => setEditData({...editData, about: e.target.value})}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>URL аватара</Form.Label>
              <Form.Control
                type="text"
                placeholder="Введите URL изображения"
                value={editData.avatarUrl}
                onChange={(e) => setEditData({...editData, avatarUrl: e.target.value})}
              />
            </Form.Group>
            <div className="d-flex justify-content-end gap-2">
              <Button variant="secondary" onClick={() => setShowEditModal(false)}>
                Отмена
              </Button>
              <Button variant="primary" type="submit">
                Сохранить
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </Container>
  );
};

export default Profile; 
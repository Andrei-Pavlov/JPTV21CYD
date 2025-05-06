import React, { useRef, useState, useEffect } from 'react';
import { Container, Row, Col, Button, Modal, Image, Alert } from 'react-bootstrap';
import { useAuth } from './AuthContext';
import axios from 'axios';

const MAX_FILE_SIZE_MB = 2;

export default function AboutGalleryBlock() {
  const { user } = useAuth();
  const [images, setImages] = useState([]);
  const [pendingImages, setPendingImages] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [modalImg, setModalImg] = useState(null);
  const [error, setError] = useState('');
  const fileInputRef = useRef();

  // Получить список фото с сервера
  useEffect(() => {
    axios.get('http://localhost:5000/gallery/list')
      .then(res => setImages(res.data))
      .catch(() => setImages([]));
  }, []);

  const handleImageUpload = (e) => {
    setError('');
    const files = Array.from(e.target.files);
    const validFiles = files.filter(file => file.size <= MAX_FILE_SIZE_MB * 1024 * 1024);
    const invalidFiles = files.filter(file => file.size > MAX_FILE_SIZE_MB * 1024 * 1024);
    if (invalidFiles.length > 0) {
      setError(`Файл(ы) слишком большие. Максимальный размер: ${MAX_FILE_SIZE_MB} МБ на фото.`);
    }
    if (validFiles.length === 0) {
      e.target.value = '';
      return;
    }
    setPendingImages(validFiles);
    e.target.value = '';
  };

  const handleConfirm = async (file) => {
    const formData = new FormData();
    formData.append('image', file);
    try {
      const res = await axios.post('http://localhost:5000/gallery/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setImages(prev => [...prev, res.data]);
      setPendingImages(prev => prev.filter(f => f !== file));
    } catch {
      setError('Ошибка загрузки на сервер');
    }
  };

  const handleReject = (file) => {
    setPendingImages(prev => prev.filter(f => f !== file));
  };

  const handleImageClick = (imgUrl) => {
    setModalImg(imgUrl);
    setShowModal(true);
  };

  const handleDelete = async (filename) => {
    try {
      await axios.delete(`http://localhost:5000/gallery/delete/${filename}`);
      setImages(prev => prev.filter(img => img.filename !== filename));
    } catch {
      setError('Ошибка при удалении фотографии');
    }
  };

  return (
    <div style={{ background: '#fff', padding: '40px 0' }}>
      <Container>
        <Row>
          <Col md={6} style={{ borderRight: '3px solid #888' }}>
            <h2 style={{ textAlign: 'center', fontWeight: 700, marginBottom: 24 }}>О НАС</h2>
            <div style={{ fontSize: 22, fontWeight: 400, marginTop: 16, lineHeight: 1.1 }}>
              CYD— это креативная студия, специализирующаяся на создании атмосферных визуальных новелл в жанре восточного фэнтези. Мы объединяем захватывающие сюжеты, вдохновлённые древнекитайскими легендами, с насыщенной визуальной эстетикой, проработанным саундтреком и возможностью влиять на ход истории через интерактивные выборы.<br/><br/>
              Наши проекты переносят игроков в мир культивации — где внутренняя энергия, боевые искусства и путь духовного совершенствования играют ключевую роль. Это не просто игра — это погружение в философию силы, равновесия и судьбы. Каждый выбор имеет значение, каждое решение формирует вашу уникальную историю.<br/><br/>
              Если вы мечтали прикоснуться к мистике Дао, пройти путь от простого ученика до бессмертного мастера и исследовать древний мир, полный загадок и испытаний — добро пожаловать в мир CYD. Здесь начинается ваша легенда.
            </div>
          </Col>
          <Col md={6}>
            <h2 style={{ textAlign: 'center', fontWeight: 700, marginBottom: 24 }}>Галерея</h2>
            <div style={{ background: '#ddd', minHeight: 220, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16, flexDirection: 'column' }}>
              {user?.role === 'admin' && (
                <>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    style={{ display: 'none' }}
                    ref={fileInputRef}
                    onChange={handleImageUpload}
                  />
                  <Button
                    variant="secondary"
                    size="sm"
                    style={{ marginBottom: 12 }}
                    onClick={() => fileInputRef.current.click()}
                  >
                    Загрузить фотографии
                  </Button>
                </>
              )}
              {error && <Alert variant="danger" style={{ width: '90%', margin: '0 auto 10px auto' }}>{error}</Alert>}
              {/* Блок для подтверждения новых фото */}
              {user?.role === 'admin' && pendingImages.length > 0 && (
                <div style={{ marginBottom: 10, width: '100%' }}>
                  <div style={{ fontWeight: 500, marginBottom: 6 }}>Новые фотографии (требуют подтверждения):</div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, justifyContent: 'center' }}>
                    {pendingImages.map((file, idx) => {
                      const url = URL.createObjectURL(file);
                      return (
                        <div key={idx} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                          <Image
                            src={url}
                            alt={file.name}
                            style={{ width: 90, height: 90, objectFit: 'cover', borderRadius: 8, border: '2px solid #bbb', marginBottom: 4 }}
                            thumbnail
                          />
                          <div style={{ display: 'flex', gap: 4 }}>
                            <Button size="sm" variant="success" onClick={() => handleConfirm(file)}>Подтвердить</Button>
                            <Button size="sm" variant="danger" onClick={() => handleReject(file)}>Отклонить</Button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
              {/* Основная галерея */}
              {images.length === 0 ? (
                <span style={{ color: '#333', fontSize: 16 }}>Фотографии игры</span>
              ) : (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, justifyContent: 'center' }}>
                  {images.map((img, idx) => (
                    <div key={idx} style={{ position: 'relative' }}>
                      <Image
                        src={`http://localhost:5000${img.url}`}
                        alt={img.filename}
                        style={{ width: 90, height: 90, objectFit: 'cover', cursor: 'pointer', borderRadius: 8, border: '2px solid #bbb' }}
                        onClick={() => handleImageClick(`http://localhost:5000${img.url}`)}
                        thumbnail
                      />
                      {user?.role === 'admin' && (
                        <Button
                          variant="danger"
                          size="sm"
                          style={{
                            position: 'absolute',
                            top: -8,
                            right: -8,
                            padding: '2px 6px',
                            borderRadius: '50%',
                            fontSize: '12px'
                          }}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(img.filename);
                          }}
                        >
                          ×
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div style={{ fontSize: 20, fontWeight: 400 }}>
              В галерее вы можете увидеть, как игра будет выглядеть и понять её формат и тематику,а также как выглядит управление в самой игре
            </div>
          </Col>
        </Row>
        <Modal show={showModal} onHide={() => setShowModal(false)} centered size="xl" backdrop="static">
          <Modal.Body style={{ padding: 0, background: '#222' }}>
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
              <img src={modalImg} alt="game" style={{ maxWidth: '95vw', maxHeight: '80vh', objectFit: 'contain' }} />
            </div>
          </Modal.Body>
          <Modal.Footer style={{ justifyContent: 'center', background: '#222' }}>
            <Button variant="light" onClick={() => setShowModal(false)}>
              Закрыть
            </Button>
          </Modal.Footer>
        </Modal>
      </Container>
    </div>
  );
} 
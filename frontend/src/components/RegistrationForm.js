import React, { useState } from "react";
import { Button, Card, Col, Container, Form, Row } from "react-bootstrap";
import axios from 'axios';

export default function RegisterForm() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [letter, setLetter] = useState('');
    const [photo, setPhoto] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!name || !email) {
            alert('Заполните обязательные поля: Имя и Почта.');
            return;
        }

        const formData = new FormData();
        formData.append('name', name);
        formData.append('email', email);
        formData.append('letter', letter);
        if (photo) {
            formData.append('photo', photo);
        }

        try {
            const res = await axios.post('http://localhost:5000/application', formData);
            alert('Данные успешно отправлены!');
            setName('');
            setEmail('');
            setLetter('');
            setPhoto(null);
        } catch (error) {
            const message = error.response?.data?.message || error.message;
            if (message.includes('Email')) {
                alert('Эта почта уже используется. Пожалуйста, используйте другую.');
            } else {
                alert('Ошибка при отправке данных: ' + message);
            }
        }
    };

    const handleLetterChange = (e) => {
        if (e.target.value.length <= 200) {
            setLetter(e.target.value);
        }
    };

    const handlePhotoChange = (e) => {
        setPhoto(e.target.files[0]);
    };

    return (
        <Container className="register-container mt-1">
            <h2 className="text-center mt-3">Отправьте найденные баги нам!</h2>
            <Row className="d-flex justify-content-center align-items-center">
                <Col md={8} lg={6} xs={12}>
                    <Card className="shadow">
                        <Card.Body>
                            <Form onSubmit={handleSubmit}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Игровое Имя</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Введите ваше игровое имя"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        required
                                    />
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Label>Почта</Form.Label>
                                    <Form.Control
                                        type="email"
                                        placeholder="Введите вашу почту"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                    />
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Label>Дополнительная информация</Form.Label>
                                    <Form.Control
                                        as="textarea"
                                        placeholder="Опишите найденный баг"
                                        rows={2}
                                        value={letter}
                                        onChange={handleLetterChange}
                                    />
                                    <div>{letter.length}/200</div>
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Label>Скриншот бага (необязательно)</Form.Label>
                                    <Form.Control
                                        type="file"
                                        accept="image/*"
                                        onChange={handlePhotoChange}
                                    />
                                </Form.Group>
                                <div className="d-flex justify-content-center">
                                    <Button
                                        variant="primary"
                                        type="submit"
                                        className="w-50"
                                        style={{ backgroundColor: '#63B69D', borderColor: '#63B69D' }}
                                    >
                                        Отправить
                                    </Button>
                                </div>
                            </Form>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
}

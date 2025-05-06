import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button, Col, Container, Row, Table } from 'react-bootstrap';

export default function ApplicationList() {
    const [applications, setApplications] = useState([]);
    const [filter, setFilter] = useState('all');
    const [pendingCount, setPendingCount] = useState(0);
    const [acceptedCount, setAcceptedCount] = useState(0);
    const [declinedCount, setDeclinedCount] = useState(0);
    const [totalApplications, setTotalApplications] = useState(0);

    const getApplications = async () => {
        const response = await axios.get('http://localhost:5000/application');
        setApplications(response.data);
        const data = response.data
        setApplications(data);

        const pending = data.filter(application => application.isAccepted === 0).length;
        const accepted = data.filter(application => application.isAccepted === 1).length;
        const declined = data.filter(application => application.isAccepted === 2).length;
        setPendingCount(pending);
        setAcceptedCount(accepted);
        setDeclinedCount(declined);
        setTotalApplications(data.length);
    };

    const deleteApplication = async (id) => {
        if (window.confirm('Удалить заявку #' + id + ' ?')) {
            await axios.delete(`http://localhost:5000/application/delete/${id}`);
            getApplications();
        }
    };

    const acceptApplication = async (id) => {
        await axios.patch(`http://localhost:5000/application/accept/${id}`);
        getApplications();
    };

    const declineApplication = async (id) => {
        await axios.patch(`http://localhost:5000/application/decline/${id}`);
        getApplications();
    };

    useEffect(() => {
        getApplications();
    }, []);

    const filterApplications = (status) => {
        setFilter(status);
    };

    const filteredApplications = () => {
        if (filter === 'all') return applications;
        return applications.filter(application => {
            if (filter === 'pending') return application.isAccepted === 0;
            if (filter === 'accepted') return application.isAccepted === 1;
            if (filter === 'declined') return application.isAccepted === 2;
        });
    };

    return (
        <Container className='mt-1'>
            <h2 className='text-center mt-3'>Список багов</h2>
            <Row>
                <Col md={{ span: 9, offset: 2 }}>
                    <div>
                        <h4>Счетчик заявок: {totalApplications}</h4>
                        <p>Не рассмотрено: {pendingCount} || 
                        Принято: {acceptedCount} ||  
                        Отклонено: {declinedCount}</p>
                    </div>
                    <div>
                        <h4>Фильтровать заявки:</h4>
                        <Button onClick={() => filterApplications('all')} variant='light' className='me-2'>Все</Button>
                        <Button onClick={() => filterApplications('pending')} variant='light' className='me-2'>Не рассмотренные</Button>
                        <Button onClick={() => filterApplications('accepted')} variant='light' className='me-2'>Принятые</Button>
                        <Button onClick={() => filterApplications('declined')} variant='light'>Отклоненные</Button>
                    </div>
                    <Table striped>
                        <thead>
                            <tr>
                                <th>No#</th>
                                <th>Имя</th>
                                <th>Почта</th>
                                <th>Письмо</th>
                                <th>Статус</th>
                                <th className='text-center'>Действия</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredApplications().map((application, index) => (
                                <tr key={application.id}>
                                    <td>{index + 1}</td>
                                    <td>{application.name}</td>
                                    <td>{application.email}</td>
                                    <td style={{ maxWidth: '150px', wordWrap: 'break-word' }}>{application.letter}</td>
                                    <td>{application.isAccepted === 0 ? '⌛' : application.isAccepted === 1 ? '✅' : '❌'}</td>
                                    <td className='text-center'>
                                        <Button 
                                            onClick={() => acceptApplication(application.id)}
                                            variant='success' 
                                            size='sm' 
                                            disabled={application.isAccepted}
                                            className="mb-3">
                                            Принять
                                        </Button>
                                        <Button 
                                            onClick={() => declineApplication(application.id)}
                                            variant='danger' 
                                            size='sm' 
                                            disabled={application.isAccepted}
                                            className="mb-3">
                                            Отклонить
                                        </Button>
                                        {/* <Button 
                                            onClick={() => deleteApplication(application.id)} 
                                            variant='warning' 
                                            size='sm'>
                                            Удалить
                                        </Button> */}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </Col>
            </Row>
        </Container>
    );
}

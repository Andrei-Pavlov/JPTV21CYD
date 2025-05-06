import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import './Home.css';

const Home = () => {
  return (
    <div className="home-container">
      <Container fluid>
        <Row className="welcome-section">
          <Col md={12} className="text-center">
            <h1>
              <span className="welcome-text">ДОБРО ПОЖАЛОВАТЬ В</span>
              <span className="itpro-text">CYD</span>
            </h1>
          </Col>
        </Row>

        <Row className="why-choose-section">
          <Col md={12} className="text-center">
            <p className="institution-description">
              Центр профессионального образования Ида-Вирумаа – крупнейшее национальное профессиональное учебное заведение Эстонии, 
              в котором по различным специальностям обучаются более 2300 студентов.
            </p>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Home; 
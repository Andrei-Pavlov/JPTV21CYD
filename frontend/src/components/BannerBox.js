import React from 'react'
import { Container, Row, Col } from 'react-bootstrap'
import './BannerBox.css'

export default function BannerBox() {
  return (
    <div className="banner-section">
      <Container>
        <div className="banner-content">
          <h1 className="banner-title">
            <span className="title-regular">ДОБРО ПОЖАЛОВАТЬ В</span>
            <span className="title-bold"> CYD</span>
          </h1>
          
          <Row className="banner-text-container">
            <Col md={6} className="left-column">
              <p>Здесь начинается путь.</p>
              <p>Не тот, что проложен картами и тропами, а тот, что рождается внутри — из тишины, из сомнений, из поиска смысла.</p>
              <p>CYD — это место, где время не диктует правил, а лишь наблюдает. Где ты сам выбираешь, когда остановиться и когда сделать шаг вперёд.</p>
              <p>Мы не торопим. Мы не подсказываем. Мы просто открываем дверь. И то, что ты за ней найдёшь — может изменить гораздо больше, чем ты ожидаешь.</p>
            </Col>
            
            <Col md={6} className="right-column">
              <p>Почувствуй пространство вокруг: спокойное, тягучее, словно капля чая, застывшая в воздухе.</p>
              <p>Здесь важны не ответы, а вопросы.</p>
              <p>Здесь важны не события, а состояния.</p>
              <p>Ты не просто игрок — ты наблюдатель, странник, мыслитель. Добро пожаловать туда, где реальность сгибается, а внутренний голос становится самым громким звуком.</p>
              <p>CYD — это начало. Всё остальное — в твоих руках.</p>
            </Col>
          </Row>
        </div>
      </Container>
    </div>
  )
}

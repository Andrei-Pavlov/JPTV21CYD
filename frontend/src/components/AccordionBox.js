import React from 'react'
import programsList from '../data/program.json';
import { Accordion, Col, Container, Row } from 'react-bootstrap';

export default function AccordionBox() {
  return (
    <Container className='mt-5'>
        <Row>
            <Col md={{span: 7, offset: 2}}>
            <h2 style={{ color: '#63B69D',  }}>FAQ</h2>
              <Accordion defaultActiveKey="1">
                    {programsList.map((data) => (
                        <Accordion.Item eventKey={data.id} key={data.id}>
                            <Accordion.Header>
                                {data.question}
                            </Accordion.Header>
                            <Accordion.Body>{data.answer}</Accordion.Body>
                        </Accordion.Item>
                    ))}
                </Accordion>
            </Col>
        </Row>
    </Container>
  )
}

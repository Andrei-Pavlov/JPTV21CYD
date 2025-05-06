import React, { useEffect, useRef } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import './Cardbox.css';
import MAIL from './icons/mail.png';
import HOME from './icons/home.png';
import TIME from './icons/time.png';
import PHONE from './icons/phone.png';

const MapComponent = () => {
  const mapRef = useRef(null);

  useEffect(() => {
    const initMap = () => {
      const geocoder = new window.google.maps.Geocoder();
      const map = new window.google.maps.Map(mapRef.current, {
        zoom: 17,
        center: { lat: 59.356349, lng: 27.400423 }, // Coordinates for Ida-Virumaa Kutsehariduskeskus
      });

      geocoder.geocode({ address: 'Estonia, Kutse tänav 13, 41533' }, (results, status) => {
        if (status === 'OK' && results[0]) {
          map.setCenter(results[0].geometry.location);
          new window.google.maps.Marker({
            position: results[0].geometry.location,
            map: map,
          });
        } else {
          console.error('Geocode was not successful for the following reason: ' + status);
        }
      });
    };

    if (!window.google) {
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyASagwL1z7VV0jkZIvP3NIEA33_LGwMjvk&libraries=places`;
      script.async = true;
      script.defer = true;
      script.onload = initMap;
      document.head.appendChild(script);
    } else {
      initMap();
    }
  }, []);

  return <div ref={mapRef} style={{ height: '300px', width: '100%' }}></div>;
};

export default function CardBox() {
  return (
    <Container fluid className='contact-section'>
      <Row>
        <Col md={6} className='contact-details'>
          <h2 className='contact-title'>Свяжитесь с нами</h2>
          <div className='contact-info'>
            <div className='contact-item'>
              <img src={MAIL} alt='Email' />
              <span>ivkhk@info.ee</span>
            </div>
            <div className='contact-item'>
              <img src={HOME} alt='Address' />
              <span>Kutse tänav 13, 41533</span>
            </div>
            <div className='contact-item'>
              <img src={TIME} alt='Hours' />
              <span>Пон-Пят 09:00 - 16:00</span>
            </div>
            <div className='contact-item'>
              <img src={PHONE} alt='Phone' />
              <span>+372 5887 7765</span>
            </div>
          </div>
        </Col>
        <Col md={6} className='map-section'>
          <MapComponent />
        </Col>
      </Row>
    </Container>
  );
}

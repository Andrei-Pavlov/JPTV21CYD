import React, { useState, useEffect } from 'react';
import Carousel from 'react-bootstrap/Carousel';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext.js';

// Function to import all images from the specified directory
function importAll(r) {
  let images = {};
  r.keys().map((item, index) => {
    images[item.replace('./', '')] = r(item);
    return null;
  });
  return images;
}

export default function CarouselBox() {
  const images = importAll(require.context('../assets/carousel', false, /\.(png|jpe?g|svg)$/));
  const imageList = Object.entries(images);
  const { isAuthenticated } = useAuth();
  const [isDownloading, setIsDownloading] = useState(false);
  const [error, setError] = useState(null);
  const [gameFile, setGameFile] = useState(null);

  // Получаем список файлов при загрузке компонента
  useEffect(() => {
    const fetchGameFile = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) return;

        const response = await axios.get('http://localhost:5000/files/list', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        // Берем первый файл из списка (или вы можете выбрать конкретный файл по ID)
        if (response.data && response.data.length > 0) {
          setGameFile(response.data[0]);
        }
      } catch (error) {
        console.error('Ошибка при получении списка файлов:', error);
      }
    };

    if (isAuthenticated) {
      fetchGameFile();
    }
  }, [isAuthenticated]);

  const handleDownload = async () => {
    if (!gameFile) {
      setError('Файл игры не найден');
      return;
    }

    try {
      setIsDownloading(true);
      setError(null);

      const token = localStorage.getItem('token');
      if (!token) {
        setError('Необходимо авторизоваться');
        return;
      }

      const response = await axios.get(`http://localhost:5000/files/download/${gameFile.id}`, {
        responseType: 'blob',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
  
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', gameFile.originalname);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Ошибка при загрузке файла:', error);
      setError('Произошла ошибка при загрузке файла. Пожалуйста, попробуйте позже.');
    } finally {
      setIsDownloading(false);
    }
  };
  
  return (
    <Carousel>
      {imageList.map(([imageName, imagePath], index) => (
        <Carousel.Item key={index}>
          <img
            className='d-block w-100'
            style={{ height: 800 }}
            src={imagePath}
            alt={imageName}
          />
          <Carousel.Caption
            style={{
              position: "absolute",
              left: "20%",
              bottom: "50%",
              transform: "translateY(50%)",
              color: "white",
              textAlign: "left"
            }}
          >
            <h3>Создай свою судьбу</h3>
            <p>Выбирай путь, принимай решения и управляй своим будущим, <br/>сталкиваясь с уникальными вызовами и возможностями</p>
            {isAuthenticated && (
              <>
                <button
                  onClick={handleDownload}
                  disabled={isDownloading || !gameFile}
                  style={{
                    backgroundColor: "#2CC295",
                    border: "none",
                    color: "white",
                    padding: "10px 20px",
                    textAlign: "center",
                    textDecoration: "none",
                    display: "inline-block",
                    fontSize: "16px",
                    marginTop: "10px",
                    cursor: (isDownloading || !gameFile) ? "not-allowed" : "pointer",
                    borderRadius: "5px",
                    opacity: (isDownloading || !gameFile) ? 0.7 : 1
                  }}
                >
                  {isDownloading ? 'Загрузка...' : 'Начать играть'}
                </button>
                {error && (
                  <p style={{ color: 'red', marginTop: '10px' }}>{error}</p>
                )}
                {!gameFile && !error && (
                  <p style={{ color: 'yellow', marginTop: '10px' }}>
                    Файл игры не загружен в систему
                  </p>
                )}
              </>
            )}
          </Carousel.Caption>
        </Carousel.Item>
      ))}
    </Carousel>
  );
}

import React, { useState } from 'react';
import axios from 'axios';

export default function FileUpload() {
    const [file, setFile] = useState(null);
    const [description, setDescription] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const allowedExtensions = [
        '.pdf', '.doc', '.docx', 
        '.xls', '.xlsx', 
        '.ppt', '.pptx',
        '.txt', '.json', '.xml',
        '.zip', '.rar'
    ];

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            const ext = '.' + selectedFile.name.split('.').pop().toLowerCase();
            if (!allowedExtensions.includes(ext)) {
                setError(`Недопустимый тип файла. Разрешены только: ${allowedExtensions.join(', ')}`);
                setFile(null);
                e.target.value = ''; // Очищаем input
                return;
            }
            setFile(selectedFile);
            setError('');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!file) {
            setError('Пожалуйста, выберите файл');
            return;
        }

        try {
            // Получаем токен из localStorage
            const token = localStorage.getItem('token');
            if (!token) {
                setError('Необходимо авторизоваться');
                return;
            }

            const formData = new FormData();
            formData.append('file', file);
            formData.append('description', description);

            console.log('Начинаем загрузку файла:', file.name);
            console.log('Тип файла:', file.type);
            console.log('Размер файла:', file.size);

            const response = await axios.post('http://localhost:5000/files/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.data && response.data.message) {
                setMessage(response.data.message);
                setError('');
                setFile(null);
                setDescription('');
                // Очищаем input файла
                const fileInput = document.querySelector('input[type="file"]');
                if (fileInput) fileInput.value = '';
            }
        } catch (error) {
            console.error('Ошибка при загрузке файла:', error);
            
            if (error.response) {
                // Получаем сообщение об ошибке от сервера
                const errorMessage = error.response.data.message || 'Ошибка при сохранении файла в базу данных';
                setError(errorMessage);
            } else if (error.request) {
                // Ошибка сети
                setError('Ошибка сети. Пожалуйста, проверьте подключение к интернету.');
            } else {
                // Другие ошибки
                setError('Произошла ошибка при загрузке файла.');
            }
        }
    };

    return (
        <div style={{ maxWidth: '500px', margin: '20px auto', padding: '20px' }}>
            <h2>Загрузка файла</h2>
            <div style={{ 
                backgroundColor: '#f8f9fa', 
                padding: '10px', 
                borderRadius: '5px',
                marginBottom: '20px'
            }}>
                <p style={{ margin: '0', fontSize: '14px' }}>
                    <strong>Разрешенные типы файлов:</strong><br />
                    • Документы: PDF, DOC, DOCX<br />
                    • Таблицы: XLS, XLSX<br />
                    • Презентации: PPT, PPTX<br />
                    • Текстовые файлы: TXT, JSON, XML<br />
                    • Архивы: ZIP, RAR<br />
                    <strong>Максимальный размер:</strong> 250MB
                </p>
            </div>
            <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: '15px' }}>
                    <label style={{ display: 'block', marginBottom: '5px' }}>Выберите файл:</label>
                    <input
                        type="file"
                        onChange={handleFileChange}
                        style={{ display: 'block', marginBottom: '10px' }}
                        accept={allowedExtensions.join(',')}
                    />
                </div>
                <div style={{ marginBottom: '15px' }}>
                    <label style={{ display: 'block', marginBottom: '5px' }}>Описание:</label>
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        style={{ 
                            width: '100%', 
                            padding: '8px', 
                            marginBottom: '10px',
                            borderRadius: '4px',
                            border: '1px solid #ced4da'
                        }}
                    />
                </div>
                <button
                    type="submit"
                    style={{
                        backgroundColor: '#2CC295',
                        color: 'white',
                        padding: '10px 20px',
                        border: 'none',
                        borderRadius: '5px',
                        cursor: 'pointer',
                        width: '100%'
                    }}
                >
                    Загрузить
                </button>
            </form>
            {message && <p style={{ color: 'green', marginTop: '10px' }}>{message}</p>}
            {error && <p style={{ color: 'red', marginTop: '10px' }}>{error}</p>}
        </div>
    );
} 
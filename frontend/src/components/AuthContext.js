import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { jwtDecode } from "jwt-decode";

// Создаём контекст
export const AuthContext = createContext();

// Хук для доступа к контексту
export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchUserData = async (token) => {
    try {
      const response = await axios.get('http://localhost:5000/users/me', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      // Обработка данных пользователя
      const userData = {
        ...response.data,
        avatar: response.data.avatar || null,
        about: response.data.about || 'В жизни — такой же: тихий, наблюдательный, но когда надо — быстро принимаю решения и иду до конца. Терпелив, но не пассивен. Если уж решил — доведу дело до победы.'
      };
      
      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));
    } catch (error) {
      console.error('Ошибка при получении данных пользователя:', error);
      logout();
    }
  };

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const token = localStorage.getItem('token');
        const userData = localStorage.getItem('user');
        
        if (token) {
          const decoded = jwtDecode(token);
          const currentTime = Date.now() / 1000;
          
          if (decoded.exp < currentTime) {
            logout();
          } else {
            setIsAuthenticated(true);
            if (userData) {
              const parsedUserData = JSON.parse(userData);
              setUser({
                ...parsedUserData,
                avatar: parsedUserData.avatar || null,
                about: parsedUserData.about || 'В жизни — такой же: тихий, наблюдательный, но когда надо — быстро принимаю решения и иду до конца. Терпелив, но не пассивен. Если уж решил — доведу дело до победы.'
              });
            } else {
              await fetchUserData(token);
            }
          }
        }
      } catch (error) {
        console.error('Ошибка при инициализации аутентификации:', error);
        logout();
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const login = async (token) => {
    try {
      if (!token) {
        throw new Error('Токен не предоставлен');
      }
      localStorage.setItem('token', token);
      setIsAuthenticated(true);
      await fetchUserData(token);
    } catch (error) {
      console.error('Ошибка при входе:', error);
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsAuthenticated(false);
    setUser(null);
  };

  if (loading) {
    return <div>Загрузка...</div>;
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

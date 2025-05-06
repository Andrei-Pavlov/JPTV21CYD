import React from 'react';
import { Container, Nav, Navbar, NavbarCollapse, NavbarToggle } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import logo from '../components/logo192.png'
import { jwtDecode } from "jwt-decode";



export default function Header() {
    const [state, setState] = React.useState(false);
    const [name, setName] = React.useState('');
    const [avatar, setAvatar] = React.useState('');
    const [role, setRole] = React.useState('');

    React.useEffect(() => {
        getMe();
    }, [])

    const getMe = async () => {
        try{
            const token = localStorage.getItem('token');
            if (token) {
                const decoded = jwtDecode(token);
                setName(decoded.name);
                setAvatar(decoded.avatar);
                setRole(decoded.role);
                setState(true);
            } else {
                setState(false);
            }
        } catch(error) {
            if (error.response) {

            }
        }
    };
    return (
        <header>
            <Navbar sticky='top' collapseOnSelect expand="md" bg="white" variant='light' id='top'>
                <Container>
                    <Navbar.Brand as={Link} to="/">
                        <img src={logo} style={{marginRight: "1em"}}height="70" width="70" className='d-inline-block align-top' alt="logo" />
                    </Navbar.Brand>
                    <NavbarToggle aria-controls='responsive-navbar-nav'/>
                    <NavbarCollapse id="responsive-navbar-nav">
                        <Nav className="me-auto">
                            <Nav.Link as={Link} to="/">Главная</Nav.Link>
                        </Nav>
                        <Nav className='me-auto'>
                            {state && role === 'admin' ? (
                                <>
                                    <Nav.Link as={Link} to="/application"> Панель управления</Nav.Link>
                                    <Nav.Link as={Link} to="/upload">Загрузка файлов</Nav.Link>
                                </>
                            ) :(
                                <></>
                            )}
                        </Nav>
                        <Nav className='justify-content-end flex-grow-1 pe-3'>
                            {state ? (
                                <>
                                    <Nav.Link as={Link} to="/profile" style={{ color: '#333' }}>
                                        {name}
                                    </Nav.Link>
                                    <Nav.Link as={Link} to="/logout">Выйти</Nav.Link>
                                </>
                            ) : (
                                <>
                                    <Nav.Link as={Link} to="/login">Логин</Nav.Link>
                                </>
                            )}
                        </Nav>
                    </NavbarCollapse>
                </Container>
            </Navbar>
        </header>
    );
}
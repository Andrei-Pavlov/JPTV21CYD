import { useNavigate } from "react-router-dom"
import Cookies from 'js-cookie'
import { Button, Container } from "react-bootstrap";

const Logout = () => {
    const navigate = useNavigate();

    const onClickLogout = () => {
        if (window.confirm('Вы прям уверены что хотите выйти?')) {
            window.localStorage.removeItem('token');
            Cookies.remove('token');
            navigate('/');
            window.location.reload();
        }
    };

    return (
        <Container className="container mt-5 textAlign">
            <h2>Вы точно хотите выйти с учетной записи?</h2>
            <Button onClick={onClickLogout} variant="danger">
                Выйти
            </Button>
        </Container>
    )
}

export default Logout;
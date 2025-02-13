import axios from 'axios';
import Cookies from 'js-cookie';

// Login
export const login = async (username, password) => {
    
    const response = await axios.post('http://localhost:8080/login', {
        username,
        password
    });

    const authToken = response.data.token;
    Cookies.set('authToken', authToken);

    return response.data;

}

// Listar Tasks
export const getTasks = async () => {

    const response = await axios.get('http://localhost:8080/tasks/5');

    return response.data.tasks;

}


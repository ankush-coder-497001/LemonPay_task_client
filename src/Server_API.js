import axios from 'axios'
const BASE_URL = import.meta.env.VITE_SERVER_BASE_URL || 'http://localhost:7000/api';

export const loginUser = async (credentials) => {
  try {
   const res = await axios.post(`${BASE_URL}/user/login`, credentials, {
      headers: { 'Content-Type': 'application/json' }
    });
    console.log(res.data)
    const { token } = res.data.user;
    localStorage.setItem('token', token);
    return res.data.user;
  } catch (error) {
    throw new Error('Login failed');
  }
};

export const registerUser = async (userData) => {
  try {
   const res = await axios.post(`${BASE_URL}/user/register`, userData, {
      headers: { 'Content-Type': 'application/json' }
    });
    return res;
  } catch (error) {
    throw new Error('Registration failed');
  }
};

export const addTask = async (taskData) => {
  try {
    const token = localStorage.getItem('token');
    const res = await axios.post(`${BASE_URL}/task/create`, taskData, {
      headers: { 
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    return res.data;
  } catch (error) {
    throw new Error('Failed to add task');
  }
};

export const getTasks = async () => {
  try {
    const token = localStorage.getItem('token');
    const res = await axios.get(`${BASE_URL}/task/getAll`, {
      headers: { 
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    console.log(res.data)
    return res.data;
  } catch (error) {
    throw new Error('Failed to fetch tasks');
  }
};

export const deleteTask = async (taskId) => {
  try {
    const token = localStorage.getItem('token');
    const res = await axios.delete(`${BASE_URL}/task/delete/${taskId}`,{
      headers: { 
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    return res.data;
  } catch (error) {
    throw new Error('Failed to delete task');
  }
};

export const updateTask = async (taskId, taskData) => {
  try {
    const token = localStorage.getItem('token');
    const res = await axios.put(`${BASE_URL}/task/update/${taskId}`, taskData,{
      headers: { 
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    })
    return res.data;
}catch(error) {
    throw new Error('Failed to update task');
  }
}
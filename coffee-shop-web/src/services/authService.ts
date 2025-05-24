import axios from 'axios';
import { API_URL } from '../config/config';

export async function calllogin(email: string, password: string): Promise<string> {
  try {
    const response = await axios.post(`${API_URL}/login`, new URLSearchParams({
      username: email,
      password: password,
    }), {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    });
    return response.data.access_token;
  } catch (error) {
    console.error('Error during login:', error);
    throw new Error('Login failed. Check your email or password.');
  }
}

export async function callregister(name: string, email: string, password: string, phoneNumber: string): Promise<void> {
  try {
    await axios.post(`${API_URL}/register`, {
      name,
      email,
      password,
      phone_number: phoneNumber,
    });
  } catch (error) {
    console.error('Error during registration:', error);
    throw new Error('Registration failed. Email may already be taken.');
  }
}

export async function updateUser(token: string, userData: { name?: string; email?: string; phone_number?: string }): Promise<{ name: string; email: string; phone_number: string }> {
  try {
    const response = await axios.put(`${API_URL}/users/me`, userData, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error('Error updating user details:', error);
    throw new Error('Failed to update account details. Email may already be taken.');
  }
}

export async function fetchUserDetails(token: string): Promise<{ name: string; email: string; phone_number: string }> {
  try {
    const response = await axios.get(`${API_URL}/users/me`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching user details:', error);
    throw new Error('Failed to fetch user details.');
  }
}
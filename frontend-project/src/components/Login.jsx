import React, { useState } from 'react';
import axiosClient from '../axiosClient';

function Login({ setUser }) {
  const [isRegister, setIsRegister] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState(null);

  const validateInputs = () => {
    if (!username || !password) {
      setMessage({ type: 'error', text: 'Please fill all fields.' });
      return false;
    }
    if (password.length < 6) {
      setMessage({ type: 'error', text: 'Password must be at least 6 characters.' });
      return false;
    }
    if (isRegister && password !== confirmPassword) {
      setMessage({ type: 'error', text: 'Passwords do not match.' });
      return false;
    }
    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setMessage(null);

    if (!validateInputs()) return;

    if (isRegister) {
      // --- Registration Logic ---
      axiosClient.post('/register', { username, password })
        .then(() => {
          setMessage({ type: 'success', text: 'Registration successful! Log in now.' });
          setIsRegister(false);
          setPassword('');
          setConfirmPassword('');
        })
        .catch(() => {
          setMessage({ type: 'error', text: 'Registration failed.' });
        });
    } else {
      // --- Login Logic ---
      axiosClient.post('/login', { username, password })
        .then((res) => {
          setUser(res.data.user);
        })
        .catch(() => {
          setMessage({ type: 'error', text: 'Login failed. Check credentials.' });
        });
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form onSubmit={handleSubmit} className="p-6 bg-white rounded shadow-md w-80">
        <h2 className="text-xl font-bold mb-4 text-center">{isRegister ? 'Register' : 'Login'}</h2>

        {message && (
          <p className={`mb-3 p-2 rounded text-center ${
            message.type === 'error' ? 'bg-red-200 text-red-800' : 'bg-green-200 text-green-800'
          }`}>
            {message.text}
          </p>
        )}

        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="border p-2 mb-3 w-full rounded"
          required
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="border p-2 mb-3 w-full rounded"
          required
        />

        {isRegister && (
          <input
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="border p-2 mb-3 w-full rounded"
            required
          />
        )}

        <button
          type="submit"
          className={`mb-2 p-2 w-full rounded text-white ${
            isRegister ? 'bg-green-500 hover:bg-green-600' : 'bg-blue-500 hover:bg-blue-600'
          }`}
        >
          {isRegister ? 'Register' : 'Login'}
        </button>

        <p className="text-center text-sm">
          {isRegister ? 'Already have an account?' : "Don't have an account?"}{' '}
          <button
            type="button"
            onClick={() => {
              setIsRegister(!isRegister);
              setMessage(null);
            }}
            className="text-blue-500 hover:underline"
          >
            {isRegister ? 'Login' : 'Register'}
          </button>
        </p>
      </form>
    </div>
  );
}

export default Login;
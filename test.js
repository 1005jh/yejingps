import React, { useState } from 'react';
import './login.css';
import { useNavigate } from 'react-router-dom';
import Header from '../components/header';
import Button from '../components/button';

const Signup = () => {
  const [error, setError] = useState(false);
  const [users, setUsers] = useState('');
  const [nickname, setNickname] = useState('');
  const [password, setPassword] = useState('');

  const navigate = useNavigate();
  const baseURL = process.env.REACT_APP_SERVER_URL;
  const handleSignup = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(`${baseURL}/users/signup`, data, {
        withCredentials: true,
        headers: { 'Content-Type': 'application/json' },
      });

      if (response.status !== 200) {
        throw new Error('Signup failed');
      }

      const data = await response.json();
      console.log(data);
      navigate('/'); // Navigate to home page on successful signup
    } catch (error) {
      console.error('Error:', error);
      setError(true);
    }
  };

  return (
    <div className="login">
      <Header />
      <form onSubmit={handleSignup}>
        <input
          type="text"
          placeholder="이메일"
          onChange={(e) => setUsers(e.target.value)}
        />
        <input
          type="text"
          placeholder="닉네임"
          onChange={(e) => setNickname(e.target.value)}
        />
        <input
          type="password"
          placeholder="비밀번호"
          onChange={(e) => setPassword(e.target.value)}
        />
        <Button variant={'primary'} color={'white'} size={'md'} type="submit">
          가입하기
        </Button>
        {error && <span>회원가입에 실패하였습니다. 다시 시도해주세요!</span>}
      </form>
    </div>
  );
};

export default Signup;

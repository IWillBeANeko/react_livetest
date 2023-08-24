import React, { useState } from 'react';
import { Context, useContext } from './context';
import { useNavigate } from 'react-router-dom'
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';

function Login () {
  const navigate = useNavigate();
  const { getters, setters } = useContext(Context);
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  async function signIn () {
    const response = await fetch('http://localhost:5005/admin/auth/login', {
      method: 'POST',
      headers: {
        'Content-type': 'application/json',
      },
      body: JSON.stringify({
        email,
        password,
      })
    })
    const data = await response.json();
    if (data.error) {
      setters.setEmail('')
      setters.setPassword('')
      setters.setError('Login error: ' + data.error)
    } else {
      if (getters.email !== email || getters.password !== email) {
        setters.setEmail(email)
        setters.setPassword(password)
      }
      setters.setPage('in')
      setters.setToken(data.token)
      setters.setError('')
      localStorage.token = data.token
      navigate('/dashboard')
    }
  }
  return (
      <div>
          <Box
              component="form"
              sx={{
                '& > :not(style)': { m: 1, width: '25ch' },
              }}
              noValidate
              autoComplete="off"
          >
              <TextField id="outlined-basic" label="Email" variant="outlined" value={email} onChange={(e) => setEmail(e.target.value)}/><br/>
              <TextField id="outlined-basic1" label="Password" variant="outlined" type='password' value={password} onChange={(e) => setPassword(e.target.value)}/>
          </Box>
        <Button variant="outlined" size="small" onClick={signIn}>
          Login
        </Button>
      </div>
  );
}

function Register () {
  const navigate = useNavigate();
  const { getters, setters } = useContext(Context);
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  async function signUp () {
    const response = await fetch('http://localhost:5005/admin/auth/register', {
      method: 'POST',
      headers: {
        'Content-type': 'application/json',
      },
      body: JSON.stringify({
        email: getters.email,
        password: getters.password,
        name: getters.name
      })
    })
    const data = await response.json();
    if (data.error) {
      setters.setName('')
      setters.setEmail('')
      setters.setPassword('')
      setters.setError('Register error: ' + data.error)
    } else {
      if (getters.email !== email || getters.password !== email || getters.name !== name) {
        setters.setEmail(email)
        setters.setPassword(password)
        setters.setName(name)
      }
      setters.setPage('in')
      setters.setToken(data.token)
      setters.setError('')
      localStorage.token = data.token
      navigate('/dashboard')
    }
  }
  return (
      <div>
          <Box
              component="form"
              sx={{
                '& > :not(style)': { m: 1, width: '25ch' },
              }}
              noValidate
              autoComplete="off"
          >
              <TextField id="outlined-basic" label="Email" variant="outlined"
                         value={email} onChange={(e) => setEmail(e.target.value)}/><br/>
              <TextField id="outlined-basic1" label="Password" variant="outlined"
                         type='password' value={password} onChange={(e) => setPassword(e.target.value)}/><br/>
              <TextField id="outlined-basic2" label="Name" variant="outlined"
                         value={name} onChange={(e) => setName(e.target.value)}/>
          </Box>
          <Button variant="outlined" size="small" onClick={signUp}>
              Register
          </Button>
      </div>
  );
}
export { Login, Register };

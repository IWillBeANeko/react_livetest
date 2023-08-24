import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Context, useContext } from './context';
import Stack from '@mui/material/Stack';
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
import { Button } from '@mui/material';
import ButtonGroup from '@mui/material/ButtonGroup';

function Head1 () {
  const { getters } = useContext(Context);
  const navigate = useNavigate();
  function login () {
    navigate('/login')
  }
  function r () {
    navigate('/register')
  }
  return (
    <div>
      <ButtonGroup variant="text" aria-label="text button group">
        <Button onClick={login}>Sign in</Button>
        <Button name='register' onClick={r}>Sign up</Button>
      </ButtonGroup>
      {getters.error &&
      <Stack sx={{ width: '100%' }} spacing={2}>
        <Alert severity="error">
          <AlertTitle>Error</AlertTitle>
          <strong>{getters.error}</strong>
        </Alert>
      </Stack>}
    </div>
  )
}
function Head2 () {
  const navigate = useNavigate();
  const { getters, setters } = useContext(Context);
  async function logOut () {
    const response = await fetch('http://localhost:5005/admin/auth/logout', {
      method: 'POST',
      headers: {
        'Content-type': 'application/json',
        Authorization: `Bearer ${getters.token}`,
      }
    })
    const data = await response.json();
    if (!data.error) {
      navigate('/login')
      setters.setPage('out')
      setters.setToken('')
      localStorage.token = ''
      setters.setError('')
    } else {
      setters.setPage('out')
      setters.setToken('')
      localStorage.token = ''
      setters.setError('Log out error: ' + data.error)
    }
  }
  return (
        <div>
            <Button variant="contained" onClick={logOut}>log out</Button>
          {getters.error &&
          <Stack sx={{ width: '100%' }} spacing={2}>
            <Alert severity="error">
              <AlertTitle>Error</AlertTitle>
              <strong>{getters.error}</strong>
            </Alert>
          </Stack>
          }
        </div>
  )
}
export { Head2, Head1 };

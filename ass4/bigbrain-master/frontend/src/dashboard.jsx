import React, { useState } from 'react';
import { Context, useContext } from './context';
import { useNavigate } from 'react-router-dom'
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';

function Dashboard () {
  const { setters, getters } = useContext(Context);
  const navigate = useNavigate()
  const [q, setQ] = useState([])

  async function quiz () {
    const response = await fetch('http://localhost:5005/admin/quiz', {
      method: 'GET',
      headers: {
        'Content-type': 'application/json',
        Authorization: getters.token,
      }
    })
    const data = await response.json();
    if (!data.error) {
      setters.setError('')
      setQ(data.quizzes)
      let k = 0
      for (const i of data.quizzes) {
        const response = await fetch('http://localhost:5005/admin/quiz/' + i.id, {
          method: 'GET',
          headers: {
            'Content-type': 'application/json',
            Authorization: getters.token,
          }
        })
        const data = await response.json();
        if (!data.error) {
          setters.setError('')
          document.getElementById('l' + k).innerText = data.questions.length.toString()
          let sumTime = 0
          for (const j of data.questions) {
            sumTime = sumTime + parseInt(j.time)
          }
          document.getElementById('t' + k).innerText = sumTime.toString()
          k = k + 1
        } else {
          setters.setError('Get question error: ' + data.error)
        }
      }
    } else {
      setters.setError('Get quiz error: ' + data.error)
    }
  }

  async function create () {
    const response = await fetch('http://localhost:5005/admin/quiz/new', {
      method: 'POST',
      headers: {
        'Content-type': 'application/json',
        Authorization: getters.token,
      },
      body: JSON.stringify({
        name: document.getElementById('new').value
      })
    })
    const data = await response.json();
    if (!data.error) {
      const n = data.id
      setters.setQuiz(n)
      setters.setError('')
      await quiz()
    } else {
      setters.setError('Create error: ' + data.error)
    }
  }

  async function del () {
    const response = await fetch('http://localhost:5005/admin/quiz/' + document.getElementById('del').value, {
      method: 'DELETE',
      headers: {
        'Content-type': 'application/json',
        Authorization: getters.token,
      }
    })
    const data = response.json()
    if (!data.error) {
      setters.setError('')
      await quiz()
    } else {
      setters.setError('Delete quiz error: ' + data.error)
    }
  }

  function play () {
    navigate('/play/0')
  }

  React.useEffect(() => { quiz() }, [])
  return (
        <>
            Create: <input id='new' placeholder='please enter the quiz name'/><Button label='create' variant="contained" size="small" onClick={create}>create new quiz!</Button><br/>
            Join a game!: <Button label='join' variant="contained" size="small" onClick={play}>join</Button><br/>
            Delete: <input id='del' placeholder='please enter the quiz id'/><Button label='delete' variant="contained" size="small" onClick={del}>delete</Button><br/>
            <hr/>
            <div id='list'>
              Quiz list:<br/>
              {q.map((q, i) => (
                    <div key = {i} style={{ height: '350px', width: '400px', backgroundColor: 'rgb(215,236,255)' }}>
                      <hr/>
                        id: {q.id}<br/>
                        name: {q.name}<br/>
                      <img src ={q.thumbnail} alt = 'Thumbnail of the quiz' style ={{ width: '200px', height: '200px' }}/><br/>
                      number of questions: <span id = { 'l' + i }> </span>
                      <br/>
                      time limit: <span id = { 't' + i }> </span><br/>
                      <ButtonGroup variant="contained" aria-label="outlined primary button group">
                      <Button onClick={ () => {
                        setters.setId(q.name)// 其实ID是quiz的名字
                        setters.setThumbnail(q.thumbnail)
                        navigate('/edit/' + q.id)
                      }}>edit</Button>
                      <Button onClick={ async () => {
                        const response = await fetch('http://localhost:5005/admin/quiz/' + q.id, {
                          method: 'DELETE',
                          headers: {
                            'Content-type': 'application/json',
                            Authorization: getters.token,
                          }
                        })
                        const data = await response.json()
                        if (!data.error) {
                          setters.setError('')
                          await quiz()
                        } else {
                          setters.setError('Delete quiz error: ' + data.error)
                        }
                      }}>delete</Button>
                      <Button onClick={ async () => {
                        const response = await fetch('http://localhost:5005/admin/quiz/' + q.id + '/start', {
                          method: 'POST',
                          headers: {
                            'Content-type': 'application/json',
                            Authorization: getters.token,
                          }
                        })
                        const data = await response.json()
                        if (!data.error) {
                          setters.setError('')
                          const response = await fetch('http://localhost:5005/admin/quiz/' + q.id, {
                            method: 'GET',
                            headers: {
                              'Content-type': 'application/json',
                              Authorization: getters.token,
                            }
                          })
                          const data = await response.json()
                          if (!data.error) {
                            setters.setError('')
                            const session = data.active
                            setters.setSession(session)
                            navigate('/start/' + q.id)
                          } else {
                            setters.setError('Get session error: ' + data.error)
                          }
                        } else {
                          setters.setError('Start quiz error: ' + data.error)
                        }
                      }}>start</Button>
                      <Button onClick={ async () => {
                        const response = await fetch('http://localhost:5005/admin/quiz/' + q.id + '/end', {
                          method: 'POST',
                          headers: {
                            'Content-type': 'application/json',
                            Authorization: getters.token,
                          }
                        })
                        const data = await response.json()
                        if (!data.error) {
                          setters.setError('')
                          setters.setSession('')
                        } else {
                          setters.setError('End quiz error: ' + data.error)
                        }
                      }}>stop</Button>
                      </ButtonGroup>
                    </div>
              ))}
            </div>
        </>
  )
}

export default Dashboard;

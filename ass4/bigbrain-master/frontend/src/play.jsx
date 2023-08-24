import React, { useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom'
import { Context, useContext } from './context';
import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

function Play () {
  const c = useRef(100)
  const [started, setStarted] = React.useState(false)
  const [count, setCount] = React.useState(0)
  const [an, setAn] = React.useState('')
  const [result, setResult] = React.useState('')
  const qSaver = useRef({ question: { id: 0 } })
  const qLeft = useRef(100)
  const startSaver = useRef(false)
  const tSaver = useRef(-1)
  const [t, setT] = React.useState(-1)
  const [q, setQ] = React.useState({})// question
  const rAnswer = useRef([])
  const navigate = useNavigate()
  const params = useParams();
  const [name, setName] = useState('')
  const [session, setSession] = useState(params.name)
  const { setters, getters } = useContext(Context);
  const r = useRef([])

  const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
      backgroundColor: theme.palette.common.black,
      color: theme.palette.common.white,
    },
    [`&.${tableCellClasses.body}`]: {
      fontSize: 14,
    },
  }));

  const StyledTableRow = styled(TableRow)(({ theme }) => ({
    '&:nth-of-type(odd)': {
      backgroundColor: theme.palette.action.hover,
    },
    // hide last border
    '&:last-child td, &:last-child th': {
      border: 0,
    },
  }));

  function re () {
    for (let i = 0; i < 100; i++) {
      clearTimeout(i)
    }
    navigate('/dashboard')
  }

  async function hh (id) {
    if (id) {
      const response = await fetch('http://localhost:5005/play/' + id + '/status', {
        method: 'GET',
        headers: {
          'Content-type': 'application/json',
        }
      })
      const data = await response.json();
      if (!data.error) {
        if (data.error !== getters.error) {
          setters.setError('')
        }
        if (startSaver.current !== data.started) {
          startSaver.current = data.started
          setStarted(startSaver.current)
        }
      } else {
        setters.setError('Get status error: ' + data.error)
      }
    }
  }

  async function h (id) {
    if (startSaver.current && getters.player) {
      const responseQ = await fetch('http://localhost:5005/play/' + id + '/question', {
        method: 'GET',
        headers: {
          'Content-type': 'application/json',
        }
      })
      const dataQ = await responseQ.json();
      if (!dataQ.error) {
        if (getters.error) {
          setters.setError('')
        }
        if (qSaver.current.question.id !== dataQ.question.id) {
          const a = new Date().getTime();
          const b = new Date(dataQ.question.isoTimeLastQuestionStarted).getTime()
          qSaver.current = dataQ
          r.current.push({ question: qSaver.current.question.name, result: false, score: qSaver.current.question.point })
          setQ(qSaver.current)
          setAn('')
          tSaver.current = dataQ.question.time - Math.ceil((a - b) / 1000)
          setT(tSaver.current)
        }
      } else {
        if (dataQ.error === 'Session ID is not an active session') {
          qLeft.current = 0
        } else setters.setError('Get question error: ' + dataQ.error)
      }
    }
  }

  async function results (id) {
    if (startSaver.current && getters.player) {
      const response = await fetch('http://localhost:5005/play/' + id + '/results', {
        method: 'GET',
        headers: {
          'Content-type': 'application/json',
        }
      })
      const data = await response.json();
      if (!data.error) {
        if (getters.error) {
          setters.setError('')
        }
        setResult(data)
        for (let i = 0; i < r.current.length; i++) {
          r.current[i].result = data[i].correct
        }
        for (const i of r.current) {
          if (!i.result) {
            i.score = 0
          }
        }
      } else {
        setters.setError('Get results error: ' + data.error)
      }
    }
  }

  React.useEffect(() => {
    if ((t < 0.1 && t > -0.1) || t < -1) {
      setTimeout(() => answer(), 1000)
    }
  }, [t === 0])

  React.useEffect(() => {
    if (!startSaver.current) {
      setTimeout(() => { hh(getters.player) }, 1000)
    }
    if (startSaver.current) {
      setTimeout(() => {
        if (qLeft.current === 0 && result === '') {
          results(getters.player)
        }
        if (qLeft.current > 0) h(getters.player)
        if (tSaver.current > 0) {
          tSaver.current = tSaver.current - 1
          setT(tSaver.current)
        }
      }, 1000)
    }
  }, [count])

  React.useEffect(() => {
    setTimeout(() => { setCount(count - 1) }, 1000)
  }, [count])

  async function answer () {
    const response = await fetch('http://localhost:5005/play/' + getters.player + '/answer', {
      method: 'GET',
      headers: {
        'Content-type': 'application/json',
      }
    })
    const data = await response.json();
    if (!data.error) {
      setters.setError('')
      setAn(data.answerIds)
    } else {
      setters.setError('Get answer error: ' + data.error)
    }
  }

  async function putAnswer () {
    let a = []
    if (rAnswer.current.length === 0) {
      a = [0]
    } else if (rAnswer.current.length >= 1) {
      a = rAnswer.current
    }
    const response = await fetch('http://localhost:5005/play/' + getters.player + '/answer', {
      method: 'PUT',
      headers: {
        'Content-type': 'application/json',
      },
      body: JSON.stringify({
        answerIds: a
      })
    })
    const data = await response.json();
    if (!data.error) {
      setters.setError('')
    } else {
      setters.setError('Put answer error: ' + data.error)
    }
  }

  async function join () {
    const response = await fetch('http://localhost:5005/play/join/' + session, {
      method: 'POST',
      headers: {
        'Content-type': 'application/json',
      },
      body: JSON.stringify({
        name
      })
    })
    const data = await response.json();
    if (!data.error) {
      setters.setPlayer(data.playerId)
    } else {
      setters.setError('Join quiz error: ' + data.error)
    }
  }

  return (
      <>
        <button onClick={re}>Return</button><br/>
        {!getters.player &&
        <>
          {session === '0' &&
          <>
            Session id: <input value = {session} onChange={(e) => setSession(e.target.value)}/><br/>
            Your name: <input value ={name} onChange={(e) => setName(e.target.value)}/><br/>
            <button onClick={join}>Join the session!</button><br/>
          </>
          }
        </>
        }
        {!getters.player &&
        <>
          {session !== '0' &&
          <>
            Session id: <input defaultValue={session}/><br/>
            Your name: <input value ={name} onChange={(e) => setName(e.target.value)}/><br/>
            <button onClick={join}>Join the session!</button>
          </>
          }
        </>
        }
        {getters.player !== 0 &&
        <>
          {!started &&
          <>
            Please wait...
          </>
          }
        </>
        }
        {getters.player !== 0 && qLeft.current > 0 &&
        <div>
          {started &&
          <div>
            {q.question && result === '' && <>
            Question: { q.question.name }<br/>
            Question type: { q.question.type === 's' && <>Single choice</> }
            { q.question.type === 'm' && <>Multi choice</> }<br/>
            { q.question.img && <>Img: <img src = { q.question.img } style={{ width: '200px', height: '200px' }} alt = 'Question img'/></> }<br/>
            { q.question.video && <>Video: <iframe src = { q.question.video } style={{ width: '400px', height: '250px' }}> </iframe></> }
              Question point: { q.question.point }<br/>
              Time left: {t} <br/>
              Answers: {q.question.answer.map((an, i) => {
              c.current = c.current + 1
              return <div key = { i }>
                <input type="checkbox" onChange={ (e) => {
                  if (e.target.checked) {
                    rAnswer.current.push(i + 1)
                  } else {
                    rAnswer.current = rAnswer.current.filter(function (item) {
                      return item !== i + 1;
                    });
                  }
                  putAnswer()
                }
                }/> answer{i + 1}: { an[i + 1] }
              <br/>
              </div>
            })} </>}
          </div>
          }
        </div>
        }

        {t === 0 && an && qLeft.current > 0 &&
        <>
          The correct answer is/are:<br/>
          {q.question.answer.map((a, i) => {
            for (const j of an) {
              if (i === j - 1) {
                c.current = c.current + 1
                return <div key = { i + 6 }>
                  { a[i + 1][0] }
                  <br/>
                </div>
              }
            }
            return <hr key = {i + 12}/>
          })}
        </>
        }
        {!qLeft.current &&
        <>
          Your score is:
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 300 }} aria-label="customized table">
              <TableHead>
                <TableRow>
                  <StyledTableCell>Question</StyledTableCell>
                  <StyledTableCell align="right">result</StyledTableCell>
                  <StyledTableCell align="right">score</StyledTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {r.current.map((row) => (
                    <StyledTableRow key={row.question}>
                      <StyledTableCell component="th" scope="row">
                        {row.question}
                      </StyledTableCell>
                      <StyledTableCell align="right">{row.result.toString()}</StyledTableCell>
                      <StyledTableCell align="right">{row.score}</StyledTableCell>
                    </StyledTableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </>
        }
      </>
  )
}

export default Play;

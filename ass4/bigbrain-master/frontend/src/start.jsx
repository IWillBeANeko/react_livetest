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

function Start () {
  const { setters, getters } = useContext(Context);
  const params = useParams();
  const name = params.name
  const navigate = useNavigate()
  const [result, setResult] = useState('')
  const [que, setQue] = useState({})
  const r = useRef([])
  const q = useRef({ id: 0 })
  const rows = useRef([])
  const row = useRef([])
  const player = useRef([])
  const [s, setS] = useState(0)

  async function question () {
    const response = await fetch('http://localhost:5005/admin/session/' + getters.session + '/status', {
      method: 'GET',
      headers: {
        'Content-type': 'application/json',
        Authorization: getters.token,
      }
    })
    const data = await response.json()
    if (!data.error) {
      if (data.results.position > -1) {
        if (data.results.position === data.results.questions.length) {
          await results(getters.session)
          setters.setSession('')
          q.current = ({ id: 0 })
          setQue({})
        } else {
          q.current = data.results.questions[data.results.position]
          setQue(q.current)
          const a = { question: q.current.name, score: q.current.point, result: [] }
          r.current.push(a)
          setResult('')
          setters.setError('')
          console.log(q.current)
        }
      }
      setters.setError('')
    } else {
      setters.setError('Get question error: ' + data.error)
    }
  }

  async function advance () {
    const response = await fetch('http://localhost:5005/admin/quiz/' + name + '/advance', {
      method: 'POST',
      headers: {
        'Content-type': 'application/json',
        Authorization: getters.token,
      }
    })
    const data = await response.json()
    if (!data.error) {
      setters.setError('')
      if (getters.session) await question()
    } else {
      setters.setError('Advance question error: ' + data.error)
    }
  }

  async function results () {
    const response = await fetch('http://localhost:5005/admin/session/' + getters.session + '/results', {
      method: 'GET',
      headers: {
        'Content-type': 'application/json',
        Authorization: getters.token,
      }
    })
    const data = await response.json()
    if (!data.error) {
      q.current = { id: 0 }
      setResult('1')
      for (let o = 0; o < r.current.length; o++) {
        for (const p of data.results) {
          const a = new Date(p.answers[o].answeredAt).getTime()
          const b = new Date(p.answers[o].questionStartedAt).getTime()
          r.current[o].result.push({ player: p.name, time: (a - b) / 1000, correct: p.answers[o].correct })
          if (o === 0) {
            player.current.push(p.name)
          }
        }
      }
      setters.setError('')
    } else {
      setters.setError('Get results error: ' + data.error)
    }
  }

  async function stop () {
    const response = await fetch('http://localhost:5005/admin/quiz/' + name + '/end', {
      method: 'POST',
      headers: {
        'Content-type': 'application/json',
        Authorization: getters.token,
      }
    })
    const data = await response.json()
    if (!data.error) {
      await results(getters.session)
      setters.setError('')
      setters.setSession('')
      setQue({})
      q.current = { id: 0 }
    } else {
      setters.setError('End quiz error: ' + data.error)
    }
  }

  function re () {
    q.current = { id: 0 }
    setQue({})
    navigate('/dashboard')
  }

  function view () {
    q.current = { id: 0 }
    setS(1)
  }

  React.useEffect(() => {
    if (getters.session) question()
  }, [])

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

  if (!q.current.id && result) {
    console.log(s)
    const score = []
    rows.current = []
    row.current = []
    for (let i = 0; i < player.current.length; i++) {
      score.push(0)
    }
    for (const i of r.current) {
      for (const j of i.result) {
        const a = player.current.indexOf(j.player)
        if (j.correct) score[a] = score[a] + parseInt(i.score)
      }
    }
    for (let i = 0; i < score.length; i++) {
      rows.current.push({ score: score[i], name: player.current[i] })
    }
    rows.current = rows.current.sort((a, b) => a.score < b.score ? 1 : a.score > b.score ? -1 : 0)
    for (const i of r.current) {
      let time = 0
      for (const j of i.result) {
        if (j.time !== 0) time = time + j.time
      }
      if (time === 0) {
        time = 'No player answered'
      } else {
        time = time / player.current.length
      }
      row.current.push({ question: i.question, time })
      console.log(row.current)
    }
  }

  return (
      <>
        <button onClick={re}>Return</button>
        <button onClick={advance}>Next</button>
        <button onClick={stop}>Stop</button>
        <div>
          {(!q.current.id && getters.session && s === 0) &&
            <>
              <div>session id: {getters.session}</div> <br />
              <button onClick={
                () => navigator.clipboard.writeText(window.location.href.split('/')[0] + '//' + window.location.href.split('/')[2] + '/play/' + getters.session)
              //  copy
              }>Click to copy URL to this quiz</button>
            </>
          }
        </div>
        <div>
          {q.current.id !== 0 && !result &&
          <>
            <div>session id: {getters.session}</div> <br />
            question: {que.name} <br/>
            type: {(q.current.type === 's') && 'Single choice'} {(q.current.type === 'm') && 'Multi choices'}
            <br/>
            point: {q.current.point}<br/>
            Time limit: {q.current.time}s<br/>
            {q.current.img &&
              <>
                img: <img src={q.current.img} style={{ width: '200px', height: '200px' }} alt=''/><br/>
              </>
            }
            {q.current.video &&
            <>
              video: <iframe src={q.current.video} style={{ width: '400px', height: '250px' }}/><br/>
            </>
            }
            answers: <br/>
           {q.current.answer && q.current.answer.map((an, i) => {
             return <div key = { i }>answer{i + 1}: { an[i + 1] }
                <br/>
                     </div>
           })}<br/>
            correct: {q.current.correct && q.current.correct.join(', ')}
          </>
          }
        </div>
        <div>
          {(!q.current.id && result && s === 0) &&
              <>
                Do you wish to see the results?
                <button onClick={view}>Yse</button>
                <button onClick={re}>No</button>
              </>
          }

          {(!q.current.id && result && s === 1) &&
          <>
            Top 5 players:
            <TableContainer component={Paper}>
              <Table sx={{ minWidth: 40 }} aria-label="customized table">
                <TableHead>
                  <TableRow>
                    <StyledTableCell>Player</StyledTableCell>
                    <StyledTableCell align="right">Score</StyledTableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {rows.current.map((row, i) => (
                      <StyledTableRow key={i}>
                        <StyledTableCell component="th" scope="row">
                          {row.name}
                        </StyledTableCell>
                        <StyledTableCell align="right">{row.score}</StyledTableCell>
                      </StyledTableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer><br/>
            Mean response time:
            <TableContainer component={Paper}>
              <Table sx={{ minWidth: 40 }} size="small" aria-label="a dense table">
                <TableHead>
                  <TableRow>
                      <StyledTableCell>Question</StyledTableCell>
                    <StyledTableCell align="right">Answer time</StyledTableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {row.current.map((row) => (
                      <TableRow
                          key={row.question}
                          sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                      >
                        <TableCell component="th" scope="row">
                          {row.question}
                        </TableCell>
                        <TableCell align="right">{row.time}</TableCell>
                      </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </>
          }
        </div>
      </>
  )
}

export default Start;

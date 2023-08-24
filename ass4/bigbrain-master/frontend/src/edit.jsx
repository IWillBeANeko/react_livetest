import React, { useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom'
import { Context, useContext } from './context';
import { fileToDataUrl } from './helpers.jsx';

function Edit () {
  const { setters, getters } = useContext(Context);
  const quiz = useRef([])
  const params = useParams();
  const name = params.name
  const navigate = useNavigate();
  const [q, setQ] = useState([])

  async function edit (temp, d) {
    if (temp) {
      setters.setQuiz(temp)
      quiz.current = temp
    }
    if (d) {
      setters.setQuiz(temp)
    } else temp = getters.quiz
    const response = await fetch('http://localhost:5005/admin/quiz/' + name, {
      method: 'PUT',
      headers: {
        'Content-type': 'application/json',
        Authorization: getters.token,
      },
      body: JSON.stringify({
        questions: temp,
        name: getters.id,
        thumbnail: getters.thumbnail,
      })
    })
    const data = await response.json();
    if (!data.error) {
      setters.setError('')
      await list()
      if (d === 'r') navigate('/dashboard')
    } else {
      setters.setError('Edit quiz error: ' + data.error)
    }
  }

  async function list () {
    const response = await fetch('http://localhost:5005/admin/quiz/' + name, {
      method: 'GET',
      headers: {
        'Content-type': 'application/json',
        Authorization: getters.token,
      }
    })
    const data = await response.json();
    setters.setId(data.name)
    setters.setThumbnail(data.thumbnail)
    quiz.current = [...data.questions]
    setters.setQuiz([...data.questions])
    if (!data.error) {
      setters.setError('')
      setQ(data.questions)
    } else {
      setters.setError('Load questions error: ' + data.error)
    }
  }

  function re () {
    navigate('/dashboard')
  }

  async function question () {
    const title = document.getElementById('questionTitle').value
    const response = await fetch('http://localhost:5005/admin/quiz/' + name, {
      method: 'PUT',
      headers: {
        'Content-type': 'application/json',
        Authorization: getters.token,
      },
      body: JSON.stringify({
        questions: [{
          id: Math.round(Math.random() * 100000000),
          name: title,
          type: '',
          time: 0,
          point: 0,
          video: '',
          img: '',
          answer: [],
          correct: []
        }, ...getters.quiz],
        name: getters.name,
        thumbnail: getters.thumbnail,
      })
    })
    const data = await response.json();
    if (!data.error) {
      await list()
      setters.setError('')
    } else {
      setters.setError('Edit quiz error: ' + data.error)
    }
  }

  React.useEffect(() => { list() }, [])

  return (
        <>
          <div>
              name: <input value={getters.id} onChange={(e) => setters.setId(e.target.value)}/><br/>
              thumbnail:<br/>
              {getters.thumbnail &&
                 <img src = {getters.thumbnail} style={{ width: '200px', height: '200px' }} alt = 'thumbnail'/>
              }
              <br/>
              change the thumbnail: <input type='file' id='img' onChange={async (e) => { setters.setThumbnail(await fileToDataUrl(e.target.files[0])) }}/><br/>
              <br/>
          </div>
            <button onClick={ () => {
              edit(getters.quiz, 'r')
            }}>Submit</button>
            <button onClick={re}>Return</button>
            <br/>
            <br/>
            <input id='questionTitle'/> <button onClick={question}>Add a new question!</button><br/>
            Question list: <br/><br/>
          {q.map((q, i) => (
              <div key = {i}>
              id: {q.id}<br/>
              name: {q.name}<br/>
                type: {q.type}<br/>
                time: {q.time}<br/>
                point: {q.point}<br/>
                {q.img &&
                    <>
                <img src ={q.img} alt = 'question image' style = {{ width: '200px', height: '200px' }} />
                  <br/>
                    </>
                }
                {q.video &&
                    <>
                <iframe src ={q.video} style = {{ width: '400px', height: '250px' }} />
                      <br/>
                </>
                }
                answers:<br/>
                {q.answer[0] &&
                    <div>answer 1: {q.answer[0][1]}</div>
                }
                {q.answer[1] &&
                <div>answer 2: {q.answer[1][2]}</div>
                }
                {q.answer[2] &&
                <div>answer 3: {q.answer[2][3]}</div>
                }
                {q.answer[3] &&
                <div>answer 4: {q.answer[3][4]}</div>
                }
                {q.answer[4] &&
                <div>answer 5: {q.answer[4][5]}</div>
                }
                {q.answer[5] &&
                <div>answer 6: {q.answer[5][6]}</div>
                }<br/>
                correct: {q.correct.join(', ')}<br/>
                <button onClick={
                  () => {
                    setters.setQname(q.name)
                    setters.setQtype(q.type)
                    setters.setQtime(q.time)
                    setters.setQpoint(q.point)
                    setters.setQimg(q.img)
                    setters.setQvideo(q.video)
                    for (const k of q.answer) {
                      if (k[1]) setters.setQanswer1(k[1][0])
                      if (k[2]) setters.setQanswer2(k[2][0])
                      if (k[3]) setters.setQanswer3(k[3][0])
                      if (k[4]) setters.setQanswer4(k[4][0])
                      if (k[5]) setters.setQanswer5(k[5][0])
                      if (k[6]) setters.setQanswer6(k[6][0])
                    }
                    setters.setQcorrect(q.correct)
                    navigate('/question/' + q.id + '+' + name)
                  }
                }>edit</button>
                <button onClick={ async () => {
                  const temp = []
                  const response = await fetch('http://localhost:5005/admin/quiz/' + name, {
                    method: 'GET',
                    headers: {
                      'Content-type': 'application/json',
                      Authorization: getters.token,
                    }
                  })
                  const data = await response.json();
                  for (const k of data.questions) {
                    if (k.id === q.id) {
                      continue
                    } else {
                      temp.push(k)
                    }
                  }
                  setters.setQuiz(temp)
                  await edit(temp, 'd')
                }
                }>delete</button>
                <hr/>
                </div>
          ))}
        </>
  )
}

export default Edit;

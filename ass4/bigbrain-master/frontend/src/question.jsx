import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Context, useContext } from './context';
import { fileToDataUrl } from './helpers.jsx';
// 刷新之后东西会全部消失需要重新获取getters的
function Question () {
  const { setters, getters } = useContext(Context);
  const navigate = useNavigate();
  const params = useParams();
  const name = params.name.split('+')
  const [success, setSuccess] = useState(0)

  async function sub () {
    const an = []
    for (let i = 1; i < 7; i++) {
      if (document.getElementById(i.toString()).checked && document.getElementById(i.toString() + i.toString()).value) {
        an.push(i)
      }
    }
    let flag = 1
    for (let i = 1; i < 7; i++) {
      for (let j = 1; j < i; j++) {
        if (document.getElementById(i.toString() + i.toString()).value && !document.getElementById(j.toString() + j.toString()).value) {
          flag = 0
        }
      }
    }
    if (!flag) {
      setters.setError('Interlaced input is not allowed')
    } else {
      setters.setQcorrect(an)
      const ne = {
        id: name[0],
        name: getters.qname,
        type: getters.qtype,
        time: getters.qtime,
        point: getters.qpoint,
        video: getters.qvideo,
        img: getters.qimg,
        answer: [],
        correct: an
      }
      if (getters.qanswer1) ne.answer.push({ 1: getters.qanswer1 })
      if (getters.qanswer2) ne.answer.push({ 2: getters.qanswer2 })
      if (getters.qanswer3) ne.answer.push({ 3: getters.qanswer3 })
      if (getters.qanswer4) ne.answer.push({ 4: getters.qanswer4 })
      if (getters.qanswer5) ne.answer.push({ 5: getters.qanswer5 })
      if (getters.qanswer6) ne.answer.push({ 6: getters.qanswer6 })
      if (getters.qtype === 'n' || getters.qtype === '') {
        setters.setError('Please select question type')
      } else if (an.length < 1) {
        setters.setError('Please select the right answer')
      } else if (getters.qtype === 's' && an.length > 1) {
        setters.setError('Please select only one right answer')
      } else if (getters.qtype === 'm' && an.length < 2) {
        setters.setError('Please select multi right answers')
      } else if (ne.answer.length < 2) {
        setters.setError('Please enter at least 2 answers')
      } else {
        setters.setError('')
        const temp = []
        for (const i of getters.quiz) {
          if (parseInt(i.id) !== parseInt(name[0])) {
            temp.push(i)
          } else {
            temp.push(ne)
          }
        }
        setters.setQuiz(temp)
        const response = await fetch('http://localhost:5005/admin/quiz/' + name[1], {
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
          setSuccess(1)
        } else {
          setters.setError('Edit question error: ' + data.error)
        }
      }
    }
  }

  function re () {
    navigate('/edit/' + name[1])
  }

  return (
      <>
        {!success &&
        <div>
          <button onClick={re}>Return</button>
          <br/>
          <div id='question'>
            name: <input value={getters.qname} onChange={(e) => setters.setQname(e.target.value)}/><br/>
            type: <select value={getters.qtype} onChange={(e) => setters.setQtype(e.target.value)}>
            <option value='n'>--Please select type--</option>
            <option value='s'>Single answer</option>
            <option value='m'>Multi answers</option>
          </select><br/>
            time: <input type='number' value={getters.qtime} onChange={(e) => setters.setQtime(e.target.value)}/><br/>
            point: <input type='number' value={getters.qpoint} onChange={(e) => setters.setQpoint(e.target.value)}/><br/>
            img: <input type='file' id='qimg' onChange={async (e) => {
            setters.setQimg(await fileToDataUrl(e.target.files[0]))
          }}/><br/>
            video: <input type="text" placeholder='Please enter youtube URL' value={getters.qvideo}
                          onChange={(e) => setters.setQvideo(e.target.value)}/><br/>
            Please enter 2 ~ 6 answers:<br/>
            Select the checkbox before right answers<br/>
            answers1:<input type="checkbox" id='1'/>
            <input id='11' value={getters.qanswer1} onChange={(e) => setters.setQanswer1(e.target.value)}/><br/>
            answers2:<input type="checkbox" id='2'/>
            <input id='22' value={getters.qanswer2} onChange={(e) => setters.setQanswer2(e.target.value)}/><br/>
            answers3:<input type="checkbox" id='3'/>
            <input id='33' value={getters.qanswer3} onChange={(e) => setters.setQanswer3(e.target.value)}/><br/>
            answers4:<input type="checkbox" id='4'/>
            <input id='44' value={getters.qanswer4} onChange={(e) => setters.setQanswer4(e.target.value)}/><br/>
            answers5:<input type="checkbox" id='5'/>
            <input id='55' value={getters.qanswer5} onChange={(e) => setters.setQanswer5(e.target.value)}/><br/>
            answers6:<input type="checkbox" id='6'/>
            <input id='66' value={getters.qanswer6} onChange={(e) => setters.setQanswer6(e.target.value)}/><br/>
            <div id='questionE'> </div>
          </div>
          <button onClick={sub}>Submit</button>
          <br/>
        </div>
      }
        {success === 1 &&
            <>
              Your submit succeed!<br/>
              <button onClick={re}>OK</button>
            </>
        }
      </>
  )
}

export default Question;

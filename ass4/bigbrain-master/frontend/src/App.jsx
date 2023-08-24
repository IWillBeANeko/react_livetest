import React from 'react';
import {
  BrowserRouter,
  Routes,
  Route,
} from 'react-router-dom';
import { Head1, Head2 } from './header.jsx';
import { Login, Register } from './login.jsx';
import Dashboard from './dashboard.jsx';
import Edit from './edit.jsx';
import Question from './question.jsx';
import Start from './start.jsx';
import Play from './play.jsx';
import { Context, initialValue } from './context';

function App () {
  const [page, setPage] = React.useState(initialValue.page)
  const [email, setEmail] = React.useState(initialValue.email)
  const [password, setPassword] = React.useState(initialValue.password)
  const [name, setName] = React.useState(initialValue.name)
  const [token, setToken] = React.useState(initialValue.token)
  const [error, setError] = React.useState(initialValue.error)
  const [quiz, setQuiz] = React.useState(initialValue.quiz)
  const [id, setId] = React.useState(initialValue.id)
  const [thumbnail, setThumbnail] = React.useState(initialValue.thumbnail)
  const [qname, setQname] = React.useState(initialValue.qname)
  const [qtype, setQtype] = React.useState(initialValue.qtype)
  const [qtime, setQtime] = React.useState(initialValue.qtime)
  const [qpoint, setQpoint] = React.useState(initialValue.qpoint)
  const [qimg, setQimg] = React.useState(initialValue.qimg)
  const [qvideo, setQvideo] = React.useState(initialValue.qvideo)
  const [qanswer1, setQanswer1] = React.useState(initialValue.qanswer1)
  const [qanswer2, setQanswer2] = React.useState(initialValue.qanswer2)
  const [qanswer3, setQanswer3] = React.useState(initialValue.qanswer3)
  const [qanswer4, setQanswer4] = React.useState(initialValue.qanswer4)
  const [qanswer5, setQanswer5] = React.useState(initialValue.qanswer5)
  const [qanswer6, setQanswer6] = React.useState(initialValue.qanswer6)
  const [qcorrect, setQcorrect] = React.useState(initialValue.qcorrect)
  const [session, setSession] = React.useState(initialValue.session)
  const [player, setPlayer] = React.useState(initialValue.player)
  const getters = {
    page,
    email,
    password,
    name,
    token,
    error,
    quiz,
    id,
    thumbnail,
    qname,
    qtype,
    qtime,
    qpoint,
    qimg,
    qvideo,
    qanswer1,
    qanswer2,
    qanswer3,
    qanswer4,
    qanswer5,
    qanswer6,
    qcorrect,
    session,
    player,
  };
  const setters = {
    setPage,
    setEmail,
    setPassword,
    setName,
    setToken,
    setError,
    setQuiz,
    setId,
    setThumbnail,
    setQname,
    setQtype,
    setQtime,
    setQpoint,
    setQimg,
    setQvideo,
    setQanswer1,
    setQanswer2,
    setQanswer3,
    setQanswer4,
    setQanswer5,
    setQanswer6,
    setQcorrect,
    setSession,
    setPlayer,
  };
  React.useEffect(() => {
    if (localStorage.token) {
      setToken(localStorage.token);
      setEmail(getters.email);
      setPage('in')
    } else {
      setPage('out')
    }
  }, [])
  return (
    <Context.Provider value={{ getters, setters }}>
      <BrowserRouter>
        {getters.page === 'in'
          ? (
                <>
                  <Head2 />
                </>
            )
          : (
                <>
                  <Head1 />
                </>
            )
        }
        <hr />
        <Routes>
        {getters.page === 'in'
          ? (
              <>
                <Route path='/dashboard' element={<Dashboard />}/>
                <Route path='/edit/:name' element={<Edit />}/>
                <Route path='/question/:name' element={<Question/>}/>
                <Route path='/start/:name' element={<Start/>}/>
                <Route path='/play/:name' element={<Play/>}/>
              </>
            )
          : (
              <>
                <Route path='/' element={<Login />} />
                <Route path='/login' element={<Login/>}/>
                <Route path='/register' element={<Register/>}/>
              </>
            )
        }
        </Routes>
      </BrowserRouter>
    </Context.Provider>
  );
}

export default App;

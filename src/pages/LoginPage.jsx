import { useEffect, useState } from 'react'
import css from './registerpage.module.css'
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { setUserInfo } from '../store/userSlice'
import { loginUser } from '../apis/userApi'

export const LoginPage = () => {
  const dispatch = useDispatch()
  const [formData, setFormData] = useState({ username: '', password: '' })
  const [errorData, setErrorData] = useState({
    username: '',
    password: '',
  })

  const [loginStatus, setLoginStatus] = useState('')
  const [redirect, setRedirect] = useState('')
  const navigate = useNavigate()

  const validate = (name, value) => {
    let message = ''

    if (!value) {
      message = '내용을 입력해주세요'
      return
    }

    if (name === 'username') {
      if (!/^[a-zA-Z][a-zA-Z0-9]{3,}$/.test(value)) {
        message = '영문으로 시작하고 4자 이상이어야 합니다.'
      }
    }

    if (name === 'password') {
      if (value.length < 4) {
        message = '4자 이상이어야 합니다.'
      }
    }

    setErrorData(prev => ({ ...prev, [name]: message }))
  }

  const handleChange = e => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
    validate(name, value)
  }

  const login = async e => {
    e.preventDefault()
    setLoginStatus('')
    validate('username', formData.username)
    validate('password', formData.password)

    if (errorData.password || errorData.username || !formData.username || !formData.password) {
      setLoginStatus('아이디와 패스워드를 확인하세요')
      return
    }

    try {
      const userData = await loginUser({ username: formData.username, password: formData.password })
      // 서버에서 json으로 보낸 id와 username
      if (userData) {
        setLoginStatus('로그인 성공')
        // redux에서 상태 변경할 때 액션을 dispatch하여 사용
        dispatch(setUserInfo(userData))
        setTimeout(() => {
          setRedirect(true)
        }, 1000)
      } else {
        setLoginStatus('사용자가 없습니다')
      }
    } catch (err) {
      console.error(err)
      setLoginStatus(err.response?.data?.error || '로그인 실패')
    } finally {
      setLoginStatus('')
    }
  }

  useEffect(() => {
    if (redirect) {
      navigate('/')
    }
  }, [redirect, navigate])

  return (
    <main className={css.loginpage}>
      <h2>로그인 페이지</h2>
      {loginStatus && <strong>{loginStatus}</strong>}
      <form className={css.container} onSubmit={login}>
        <input type="text" placeholder="아이디" name="username" onChange={handleChange} />
        <strong>{errorData.username}</strong>
        <input type="password" placeholder="비밀번호" name="password" onChange={handleChange} />
        <strong>{errorData.password}</strong>
        <button>로그인</button>
      </form>
    </main>
  )
}

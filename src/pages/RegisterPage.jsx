import { useState } from 'react'
import css from './registerpage.module.css'
import { useNavigate } from 'react-router-dom'
import { registerUser } from '../apis/userApi'

export const RegisterPage = () => {
  const [formData, setFormData] = useState({ username: '', password: '', confirmPassword: '' })
  const [errorData, setErrorData] = useState({
    username: '',
    password: '',
    confirmPassword: '',
  })
  const [registerState, setRegisterState] = useState('')

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

    if (name === 'confirmPassword') {
      if (value !== formData.password) {
        message = '비밀번호가 일치하지 않습니다'
      }
    }

    setErrorData(prev => ({ ...prev, [name]: message }))
  }

  const handleChange = e => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
    validate(name, value)
  }

  const register = async e => {
    e.preventDefault()
    validate('username', formData.username)
    validate('password', formData.password)
    validate('confirmPassword', formData.confirmPassword)

    if (
      errorData.username ||
      errorData.password ||
      errorData.confirmPassword ||
      !formData.username ||
      !formData.password ||
      !formData.confirmPassword
    ) {
      return
    }

    try {
      setRegisterState('등록중')
      const response = await registerUser({
        username: formData.username,
        password: formData.password,
      })

      setRegisterState('등록완료')

      navigate('/login')
    } catch (error) {
      setRegisterState('회원가입 실패')
      if (error.response) {
        console.log(error.response.data)
      }
    }
  }

  return (
    <main className={css.registerpage}>
      <h2>RegisterPage</h2>
      {registerState && <strong>{registerState}</strong>}
      <form className={css.container} onSubmit={register}>
        <input type="text" name="username" placeholder="사용자명" onChange={handleChange} />
        <strong>{errorData.username}</strong>
        <input type="password" name="password" placeholder="패스워드" onChange={handleChange} />
        <strong>{errorData.password}</strong>
        <input
          type="password"
          name="confirmPassword"
          placeholder="패스워드 확인"
          onChange={handleChange}
        />
        <strong>{errorData.confirmPassword}</strong>
        <button type="submit">가입하기</button>
      </form>
    </main>
  )
}

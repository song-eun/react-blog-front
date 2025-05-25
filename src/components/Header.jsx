import { Link, NavLink } from 'react-router-dom'
import css from './header.module.css'
import { useDispatch, useSelector } from 'react-redux'
import { useEffect, useState } from 'react'
import { getUserProfile, logoutUser } from '../apis/userApi'
import { setUserInfo } from '../store/userSlice'

export const Header = () => {
  const [isMenuActive, setIsMenuActive] = useState(false)
  const dispatch = useDispatch()
  const user = useSelector(state => state.user.info)
  const username = user?.username
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const getProfile = async () => {
      try {
        setIsLoading(true)
        const userData = await getUserProfile()
        if (userData) {
          dispatch(setUserInfo(userData))
        }
        // 쿠키가 있으면 로그인 상태
      } catch (error) {
        console.log(error)
        dispatch(setUserInfo(''))
      } finally {
        setIsLoading(false)
      }
    }
    getProfile()
  }, [dispatch])

  const handleLogout = async () => {
    try {
      await logoutUser()
      dispatch(setUserInfo(''))
      setIsMenuActive(false)
    } catch (error) {
      console.log(error)
      dispatch(setUserInfo(''))
    }
  }

  const toggleMenu = () => {
    setIsMenuActive(prev => !prev)
  }

  const closeMenu = () => {
    setIsMenuActive(false)
  }

  const handleBackgroundClick = e => {
    if (e.target === e.currentTarget) {
      closeMenu()
    }
  }

  const handleGnbClick = e => {
    e.stopPropagation()
  }

  return (
    <header className={css.header}>
      <h1>
        <Link to={'/'}>StudyLog</Link>
      </h1>
      {isLoading ? (
        <div>로딩중...</div>
      ) : (
        <>
          <Hamburger isMenuActive={isMenuActive} toggleMenu={toggleMenu} />
          <nav className={css.gnbCon} onClick={handleBackgroundClick}>
            <div className={css.gnb} onClick={handleGnbClick}>
              {username ? (
                <>
                  <Link to={'/createPost'} onClick={closeMenu}>
                    글쓰기
                  </Link>
                  <MenuLink to="/mypage" label="마이페이지" closeMenu={closeMenu} />
                  <button onClick={handleLogout}>로그아웃</button>
                </>
              ) : (
                <>
                  <MenuLink to="/login" label="로그인" closeMenu={closeMenu} />
                  <MenuLink to="/register" label="회원가입" closeMenu={closeMenu} />
                </>
              )}
            </div>
          </nav>
        </>
      )}
    </header>
  )
}

const MenuLink = ({ to, label, closeMenu }) => (
  <NavLink to={to} className={({ isActive }) => (isActive ? css.active : '')} onClick={closeMenu}>
    {label}
  </NavLink>
)

const Hamburger = ({ isMenuActive, toggleMenu }) => {
  return (
    <button className={`${css.hamburger} ${isMenuActive ? css.active : ''}`} onClick={toggleMenu}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="currentColor"
        className="bi bi-list"
        viewBox="0 0 16 16"
      >
        <path
          fillRule="evenodd"
          d="M2.5 12a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5m0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5m0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5"
        />
      </svg>
    </button>
  )
}

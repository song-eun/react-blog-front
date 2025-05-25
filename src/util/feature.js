export const validateForm = (name, value, password) => {
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
    if (value !== password) {
      message = '비밀번호가 일치하지 않습니다'
    }
  }

  return message
}

export const formatDate = date => {
  const d = new Date(date)
  const year = d.getFullYear()
  // getMonth()는 0부터 시작하므로 1을 더하고, 10보다 작으면 앞에 0 추가
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')

  return `${year}. ${month}. ${day}`
}

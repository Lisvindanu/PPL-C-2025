export function validateEmail(value) {
  if (!value) return 'Email is required'
  const re = /[^\s@]+@[^\s@]+\.[^\s@]+/
  return re.test(value) ? '' : 'Invalid email format'
}

export function validatePassword(value) {
  if (!value) return 'Password is required'
  if (value.length < 8) return 'Minimum 8 characters'
  if (!/[A-Za-z]/.test(value) || !/\d/.test(value)) return 'Use letters and numbers'
  return ''
}

export function validateName(value, label = 'This field') {
  if (!value) return `${label} is required`
  return ''
}



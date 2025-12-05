export function validateEmail(value) {
  if (!value) return 'Email diperlukan'
  const re = /[^\s@]+@[^\s@]+\.[^\s@]+/
  return re.test(value) ? '' : 'Format email tidak valid'
}

export function validatePassword(value) {
  if (!value) return 'Kata sandi diperlukan'
  if (value.length < 8) return 'Minimal 8 karakter'
  if (!/[A-Za-z]/.test(value)) return 'Kata sandi harus mengandung setidaknya satu huruf'
  if (!/\d/.test(value)) return 'Kata sandi harus mengandung setidaknya satu angka'
  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~`]/.test(value)) return 'Kata sandi harus mengandung setidaknya satu simbol'
  return ''
}

export function validateName(value, label = 'This field') {
  if (!value) return `${label} is required`
  return ''
}



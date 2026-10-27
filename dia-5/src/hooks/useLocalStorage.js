import { useEffect, useState } from 'react'

export function useLocalStorage(key, initialValue) {
  // A função dentro do useState só roda na primeira renderização
  const [value, setValue] = useState(() => {
    const saved = localStorage.getItem(key)
    return saved ? JSON.parse(saved) : initialValue
  })

  // Sempre que o valor muda, guarda no navegador
  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value))
  }, [key, value])

  return [value, setValue]
}

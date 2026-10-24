import { useEffect, useState } from 'react'

export function useLocalStorage(key, initialValue) {
  // A função dentro do useState só roda na primeira renderização
  const [value, setValue] = useState(() => {
    try {
      const saved = localStorage.getItem(key)
      return saved ? JSON.parse(saved) : initialValue
    } catch {
      return initialValue
    }
  })

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value))
    } catch {
      // Navegação anônima ou armazenamento cheio: o app segue funcionando sem salvar
    }
  }, [key, value])

  return [value, setValue]
}

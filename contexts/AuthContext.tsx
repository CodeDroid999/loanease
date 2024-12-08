import React, { createContext, useState, useEffect, useContext } from 'react'
import { auth } from '@/lib/firebase'
import { 
  onAuthStateChanged, 
  User, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signInWithPhoneNumber,
  ApplicationVerifier,
  ConfirmationResult
} from 'firebase/auth'

type AuthContextType = {
  user: User | null
  loading: boolean
  signInWithEmail: (email: string, password: string) => Promise<void>
  signUpWithEmail: (email: string, password: string) => Promise<void>
  signInWithPhone: (phoneNumber: string, appVerifier: ApplicationVerifier) => Promise<ConfirmationResult>
  confirmPhoneSignIn: (verificationCode: string, confirmationResult: ConfirmationResult) => Promise<void>
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  signInWithEmail: async () => {},
  signUpWithEmail: async () => {},
  signInWithPhone: async () => {} as Promise<ConfirmationResult>,
  confirmPhoneSignIn: async () => {},
})

export const useAuth = () => useContext(AuthContext)

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user)
      setLoading(false)
    })

    return unsubscribe
  }, [])

  const signInWithEmail = async (email: string, password: string) => {
    await signInWithEmailAndPassword(auth, email, password)
  }

  const signUpWithEmail = async (email: string, password: string) => {
    await createUserWithEmailAndPassword(auth, email, password)
  }

  const signInWithPhone = async (phoneNumber: string, appVerifier: ApplicationVerifier) => {
    return signInWithPhoneNumber(auth, phoneNumber, appVerifier)
  }

  const confirmPhoneSignIn = async (verificationCode: string, confirmationResult: ConfirmationResult) => {
    await confirmationResult.confirm(verificationCode)
  }

  const value = {
    user,
    loading,
    signInWithEmail,
    signUpWithEmail,
    signInWithPhone,
    confirmPhoneSignIn,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}


"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { login, logout, checkAuth, getPrincipal } from "@/lib/auth"

export function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [principal, setPrincipal] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    checkAuthStatus()
  }, [])

  async function checkAuthStatus() {
    try {
      const authenticated = await checkAuth()
      setIsAuthenticated(authenticated)
      
      if (authenticated) {
        const principalId = await getPrincipal()
        setPrincipal(principalId)
      }
    } catch (error) {
      console.error("Auth check failed:", error)
    } finally {
      setIsLoading(false)
    }
  }

  async function handleLogin() {
    try {
      const success = await login()
      if (success) {
        setIsAuthenticated(true)
        const principalId = await getPrincipal()
        setPrincipal(principalId)
        router.push("/dashboard")
      }
    } catch (error) {
      console.error("Login failed:", error)
    }
  }

  async function handleLogout() {
    try {
      await logout()
      setIsAuthenticated(false)
      setPrincipal(null)
      router.push("/login")
    } catch (error) {
      console.error("Logout failed:", error)
    }
  }

  return {
    isAuthenticated,
    principal,
    isLoading,
    login: handleLogin,
    logout: handleLogout,
  }
}


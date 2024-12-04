import { AuthClient } from "@dfinity/auth-client"

// Initialize auth client
export async function initAuth(): Promise<AuthClient> {
  return await AuthClient.create({
    idleOptions: {
      disableIdle: true,
    },
  })
}

// Login function
export async function login(): Promise<boolean> {
  const authClient = await initAuth()
  
  return new Promise((resolve) => {
    authClient.login({
      identityProvider: "https://identity.ic0.app",
      onSuccess: () => {
        resolve(true)
      },
      onError: () => {
        resolve(false)
      },
    })
  })
}

// Logout function
export async function logout(): Promise<void> {
  const authClient = await initAuth()
  await authClient.logout()
}

// Check authentication status
export async function checkAuth(): Promise<boolean> {
  const authClient = await initAuth()
  return authClient.isAuthenticated()
}

// Get principal ID
export async function getPrincipal(): Promise<string | null> {
  const authClient = await initAuth()
  if (!authClient.isAuthenticated()) return null
  
  const identity = await authClient.getIdentity()
  return identity.getPrincipal().toString()
}


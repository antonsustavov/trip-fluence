import React, { useState } from 'react'
import { useLocation, useNavigate, Link } from 'react-router-dom'
import { supabase } from '../supabaseClient'

const Login = () => {
  const navigate = useNavigate()
  const { search } = useLocation()
  const params = new URLSearchParams(search)
  const next = params.get('next') || '/'

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [showNotVerified, setShowNotVerified] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (!email || !password) {
      setError('Please enter email and password')
      return
    }
    const { data, error: signInError } = await supabase.auth.signInWithPassword({ email, password })
    if (signInError) {
      setError(signInError.message)
      return
    }
    // Gate by is_verified in public users table
    const userId = data?.user?.id
    if (!userId) {
      setError('Login failed. No user found.')
      return
    }
    const { data: profile, error: profErr } = await supabase
      .from('users')
      .select('is_verified, role')
      .eq('auth_id', userId)
      .maybeSingle()
    if (profErr) {
      setError(profErr.message)
      return
    }
    if (!profile || profile.is_verified !== true) {
      await supabase.auth.signOut()
      setShowNotVerified(true)
      return
    }
    try {
      localStorage.setItem('auth_id', userId)
      localStorage.setItem('user_email', email)
      if (profile?.role) localStorage.setItem('role', profile.role)
    } catch {}
    const dest = profile?.role === 'brand' ? '/brands-account' : '/creater-account'
    navigate(dest, { replace: true })
  }

  return (
    <div className='min-h-screen flex flex-col'>
      <main className='flex-1 flex items-center justify-center px-4 py-10'>
        <div className='w-full max-w-[500px] bg-white border border-black/10 rounded-2xl shadow-sm p-6 md:p-8'>
          <div className='text-center mb-8'>
            <a href='/' className='flex items-center justify-center'>
              <img src='/assets/logo.png' alt='TripFluence' className='w-[180px] h-[46px] md:w-[235px] md:h-[60px]' />
            </a>
          </div>
          <form onSubmit={handleSubmit} className='space-y-4'>
            <div className='flex flex-col gap-2'>
              <label className='text-[#05162A] text-[16px] leading-[24px] font-normal'>Email</label>
              <input type='email' value={email} onChange={(e) => setEmail(e.target.value)} placeholder='Enter email' className='border border-[#05588E29] outline-none bg-white rounded-lg py-3 sm:py-4 px-4 sm:px-6 text-[16px] leading-[24px] font-normal placeholder:text-[#758599]' />
            </div>
            <div className='flex flex-col gap-2'>
              <label className='text-[#05162A] text-[16px] leading-[24px] font-normal'>Password</label>
              <input type='password' value={password} onChange={(e) => setPassword(e.target.value)} placeholder='Enter password' className='border border-[#05588E29] outline-none bg-white rounded-lg py-3 sm:py-4 px-4 sm:px-6 text-[16px] leading-[24px] font-normal placeholder:text-[#758599]' />
            </div>
            {error && <div className='text-red-500 text-sm'>{error}</div>}
            <button type='submit' className='w-full hover:bg-[#2A3B6D] transition-colors duration-300 bg-[#1B2B5D] text-white text-[13px] sm:text-[16px] pt-1 sm:pt-0.5 font-semibold h-10 sm:h-12 px-4 sm:px-6 rounded-lg'>Log in</button>
          </form>
          <div className='mt-4 text-[16px] text-center'>
            I don’t have account <Link to={`/signup?next=${encodeURIComponent(next)}`} className='font-semibold underline'>sign up</Link>
          </div>
        </div>
      </main>
      {showNotVerified && (
        <div className='fixed inset-0 z-[100] flex items-center justify-center'>
          <div className='absolute inset-0 bg-[#00060C99]' onClick={() => setShowNotVerified(false)} />
          <div role='dialog' aria-modal='true' className='relative bg-white w-[90%] max-w-[520px] px-6 sm:px-10 py-8 sm:py-10 text-center rounded-xl shadow-lg'>
            <h3 className='text-[#05162A] text-[20px] sm:text-[22px] font-semibold mb-3'>Account not verified</h3>
            <p className='text-[#05162A] text-[15px] leading-[22px]'>Your account is not verified. Please contact support.</p>
            <div className='mt-6'>
              <button onClick={() => setShowNotVerified(false)} className='hover:bg-[#2A3B6D] transition-colors duration-300 bg-[#1B2B5D] rounded-lg h-11 text-[16px] leading-[21px] pt-0.5 text-white font-semibold px-[22px]'>OK</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Login

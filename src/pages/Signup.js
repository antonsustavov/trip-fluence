import React, { useState } from 'react'
import { useLocation, useNavigate, Link } from 'react-router-dom'
import { supabase } from '../supabaseClient'

const Signup = () => {
  const navigate = useNavigate()
  const { search } = useLocation()
  const params = new URLSearchParams(search)
  const next = params.get('next') || '/'

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  // derive role from query params or from the next path (brand/creator)
  const explicitRole = params.get('role')
  const roleFromNext = next.includes('brands-account') || next.includes('find-creators') ? 'brand' : (next.includes('creater-account') || next.includes('find-brands') ? 'creator' : '')
  const role = explicitRole || roleFromNext
  const loginHref = role
    ? `/login?role=${encodeURIComponent(role)}&next=${encodeURIComponent(next)}`
    : `/login?next=${encodeURIComponent(next)}`

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (!email || !password || !confirm) {
      setError('Please fill all fields')
      return
    }
    if (password !== confirm) {
      setError('Passwords do not match')
      return
    }
    if (!role) {
      setError('Missing role. Please start from brand/creator flow.')
      return
    }

    if (!supabase) {
      setError('Supabase is not configured. Add env vars and restart.')
      return
    }

    setLoading(true)
    try {
      const { data: signUpData, error: signUpError } = await supabase.auth.signUp({ email, password })
      if (signUpError) {
        setError(signUpError.message)
        setLoading(false)
        return
      }

      const authId = signUpData?.user?.id || signUpData?.session?.user?.id || null

      const { error: insertError } = await supabase
        .from('users')
        .insert([
          {
            email: email,
            temp_password: password,
            role: role,
            is_verified: false,
            auth_id: authId,
            first_nmae: null,
            last_name: null,
            country: null,
            avatar: null,
          },
        ])
      if (insertError) {
        setError(insertError.message)
        setLoading(false)
        return
      }

      try {
        if (authId) localStorage.setItem('auth_id', authId)
        if (email) localStorage.setItem('user_email', email)
      } catch { }
      // After creating user record, take user to role-specific onboarding page
      const target = role === 'brand' ? '/onboard-brand' : '/onboard-creator'
      navigate(target, { replace: true })
    } catch (err) {
      setError('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
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
            <div className='flex flex-col gap-2'>
              <label className='text-[#05162A] text-[16px] leading-[24px] font-normal'>Confirm Password</label>
              <input type='password' value={confirm} onChange={(e) => setConfirm(e.target.value)} placeholder='Confirm password' className='border border-[#05588E29] outline-none bg-white rounded-lg py-3 sm:py-4 px-4 sm:px-6 text-[16px] leading-[24px] font-normal placeholder:text-[#758599]' />
            </div>
            {error && <div className='text-red-500 text-sm'>{error}</div>}
            <button type='submit' disabled={loading} className='w-full hover:bg-[#2A3B6D] transition-colors duration-300 bg-[#1B2B5D] text-white text-[13px] sm:text-[16px] pt-1 sm:pt-0.5 font-semibold h-10 sm:h-12 px-4 sm:px-6 rounded-lg disabled:opacity-60 disabled:cursor-not-allowed'>{loading ? 'Creating...' : 'Create account'}</button>
          </form>
          <div className='mt-4 text-[16px] text-center'>
            I already have an account <Link to={loginHref} className='font-medium underline'> log in</Link>
          </div>
        </div>
      </main>
    </div>
  )
}

export default Signup

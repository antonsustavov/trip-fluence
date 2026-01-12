import React, { useState } from 'react'
import CustomDropdown from './CustomDropdown'
import { countryOptions } from '../utils/countryOptions'

const WelcomeToTripFluence = () => {
    const [role, setRole] = useState('')
    const [country, setCountry] = useState('')
    const [showSuccess, setShowSuccess] = useState(false)

    const roleOptions = [
        { value: 'creator', label: 'Creator' },
        { value: 'brand', label: 'Brand' },
        { value: 'agency', label: 'Agency' },
    ]

    return (
        <>
            <div id='welcometotripfluence' className='w-full px-4 sm:px-6 py-10 sm:py-[60px]'>
                <div className='max-w-[1032px] w-full mx-auto'>
                    <div className='text-center px-2 sm:px-0 max-w-[736px] w-full mx-auto'>
                        <h2 className='mb-3 text-[#1B2B5D] text-[32px] sm:text-[48px] leading-[40px] sm:leading-[58px] font-semibold'>Welcome to TripFluence</h2>
                        <p className='text-[#758599] text-[14px] sm:text-[16px] leading-[20px] sm:leading-[24px] font-normal capitalize'>Join TripFluence and start your journey—sign up to connect, create, and explore with fellow travelers.</p>
                    </div>

                    <form
                        onSubmit={(e) => {
                            e.preventDefault()
                            setShowSuccess(true)
                        }}  
                        className='mt-10 md:mt-[56px]'
                    >
                        <div className='space-y-5 sm:space-y-8'>
                            <h2 className='text-[#05162A] text-[24px] sm:text-[28px] leading-[28px] sm:leading-[39px] font-semibold'>Personal Info:</h2>
                            <div className='grid grid-cols-1 sm:grid-cols-2 gap-5 md:gap-8'>
                                <div className='flex flex-col gap-2 sm:gap-3'>
                                    <label className='text-[#05162A] text-[16px] leading-[24px] font-normal'>First Name</label>
                                    <input type='text' placeholder='First Name...' className='border border-[#05588E29] outline-none bg-white rounded-lg py-3 sm:py-4 px-4 sm:px-6 text-[16px] leading-[24px] font-normal placeholder:text-[#758599]' />
                                </div>
                                <div className='flex flex-col gap-2 sm:gap-3'>
                                    <label className='text-[#05162A] text-[16px] leading-[24px] font-normal'>Last Name</label>
                                    <input type='text' placeholder='Last Name...' className='border border-[#05588E29] outline-none bg-white rounded-lg py-3 sm:py-4 px-4 sm:px-6 text-[16px] leading-[24px] font-normal placeholder:text-[#758599]' />
                                </div>
                            </div>
                            <div className='grid grid-cols-1 sm:grid-cols-2 gap-5 md:gap-8'>
                                <div className='flex flex-col gap-2 sm:gap-3'>
                                    <label className='text-[#05162A] text-[16px] leading-[24px] font-normal'>Email Address</label>
                                    <input type='email' placeholder='Enter Email Address ...' className='border border-[#05588E29] outline-none bg-white rounded-lg py-3 sm:py-4 px-4 sm:px-6 text-[16px] leading-[24px] font-normal placeholder:text-[#758599]' />
                                </div>
                                <div className='flex flex-col gap-2 sm:gap-3'>
                                    <label className='text-[#05162A] text-[16px] leading-[24px] font-normal'>Phone Number</label>
                                    <input type='tel' placeholder='Enter Phone Number ...' className='border border-[#05588E29] outline-none bg-white rounded-lg py-3 sm:py-4 px-4 sm:px-6 text-[16px] leading-[24px] font-normal placeholder:text-[#758599]' />
                                </div>
                            </div>
                            <div className='grid grid-cols-1 sm:grid-cols-2 gap-5 md:gap-8'>
                                <div className='flex flex-col gap-2 sm:gap-3'>
                                    <label className='text-[#05162A] text-[16px] leading-[24px] font-normal'>Brand or creator</label>
                                    <CustomDropdown options={roleOptions} value={role} onChange={setRole} placeholder='Select' />
                                </div>
                                <div className='flex flex-col gap-2 sm:gap-3'>
                                    <label className='text-[#05162A] text-[16px] leading-[24px] font-normal'>Coutry of residence</label>
                                    <CustomDropdown options={countryOptions} value={country} onChange={setCountry} placeholder='Select' />
                                </div>
                            </div>
                        </div>

                        <div className='mt-10 sm:mt-12'>
                            <h2 className='text-[#05162A] text-[24px] sm:text-[28px] leading-[28px] sm:leading-[39px] font-semibold'>Social Media Platforms:</h2>
                            <div className='mt-6 sm:mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5'>
                                <div className='border border-[#05588E29] rounded-xl px-5 py-6 flex flex-col items-center justify-center'>
                                    <div className='mb-8 border border-[#05588E29] rounded-[11px] p-5 w-fit flex items-center justify-center'>
                                        <img src='/assets/insta.svg' alt='instagram' />
                                    </div>
                                    <div className='mb-3.5 flex flex-col gap-2 sm:gap-3 w-full'>
                                        <label className='text-[#05162A] text-[16px] leading-[24px] font-normal'>Instagram Link</label>
                                        <input type='text' placeholder='Enter URL ...' className='border border-[#05588E29] outline-none bg-white rounded-lg py-3 sm:py-4 px-4 sm:px-6 text-[16px] leading-[24px] font-normal placeholder:text-[#758599]' />
                                    </div>
                                    <div className='flex flex-col gap-2 sm:gap-3 w-full'>
                                        <label className='text-[#05162A] text-[16px] leading-[24px] font-normal'>Followers Number</label>
                                        <input type='text' placeholder='Enter URL ...' className='border border-[#05588E29] outline-none bg-white rounded-lg py-3 sm:py-4 px-4 sm:px-6 text-[16px] leading-[24px] font-normal placeholder:text-[#758599]' />
                                    </div>
                                </div>
                                <div className='border border-[#05588E29] rounded-xl px-5 py-6 flex flex-col items-center justify-center'>
                                    <div className='mb-8 border border-[#05588E29] rounded-[11px] p-5 w-fit flex items-center justify-center'>
                                        <img src='/assets/yout.svg' alt='youtube' />
                                    </div>
                                    <div className='mb-3.5 flex flex-col gap-2 sm:gap-3 w-full'>
                                        <label className='text-[#05162A] text-[16px] leading-[24px] font-normal'>Youtube Link</label>
                                        <input type='text' placeholder='Enter URL ...' className='border border-[#05588E29] outline-none bg-white rounded-lg py-3 sm:py-4 px-4 sm:px-6 text-[16px] leading-[24px] font-normal placeholder:text-[#758599]' />
                                    </div>
                                    <div className='flex flex-col gap-2 sm:gap-3 w-full'>
                                        <label className='text-[#05162A] text-[16px] leading-[24px] font-normal'>Subscribers Number</label>
                                        <input type='text' placeholder='Enter URL ...' className='border border-[#05588E29] outline-none bg-white rounded-lg py-3 sm:py-4 px-4 sm:px-6 text-[16px] leading-[24px] font-normal placeholder:text-[#758599]' />
                                    </div>
                                </div>
                                <div className='border border-[#05588E29] rounded-xl px-5 py-6 flex flex-col items-center justify-center'>
                                    <div className='mb-8 border border-[#05588E29] rounded-[11px] p-5 w-fit flex items-center justify-center'>
                                        <img src='/assets/tiktok.svg' alt='tiktok' />
                                    </div>
                                    <div className='mb-3.5 flex flex-col gap-2 sm:gap-3 w-full'>
                                        <label className='text-[#05162A] text-[16px] leading-[24px] font-normal'>TikTok Link</label>
                                        <input type='text' placeholder='Enter URL ...' className='border border-[#05588E29] outline-none bg-white rounded-lg py-3 sm:py-4 px-4 sm:px-6 text-[16px] leading-[24px] font-normal placeholder:text-[#758599]' />
                                    </div>
                                    <div className='flex flex-col gap-2 sm:gap-3 w-full'>
                                        <label className='text-[#05162A] text-[16px] leading-[24px] font-normal'>Followers Number</label>
                                        <input type='text' placeholder='Enter URL ...' className='border border-[#05588E29] outline-none bg-white rounded-lg py-3 sm:py-4 px-4 sm:px-6 text-[16px] leading-[24px] font-normal placeholder:text-[#758599]' />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className='my-8 sm:my-12 flex items-center gap-3'>
                            <input type='checkbox' className='min-w-5 h-5 cursor-pointer border border-[#05588E38]' required />
                            <p className='text-[#05162A] text-[16px] leading-[24px] font-normal pt-1'>By checking the box I agree to <a href='/privacy-policy' className='text-[#5383FF] font-medium underline underline-offset-2'>privacy policy</a></p>
                        </div>

                        <button type='submit' className="hover:bg-[#4272EE] transition-colors duration-300 bg-[#5383FF] text-white text-[16px] pt-0.5 font-semibold h-11 sm:h-12 px-8 sm:px-[37.5px] rounded-lg flex items-center justify-center">
                            Submit
                        </button>
                    </form>
                </div>
            </div>
            {showSuccess && (
                <div className='fixed inset-0 z-[100] flex items-center justify-center'>
                    <div className='absolute inset-0 bg-[#00060C99]' onClick={() => setShowSuccess(false)} />
                    <div role='dialog' aria-modal='true' className='relative bg-white w-[90%] max-w-[626px] px-6 sm:px-10 py-8 sm:py-12 text-center'>
                        <button aria-label='Close' onClick={() => setShowSuccess(false)} className='absolute -top-3 -right-3'>
                            <img src='/assets/close-modal.svg' alt='close-modal' />
                        </button>
                        <div className='max-w-[410px] mx-auto w-full'>
                            <div className='mb-6 flex items-center justify-center w-full'>
                                <img src='/assets/modal.svg' alt='modal' />
                            </div>
                            <h3 className='text-[#1B2B5D] text-[20px] sm:text-[24px] leading-[34px] font-semibold mb-2'>Thanks for joining us!</h3>
                            <p className='text-[#758599] text-[14px] sm:text-[16px] leading-[22px] font-normal sm:leading-[25px]'>We're reviewing your information. Once approved, you'll get your account details by email. We're excited to have you on board!</p>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}

export default WelcomeToTripFluence
import React, { useState } from 'react'

const Header = () => {
    const [open, setOpen] = useState(false)

    return (
        <header className="relative h-[88px] md:h-[140px] flex items-center px-4 md:px-6">
            <div className="w-full max-w-[1280px] mx-auto flex items-center justify-between">
                <a href='/' className="flex">
                    <img src="/assets/logo.png" alt="TripFluence" className="w-[180px] h-[46px] md:w-[235px] md:h-[60px]" />
                </a>

                <nav className="hidden md:flex items-center gap-8">
                    <div className='flex items-center'>
                        <a href="/signup?role=brand&next=%2Ffind-creators" className="px-6 py-3 text-[#05162A] text-[16px] font-medium leading-[24px]">Find Creators</a>
                        <a href="/signup?role=creator&next=%2Ffind-brands" className="px-6 py-3 text-[#05162A] text-[16px] font-medium leading-[24px]">Find Brands</a>
                    </div>
                </nav>

                <button
                    type="button"
                    aria-label="Toggle menu"
                    aria-expanded={open}
                    onClick={() => setOpen(v => !v)}
                    className="md:hidden inline-flex items-center justify-center"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8">
                        {open ? (
                            <path fillRule="evenodd" d="M6.225 4.811a1 1 0 0 1 1.414 0L12 9.172l4.361-4.361a1 1 0 1 1 1.414 1.414L13.414 10.586l4.361 4.361a1 1 0 0 1-1.414 1.414L12 12l-4.361 4.361a1 1 0 0 1-1.414-1.414l4.361-4.361-4.361-4.361a1 1 0 0 1 0-1.414z" clipRule="evenodd" />
                        ) : (
                            <path fillRule="evenodd" d="M3 6.75A.75.75 0 0 1 3.75 6h16.5a.75.75 0 0 1 0 1.5H3.75A.75.75 0 0 1 3 6.75zm0 5.25a.75.75 0 0 1 .75-.75h16.5a.75.75 0 0 1 0 1.5H3.75a.75.75 0 0 1-.75-.75zm0 5.25a.75.75 0 0 1 .75-.75h16.5a.75.75 0 0 1 0 1.5H3.75a.75.75 0 0 1-.75-.75z" clipRule="evenodd" />
                        )}
                    </svg>
                </button>
            </div>

            {open && (
                <div className="md:hidden absolute z-50 left-0 right-0 top-full bg-white border-t border-black/10 shadow-sm">
                    <div className="max-w-[1280px] mx-auto px-4 py-3">
                        <div className="flex flex-col">
                            <a href="/signup?role=brand&next=%2Ffind-creators" className="py-3 text-[#05162A] text-[16px] font-medium leading-[24px]">Find Creators</a>
                            <a href="/signup?role=creator&next=%2Ffind-brands" className="py-3 text-[#05162A] text-[16px] font-medium leading-[24px]">Find Brands</a>
                        </div>
                    </div>
                </div>
            )}
        </header>
    )
}

export default Header
import React, { useEffect, useRef, useState } from 'react'

const CustomDropdown = ({ options = [], value, onChange, placeholder = 'Select', className = '' }) => {
    const [open, setOpen] = useState(false)
    const ref = useRef(null)

    useEffect(() => {
        const handler = (e) => {
            if (!ref.current) return
            if (!ref.current.contains(e.target)) setOpen(false)
        }
        document.addEventListener('mousedown', handler)
        return () => document.removeEventListener('mousedown', handler)
    }, [])

    const selected = options.find(o => o.value === value)

    return (
        <div ref={ref} className={`relative ${className}`}>
            <button
                type="button"
                onClick={() => setOpen(v => !v)}
                aria-haspopup="listbox"
                aria-expanded={open}
                className="w-full border border-[#05588E29] bg-white rounded-lg py-3 sm:py-4 pl-4 pr-3 sm:pl-6 sm:pr-5 text-left flex items-center justify-between"
            >
                <span className={`text-[16px] leading-[24px] ${selected ? 'text-[#05162A] font-normal' : 'text-[#758599] font-normal'}`}>
                    {selected ? selected.label : placeholder}
                </span>
                <svg className={`w-6 h-6 text-[#131827] transition-transform ${open ? 'rotate-180' : ''}`} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M7 10L12.0008 14.58L17 10" stroke="#131827" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>

            </button>

            {open && (
                <ul className="absolute z-50 mt-2 py-1 w-full max-h-56 overflow-auto rounded-lg border border-[#05588E29] bg-white shadow-sm" role="listbox">
                    {options.map(opt => (
                        <li
                            key={opt.value}
                            role="option"
                            aria-selected={opt.value === value}
                            onClick={() => { onChange?.(opt.value); setOpen(false) }}
                            className={`px-4 py-2 cursor-pointer text-[14px] leading-[21px] hover:bg-[#F3F5F8] ${opt.value === value ? 'bg-[#F3F5F8]' : ''}`}
                        >
                            {opt.label}
                        </li>
                    ))}
                    {options.length === 0 && (
                        <li className="px-4 py-2 text-[#758599] text-[14px] leading-[21px]">No options</li>
                    )}
                </ul>
            )}
        </div>
    )
}

export default CustomDropdown

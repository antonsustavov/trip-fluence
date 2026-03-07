import React from 'react'

const Footer = () => {
    const navLinks = [
        { href: '/signup?role=brand&next=%2Ffind-creators', label: 'Find Creators' },
        { href: '/signup?role=creator&next=%2Ffind-brands', label: 'Find Brands' },
        { href: '#howitworks', label: 'How it works' },
        { href: '#welcometotripfluence', label: 'Subscribe' },
        { href: '#welcometotripfluence', label: 'Contact' },
    ]

    const socials = [
        { icon: '/assets/network.svg', title: 'Our Website:', value: 'TRIPFLUENCE.PRO' },
        { icon: '/assets/instagram.svg', title: 'Our Instagram:', value: 'TRIPFLUENCE.PRO' },
        { icon: '/assets/youtube.svg', title: 'Our YouTube:', value: 'TRIPFLUENCE.PRO' },
    ]

    const legal = [
        { href: '#terms', label: 'Terms' },
        { href: '#privacy', label: 'Privacy' },
        { href: '#arbitration', label: 'Arbitration' },
        { href: '#cookies-policy', label: 'Cookies Policy' },
    ]

    return (
        <div className='bg-[#F3F5F8] pt-10 sm:pt-[60px] w-full'>
            <div className='px-4 md:px-6 mb-10 sm:mb-12'>
                <div className='max-w-[986px] w-full mx-auto space-y-8 sm:space-y-10'>
                    <div className='flex items-center justify-center'>
                        <img src="/assets/logo.png" alt="TripFluence" className="w-[235px] h-[60px]" />
                    </div>

                    <div className='flex flex-wrap items-center justify-center gap-4 sm:gap-6 md:gap-8 py-3 text-center'>
                        {navLinks.map((item) => (
                            <a key={item.label} href={item.href} className='px-4 sm:px-6 text-[#05162A] text-[16px] leading-[24px] font-medium'>
                                {item.label}
                            </a>
                        ))}
                    </div>

                    <div className='flex items-center justify-center sm:justify-between flex-wrap gap-8 w-full'>
                        {socials.map((s) => (
                            <div key={s.title} className='flex items-center gap-[14.68px]'>
                                <div className='bg-[#5383FF] w-12 h-12 rounded-full flex items-center justify-center'>
                                    <img src={s.icon} alt={s.title} />
                                </div>
                                <div>
                                    <h3 className='text-[#5383FF] text-[12px] font-medium leading-[18px]'>{s.title}</h3>
                                    <h3 className='text-[#05162A] text-[18px] font-medium leading-[27px]'>{s.value}</h3>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className='border-t border-[#05588E29]'>
                <div className='max-w-[1280px] mx-auto px-4 md:px-6 py-3.5 flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4 text-center sm:text-left'>
                    <h3 className='text-[#262626] text-[12px] font-medium leading-[18px]'>2025 TripFluence. All Rights Reserved.</h3>
                    <div className='text-[#262626] flex flex-wrap items-center justify-center sm:justify-end gap-1'>
                        {legal.map((l, i) => (
                            <React.Fragment key={l.label}>
                                <a href={l.href} className='text-[12px] font-medium leading-[18px]'>{l.label}</a>
                                {i !== legal.length - 1 && <div className='bg-[#262626] w-px h-[12px] -mt-0.5' />}
                            </React.Fragment>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Footer
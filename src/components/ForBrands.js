import React from 'react'

const ForBrands = () => {
    const features = [
        {
            title: 'Smart Creator Matching',
            desc: 'Find creators that align with your audience, brand tone, and goals. Filter by location, platform, niche, follower size, and content style.',
            icon: "/assets/target-audience.svg"
        },
        {
            title: 'Streamlined Collaboration Tools',
            desc: 'Launch campaigns quickly and manage everything in one dashboard. In‑platform chat, project tracking, and content delivery in one place.',
            icon: "/assets/monitor.svg"
        },
        {
            title: 'Human‑Centered, Story‑Driven Marketing',
            desc: 'Work with authentic voices who genuinely love travel. Increase brand trust, engagement, and organic reach.',
            icon: "/assets/social-media.svg"
        }
    ]

    return (
        <section className="px-4 md:px-6 py-8 sm:py-[60px]">
            <div className="max-w-[1280px] mx-auto">
                <div className='flex items-center lg:flex-row flex-col justify-between gap-[34px]'>
                    {/* Left content */}
                    <div className='lg:max-w-[726px] w-full xl:pr-5'>
                        <h2 className='text-[#1B2B5D] text-[32px] sm:text-[48px] leading-[40px] sm:leading-[58px] font-semibold'>For Brands</h2>
                        <p className='mt-1.5 sm:mt-3 text-[#758599] text-[15px] sm:text-[16px] leading-[22px] sm:leading-[26px] font-normal capitalize'>
                            Discover and connect with travel creators who align with your brand’s voice, audience, and marketing goals—all in one streamlined platform.
                        </p>

                        <div className='mt-5 sm:mt-8 space-y-4 sm:space-y-6 lg:max-w-[695px]'>
                            {features.map((f, i) => (
                                <div key={i} className='flex items-start sm:items-center gap-3 sm:gap-5'>
                                    <div className='border border-[#05588E29] rounded-md sm:rounded-xl min-w-20 h-20 sm:min-w-[96px] sm:h-[96px] flex items-center justify-center'>
                                        <img src={f.icon} alt={f.title} className='sm:w-[48px] w-11' />
                                    </div>
                                    <div className=''>
                                        <h3 className='text-[#05162A] text-[18px] sm:text-[24px] font-semibold leading-[24px] sm:leading-[34px]'>{f.title}</h3>
                                        <p className='mt-1.5 sm:mt-0 text-[#758599] text-[14px] sm:text-[16px] leading-[20px] sm:leading-[25px] font-normal'>{f.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className='mt-8 sm:mt-12'>
                            <a href="#welcometotripfluence" className='hover:bg-[#4272EE] transition-colors duration-300 bg-[#5383FF] text-white text-[14px] sm:text-[16px] pt-0.5 font-semibold h-11 sm:h-12 px-6 sm:px-[30px] rounded-lg inline-flex items-center justify-center'>
                                Get Started
                            </a>
                        </div>
                    </div>

                    {/* Right image */}
                    <div className='relative lg:max-w-[520px] lg:h-[586px]'>
                        <img src='/assets/for-brands.png' alt='For Brands' className='w-full h-full object-cover border border-[#5383FF] rounded-[24px]' />
                        <div
                            className='pointer-events-none absolute inset-0 rounded-[24px]'
                            style={{
                                background: `linear-gradient(180deg, rgba(5, 22, 42, 0) 0%, rgba(5, 22, 42, 0.4) 100%), 
                                linear-gradient(0deg, rgba(5, 22, 42, 0.16), rgba(5, 22, 42, 0.16))`
                            }}
                        />
                    </div>
                </div>
            </div>
        </section>
    )
}

export default ForBrands
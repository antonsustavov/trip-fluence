import React from 'react'

const ForTravelCreators = () => {
    const features = [
        {
            title: 'access to a global brand network',
            icon: "/assets/internet.svg",
            points: [
                'Hotels & Resorts',
                'Travel & Lifestyle Brands',
                'Airlines',
                'Experience Providers',
                'Restaurants & Food Experiences'
            ]
        },
        {
            title: 'direct communication with brands',
            desc: 'No agents, no waiting. Talk directly with decisionmakers. Pitch, negotiate, and finalize deals all in one place.',
            icon: "/assets/conversation.svg"
        },
        {
            title: 'monetize your passion for travel',
            desc: 'Turn your adventures into income & access expert resources to elevate your media kit, pitch, & personal brand, plus join a thriving creator community.',
            icon: "/assets/monetization.svg"
        }
    ]
    return (
        <section className="px-4 md:px-6 py-8 sm:py-[60px]">
            <div className="max-w-[1280px] mx-auto">
                <div className='flex items-center justify-between gap-[34px] md:gap-12 lg:flex-row flex-col-reverse'>
                    {/* Left content */}
                    <div className='relative lg:max-w-[472px] lg:h-[586px]'>
                        <img src='/assets/for-travel-creators.png' alt='For Brands' className='border border-[#5383FF] object-cover w-full h-full rounded-[24px]' />
                        <div
                            className='pointer-events-none absolute inset-0 rounded-[24px]'
                            style={{
                                background: `linear-gradient(180deg, rgba(5, 22, 42, 0) 0%, rgba(5, 22, 42, 0.4) 100%), 
                                linear-gradient(0deg, rgba(5, 22, 42, 0.16), rgba(5, 22, 42, 0.16))`
                            }}
                        />
                    </div>

                    {/* Right image */}
                    <div className='lg:max-w-[760px] w-full'>
                        <h2 className='text-[#1B2B5D] text-[32px] sm:text-[48px] leading-[40px] sm:leading-[58px] font-semibold'>For travel Creators</h2>
                        <p className='mt-1.5 sm:mt-3 text-[#758599] text-[15px] sm:text-[16px] leading-[22px] sm:leading-[26px] font-normal capitalize'>
                            Access global brand opportunities, connect directly with decision-makers, and turn your travel passion into consistent income.
                        </p>

                        <div className='mt-5 sm:mt-8 space-y-4 sm:space-y-6 w-full'>
                            {features.map((f, i) => (
                                <div key={i} className='flex items-start sm:items-center gap-3 sm:gap-5'>
                                    <div className='border border-[#05588E29] rounded-md sm:rounded-xl min-w-20 h-20 sm:min-w-[96px] sm:h-[96px] flex items-center justify-center'>
                                        <img src={f.icon} alt={f.title} className='sm:w-[48px] w-11' />
                                    </div>
                                    <div className=''>
                                        <h3 className='text-[#05162A] text-[18px] sm:text-[24px] font-semibold leading-[24px] sm:leading-[34px] capitalize'>{f.title}</h3>
                                        <p className='mt-1.5 sm:mt-0 text-[#758599] text-[14px] sm:text-[16px] leading-[20px] sm:leading-[25px] font-normal'>{f.desc}</p>
                                        {f.points && (
                                            <div className='mt-1.5 grid grid-cols-1 sm:grid-cols-2 md:[grid-template-columns:200px_294px_85px] gap-x-4 lg:gap-x-8 gap-y-1.5'>
                                                {f.points.map((p, idx) => (
                                                    <div key={idx} className='flex items-start sm:items-center gap-2'>
                                                        <svg width="16" height="16" className='mt-0.5 sm:mt-0 sm:mb-1 min-w-4' viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                            <rect width="16" height="16" rx="8" fill="#5383FF" />
                                                            <path fill-rule="evenodd" clip-rule="evenodd" d="M11.3333 5C11.1467 5 10.98 5.07333 10.86 5.19333L6.66667 9.39333L5.14 7.86C5.02 7.74 4.85333 7.66667 4.66667 7.66667C4.3 7.66667 4 7.96667 4 8.33333C4 8.52 4.07333 8.68667 4.19333 8.80667L6.19333 10.8067C6.31333 10.9267 6.48 11 6.66667 11C6.85333 11 7.02 10.9267 7.14 10.8067L11.8067 6.14C11.9267 6.02 12 5.85333 12 5.66667C12 5.3 11.7 5 11.3333 5Z" fill="white" />
                                                        </svg>
                                                        <span className='text-[#758599] text-[16px] leading-[24px] font-normal'>{p}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
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
                </div>
            </div>
        </section>
    )
}

export default ForTravelCreators
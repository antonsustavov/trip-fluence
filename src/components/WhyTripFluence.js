import React from 'react'

const WhyTripFluence = () => {
    const cards = [
        {
            icon: '/assets/growth.svg',
            title: 'Grow Your Reach',
            text: 'Connect with aligned brands and creators around the globe.',
            textClass: 'px-4'
        },
        {
            icon: '/assets/handshake.svg',
            title: 'Curated Matches',
            text: 'We match creators and brands based on style, values, and goals.',
            textClass: 'px-4'
        },
        {
            icon: '/assets/tools.svg',
            title: 'Collab-Ready Tools',
            text: 'Pitch, chat, and manage collaborations right on the platform.',
            textClass: 'px-2 lg:px-4'
        },
        {
            icon: '/assets/click.svg',
            title: 'Unlimited Access',
            text: 'One subscription. Endless opportunities & Accesses.',
            textClass: 'px-4 xl:px-9'
        }
    ]

    return (
        <section id='whytripfluence' className="px-4 md:px-6 py-10 sm:py-[60px]">
            <div className='w-full max-w-[1280px] mx-auto'>
                <div className='text-center px-2 sm:px-0 max-w-[631px] w-full mx-auto'>
                    <h2 className='mb-3 text-[#1B2B5D] text-[32px] sm:text-[48px] leading-[40px] sm:leading-[58px] font-semibold'>Why TripFluence</h2>
                    <p className='text-[#758599] text-[14px] sm:text-[16px] leading-[20px] sm:leading-[24px] font-normal capitalize'>TripFluence simplifies travel collaborations by matching creators and brands based on shared values, style, and goals.</p>
                </div>

                <div className='my-10 sm:my-[56px] grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-[25px]'>
                    {cards.map((card, idx) => (
                        <div key={idx} className='border border-[#05588E29] text-center py-8 sm:py-10 px-6 rounded-[16px] sm:rounded-[24px] hover:shadow-sm transition-all duration-300 flex items-center justify-center flex-col'>
                            <div className='w-[91px] h-[91px] rounded-full border border-[#05588E29] flex items-center justify-center'>
                                <img src={card.icon} alt={card.title} />
                            </div>
                            <div className='mt-6 space-y-3'>
                                <h2 className='text-[#05162A] text-[20px] font-semibold leading-[28px]'>{card.title}</h2>
                                <p className={`${card.textClass} text-[#758599] text-[14px] leading-[21px] font-normal`}>{card.text}</p>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="flex items-center justify-center gap-3 sm:gap-4">
                    <a href="/signup?role=creator&next=%2Fcreater-account" className="hover:bg-[#4272EE] transition-colors duration-300 bg-[#5383FF] text-white text-sm sm:text-[16px] pt-0.5 font-semibold h-11 sm:h-12 px-5 sm:px-6 rounded-lg flex items-center justify-center">
                        I am Creator
                    </a>
                    <a href="/signup?role=brand&next=%2Fbrands-account" className="hover:bg-[#2A3B6D] transition-colors duration-300 bg-[#1B2B5D] text-white text-sm sm:text-[16px] pt-0.5 font-semibold h-11 sm:h-12 px-5 sm:px-6 rounded-lg flex items-center justify-center">
                        I am Brand
                    </a>
                </div>
            </div>
        </section>
    )
}

export default WhyTripFluence
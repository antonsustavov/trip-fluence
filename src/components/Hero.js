import React from 'react'

const Hero = () => {
    return (
        <section className="px-4 md:px-6 mb-10 sm:mb-[60px]">
            <div className="max-w-[1280px] mx-auto">
                <div
                    className="rounded-[16px] sm:rounded-[24px] overflow-hidden"
                    style={{
                        backgroundImage: "url('/assets/hero-section.png')",
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                    }}
                >
                    <div className="h-[420px] sm:h-[520px] lg:h-[663px] pt-8 sm:pt-0 sm:flex items-center relative">
                        <div className="w-full">
                            <div className="max-w-[560px] mx-3 sm:ml-6">
                                <div className="backdrop-blur-[0px] border border-[#FFFFFFA3] bg-white/70 rounded-[12px] sm:rounded-[24px] px-4 md:px-8 py-6 md:py-11 lg:pl-8 lg:pr-11 lg:py-[56px]">
                                    <div className="text-[14px] leading-[21px] font-semibold text-[#5383FF]"><span className='border-b-2 border-[#5383FF]'>Worldwide</span> Collaborations</div>
                                    <h1 className="mt-4 text-[24px] sm:text-[36px] lg:text-[56px] leading-[28px] sm:leading-[40px] lg:leading-[67px] font-semibold text-[#1B2B5D]">
                                        TRAVEL COLABS <br className="hidden sm:block" /> MADE SIMPLE
                                    </h1>
                                    <p className="mt-2 sm:mt-4 text-[#05162A] text-[14px] sm:text-[16px] leading-[20px] sm:leading-[24px] font-normal capitalize">
                                        Connecting Travel Creators and Brands for meaningful collaborations worldwide.
                                    </p>
                                    <div className="mt-6 sm:mt-8 lg:mt-12 flex flex-wrap items-center gap-3 sm:gap-4">
                                        <a href="/signup?role=creator&next=%2Fcreater-account" className="hover:bg-[#4272EE] transition-colors duration-300 bg-[#5383FF] text-white text-[13px] sm:text-[16px] pt-1 sm:pt-0.5 font-semibold h-10 sm:h-12 px-4 sm:px-6 rounded-lg flex items-center justify-center">
                                            I am Creator
                                        </a>
                                        <a href="/signup?role=brand&next=%2Fbrands-account" className="hover:bg-[#2A3B6D] transition-colors duration-300 bg-[#1B2B5D] text-white text-[13px] sm:text-[16px] pt-1 sm:pt-0.5 font-semibold h-10 sm:h-12 px-4 sm:px-6 rounded-lg flex items-center justify-center">
                                            I am Brand
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <a href='#whytripfluence' className="absolute bottom-6 lg:bottom-8 left-1/2 -translate-x-1/2">
                            <img src="/assets/hero-down-btn.svg" alt="arrow center" />
                        </a>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default Hero
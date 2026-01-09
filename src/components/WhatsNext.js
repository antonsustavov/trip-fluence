import React from 'react'

const WhatsNext = () => {
    return (
        <section className="px-4 md:px-6 py-8 sm:py-10">
            <div className="max-w-[1280px] mx-auto">
                <div className="relative rounded-[16px] sm:rounded-[24px] overflow-hidden">
                    <div
                        className="relative flex items-center justify-center h-[350px] sm:h-[400px] lg:h-[417px]"
                        style={{
                            backgroundImage: "url('/assets/whats-next-bg.png')",
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                        }}
                    >
                        <div className="relative z-10 text-center px-6">
                            <div className="text-white text-[12px] sm:text-[14px] leading-[21px] font-semibold mb-4">What's Next?</div>
                            <h2 className="text-[#5383FF] font-semibold text-[32px] sm:text-[40px] lg:text-[48px] leading-[40px] lg:leading-[58px]">
                                TRAVEL COLABS  <br className="hidden sm:block" /> MADE SIMPLE
                            </h2>
                            <p className="mt-2 text-white font-normal text-[14px] sm:text-[16px] leading-[20px] sm:leading-[24px] max-w-[630px] mx-auto">
                                Connecting Travel Creators and Brands for meaningful collaborations worldwide. <span className='font-semibold'>Join us now!</span>
                            </p>
                            <div className="mt-8 sm:mt-10 flex items-center justify-center gap-3 sm:gap-4">
                                <a href="/creater-account" className="hover:bg-[#4272EE] transition-colors duration-300 bg-[#5383FF] text-white text-sm sm:text-[16px] pt-0.5 font-semibold h-11 sm:h-12 px-5 sm:px-[30px] rounded-lg flex items-center justify-center">
                                    I am Creator
                                </a>
                                <a href="/brands-account" className="hover:bg-[#4272EE] transition-colors duration-300 bg-[#5383FF] text-white text-sm sm:text-[16px] pt-0.5 font-semibold h-11 sm:h-12 px-5 sm:px-[30px] rounded-lg flex items-center justify-center">
                                    I am Brand
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default WhatsNext
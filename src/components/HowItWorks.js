import React from 'react'

const HowItWorks = () => {
    const creatorsSteps = [
        { number: '01', title: 'First Sign Up', description: 'Join our creator community quickly and easily with a fast registration process.' },
        { number: '02', title: 'Create Your Profile', description: 'Showcase your content, style audience demographics, and collaboration interests.' },
        { number: '03', title: 'Receive Brand Offers', description: 'Get direct collaboration proposals from brands that align with your niche.' },
    ]

    const brandsSteps = [
        { number: '01', title: 'Find Creators', description: 'Search and filter through a diverse pool of travel creators to find the perfect match' },
        { number: '02', title: 'Select & Connect', description: 'Review detailed profiles and reach out to creators who resonate with your brand.' },
        { number: '03', title: 'Launch Campaigns Swiftly', description: 'Collaborate and kickstart your marketing campaigns efficiently, all within our platform.' },
    ]

    return (
        <section id='howitworks' className="px-4 md:px-6 py-8 sm:py-[60px]">
            <div className="max-w-[1194px] mx-auto">
                <div className='text-center px-2 sm:px-0 max-w-[736px] w-full mx-auto'>
                    <h2 className='mb-3 text-[#1B2B5D] text-[32px] sm:text-[48px] leading-[40px] sm:leading-[58px] font-semibold'>How It Works</h2>
                    <p className='text-[#758599] text-[14px] sm:text-[16px] leading-[20px] sm:leading-[24px] font-normal capitalize'>Connecting travel creators and brands seamlessly in just 3 simple steps.</p>
                </div>
                <div className='mt-10 md:mt-[56px] grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-0'>

                    {/* For Creators */}
                    <div>
                        <div className='flex items-center justify-center flex-col text-center md:pr-[60px]'>
                            <div className='mb-4 sm:mb-6 border border-[#05588E29] rounded-full  sm:w-[108px] sm:h-[108px] w-[100px] h-[100px] flex items-center justify-center'>
                                <img src='/assets/for-creators.svg' alt='For creators' />
                            </div>
                            <h3 className='text-[#05162A] text-[20px] sm:text-[24px] leading-[26px] sm:leading-[34px] font-semibold'>For Creators</h3>
                        </div>

                        <div className='mt-6 md:mt-10 lg:mt-[56px] w-full pr-[20px] lg:pr-[60px] relative'>
                            <div 
                                className='pointer-events-none absolute left-[20px] top-[48px] bottom-[48px] w-[1px]'
                                style={{
                                    backgroundImage: 'repeating-linear-gradient(to bottom, #5383FF 0, #5383FF 4px, transparent 4px, transparent 7px)'
                                }}
                            />
                            <div className=''>
                                {creatorsSteps.map((step, index) => (
                                    <div key={index} className='relative flex items-center gap-0 mb-5 md:mb-8 last:mb-0'>
                                        <div className='relative flex items-center'>
                                            <div className='w-10 h-10 rounded-full bg-white border border-[#05588E29] flex items-center justify-center flex-shrink-0 z-10'>
                                                <span className='text-[#5383FF] pt-1 text-[16px] font-semibold'>{step.number}</span>
                                            </div>
                                        </div>
                                        <div className='flex-1 bg-white rounded-lg sm:rounded-[16px] p-4 sm:p-5 border border-[#05588E29] ml-3 sm:ml-4 lg:ml-6 md:max-w-[468px]'>
                                            <h2 className='text-[#05162A] text-[16px] sm:text-[20px] leading-[20px] sm:leading-[28px] font-semibold'>{step.title}</h2>
                                            <p className='mt-2 text-[#758599] text-[13px] sm:text-[14px] leading-[19px] sm:leading-[21px] font-normal'>{step.description}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* For Brands */}
                    <div>
                        <div className='md:pl-[60px] flex items-center justify-center flex-col text-center'>
                            <div className='mb-4 sm:mb-6 border border-[#05588E29] rounded-full sm:w-[108px] sm:h-[108px] w-[100px] h-[100px] flex items-center justify-center'>
                                <img src='/assets/for-brands.svg' alt='For brands' />
                            </div>
                            <h3 className='text-[#05162A] text-[20px] sm:text-[24px] leading-[26px] sm:leading-[34px] font-semibold'>For Brands</h3>
                        </div>

                        <div className='mt-6 md:mt-10 lg:mt-[56px] w-full md:pl-[20px] lg:pl-[60px] relative'>
                            <div 
                                className='pointer-events-none absolute left-[20px] md:left-[40px] lg:left-[80px] top-[48px] bottom-[48px] w-[1px]'
                                style={{
                                    backgroundImage: 'repeating-linear-gradient(to bottom, #5383FF 0, #5383FF 4px, transparent 4px, transparent 7px)'
                                }}
                            />
                            <div className=''>
                                {brandsSteps.map((step, index) => (
                                    <div key={index} className='relative flex items-center gap-0 mb-5 md:mb-8 last:mb-0'>
                                        <div className='relative flex items-center'>
                                            <div className='w-10 h-10 rounded-full bg-white border border-[#05588E29] flex items-center justify-center flex-shrink-0 z-10'>
                                                <span className='text-[#5383FF] text-[16px] pt-1 font-semibold'>{step.number}</span>
                                            </div>
                                        </div>
                                        <div className='flex-1 bg-white rounded-lg sm:rounded-[16px] p-4 sm:p-5 border border-[#05588E29] ml-3 sm:ml-4 lg:ml-6 md:max-w-[468px]'>
                                            <h2 className='text-[#05162A] text-[16px] sm:text-[20px] leading-[20px] sm:leading-[28px] font-semibold'>{step.title}</h2>
                                            <p className='mt-2 text-[#758599] text-[13px] sm:text-[14px] leading-[19px] sm:leading-[21px] font-normal'>{step.description}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </section>
    )
}

export default HowItWorks
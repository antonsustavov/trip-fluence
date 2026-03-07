import React, { useEffect, useState } from 'react'
import UserHeader from '../components/UserHeader'
import { Link } from 'react-router-dom'
import { supabase } from '../supabaseClient'

// Fallback data for development when Supabase isn't configured
const sampleData = [
  { id: 1, accountType: 'creator', title: 'ALLY', location: 'FRANCE, PROMO+UGC', image: '/assets/collab-5.jpg', firstName: 'Ally', lastName: 'Brown', country: 'usa', city: 'new-york', brandLink: 'https://ally.example.com', description: 'Lifestyle brand collaborating with travel creators.',
    igLink: 'https://instagram.com/ally', igFollowers: '8,200', igReached: '4,102', igEngaged: '260', igTotal: '8,200',
    ytLink: 'https://youtube.com/@ally', ytSubscribers: '2,150', ytReached: '1,203', ytEngaged: '120', ytTotal: '2,150',
    ttLink: 'https://tiktok.com/@ally', ttFollowers: '15,500', ttReached: '9,010', ttEngaged: '910', ttTotal: '15,500' },
  { id: 2, accountType: 'creator', title: 'JANE', location: 'USA, PROMO+UGC', image: '/assets/collab-6.jpg', firstName: 'Jane', lastName: 'Smith', country: 'usa', city: 'new-york', brandLink: 'https://jane.example.com', description: 'Creator-focused brand seeking UGC collaborations.',
    igLink: 'https://instagram.com/jane.creator', igFollowers: '12,450', igReached: '6,504', igEngaged: '304', igTotal: '12,450',
    ytLink: 'https://youtube.com/@janecreator', ytSubscribers: '7,300', ytReached: '8,920', ytEngaged: '510', ytTotal: '7,300',
    ttLink: 'https://tiktok.com/@jane.creator', ttFollowers: '24,900', ttReached: '15,204', ttEngaged: '1,104', ttTotal: '24,900' },
  { id: 3, accountType: 'creator', title: 'DAVE', location: 'CANADA, PROMO+UGC', image: '/assets/collab-7.jpg', firstName: 'Dave', lastName: 'Miller', country: 'usa', city: 'new-york', brandLink: 'https://dave.example.com', description: 'Outdoor gear brand open to promo and content.',
    igLink: 'https://instagram.com/dave', igFollowers: '5,100', igReached: '2,404', igEngaged: '180', igTotal: '5,100',
    ytLink: 'https://youtube.com/@dave', ytSubscribers: '3,000', ytReached: '2,100', ytEngaged: '230', ytTotal: '3,000',
    ttLink: 'https://tiktok.com/@dave', ttFollowers: '9,400', ttReached: '5,204', ttEngaged: '604', ttTotal: '9,400' },
  { id: 4, accountType: 'creator', title: 'ANNY', location: 'POLAND, UGC', image: '/assets/collab-8.png', firstName: 'Anny', lastName: 'Lee', country: 'usa', city: 'new-york', brandLink: 'https://anny.example.com', description: 'UGC-first brand collaborating with creators.',
    igLink: 'https://instagram.com/anny', igFollowers: '6,800', igReached: '3,311', igEngaged: '220', igTotal: '6,800',
    ytLink: 'https://youtube.com/@anny', ytSubscribers: '1,200', ytReached: '900', ytEngaged: '95', ytTotal: '1,200',
    ttLink: 'https://tiktok.com/@anny', ttFollowers: '10,100', ttReached: '6,003', ttEngaged: '700', ttTotal: '10,100' },
  { id: 5, accountType: 'creator', title: 'ALLY', location: 'FRANCE, PROMO+UGC', image: '/assets/collab-5.jpg', firstName: 'Ally', lastName: 'Brown', country: 'usa', city: 'new-york', brandLink: 'https://ally.example.com', description: 'Lifestyle brand collaborating with travel creators.',
    igLink: 'https://instagram.com/ally', igFollowers: '8,200', igReached: '4,102', igEngaged: '260', igTotal: '8,200',
    ytLink: 'https://youtube.com/@ally', ytSubscribers: '2,150', ytReached: '1,203', ytEngaged: '120', ytTotal: '2,150',
    ttLink: 'https://tiktok.com/@ally', ttFollowers: '15,500', ttReached: '9,010', ttEngaged: '910', ttTotal: '15,500' },
  { id: 6, accountType: 'creator', title: 'JANE', location: 'USA, PROMO+UGC', image: '/assets/collab-6.jpg', firstName: 'Jane', lastName: 'Smith', country: 'usa', city: 'new-york', brandLink: 'https://jane.example.com', description: 'Creator-focused brand seeking UGC collaborations.',
    igLink: 'https://instagram.com/jane.creator', igFollowers: '12,450', igReached: '6,504', igEngaged: '304', igTotal: '12,450',
    ytLink: 'https://youtube.com/@janecreator', ytSubscribers: '7,300', ytReached: '8,920', ytEngaged: '510', ytTotal: '7,300',
    ttLink: 'https://tiktok.com/@jane.creator', ttFollowers: '24,900', ttReached: '15,204', ttEngaged: '1,104', ttTotal: '24,900' },
  { id: 7, accountType: 'creator', title: 'DAVE', location: 'CANADA, PROMO+UGC', image: '/assets/collab-7.jpg', firstName: 'Dave', lastName: 'Miller', country: 'usa', city: 'new-york', brandLink: 'https://dave.example.com', description: 'Outdoor gear brand open to promo and content.',
    igLink: 'https://instagram.com/dave', igFollowers: '5,100', igReached: '2,404', igEngaged: '180', igTotal: '5,100',
    ytLink: 'https://youtube.com/@dave', ytSubscribers: '3,000', ytReached: '2,100', ytEngaged: '230', ytTotal: '3,000',
    ttLink: 'https://tiktok.com/@dave', ttFollowers: '9,400', ttReached: '5,204', ttEngaged: '604', ttTotal: '9,400' },
  { id: 8, accountType: 'creator', title: 'ANNY', location: 'POLAND, UGC', image: '/assets/collab-8.png', firstName: 'Anny', lastName: 'Lee', country: 'usa', city: 'new-york', brandLink: 'https://anny.example.com', description: 'UGC-first brand collaborating with creators.',
    igLink: 'https://instagram.com/anny', igFollowers: '6,800', igReached: '3,311', igEngaged: '220', igTotal: '6,800',
    ytLink: 'https://youtube.com/@anny', ytSubscribers: '1,200', ytReached: '900', ytEngaged: '95', ytTotal: '1,200',
    ttLink: 'https://tiktok.com/@anny', ttFollowers: '10,100', ttReached: '6,003', ttEngaged: '700', ttTotal: '10,100' },
]

const Card = ({ item, href }) => (
  <Link to={href} className="relative rounded-[15px] overflow-hidden bg-[#263763] w-[234px] h-[234px] block">
    <div className="absolute inset-0 p-1.5">
      <svg className="w-full h-full" viewBox="0 0 222 220" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <clipPath id={`cardClip-${item.id}`} clipPathUnits="userSpaceOnUse">
            <path d="M0 158C0 162.418 3.58172 166 8 166H51.2355C53.3281 166 55.3373 166.82 56.8325 168.284L76.1675 187.216C77.6627 188.68 79.6719 189.5 81.7645 189.5H154.359C156.672 189.5 158.872 190.501 160.391 192.246L171.5 205L175.5 209L179 212L183 215L185.25 216.25L186.696 217.054C187.23 217.35 187.797 217.585 188.384 217.753L191 218.5L194.643 219.309C195.213 219.436 195.794 219.5 196.378 219.5H200H204.5L213.166 219.044C213.721 219.015 214.27 218.928 214.807 218.785L215.561 218.584C219.063 217.65 221.5 214.478 221.5 210.854V56C221.5 51.5817 217.918 48 213.5 48H163.217C160.86 48 158.623 46.9605 157.103 45.159L135.487 19.54C133.639 17.3503 133.104 14.3397 134.083 11.6471L135.321 8.24275C136.053 6.22887 135.683 3.97893 134.344 2.30562C133.179 0.848329 131.414 0 129.547 0H8C3.58172 0 0 3.58172 0 8V158Z" fill="#D9D9D9" />
          </clipPath>
        </defs>
        <g clipPath={`url(#cardClip-${item.id})`}>
          <image href={item.image} width="222" height="220" preserveAspectRatio="xMidYMid slice" />
        </g>
      </svg>
    </div>
    <div className="absolute inset-0" />
    <div className="relative flex items-end h-full justify-start">
      <div className="text-white p-1.5 pl-2">
        <div className="text-[#F9FAFB] text-[18px] leading-[27px] font-semibold">{item.title}</div>
        <div className="text-[#F9FAFB] text-[15px] leading-[23px] font-normal">{item.location}</div>
      </div>
    </div>
  </Link>
)

const FindBrands = () => {
  const [items, setItems] = useState([])

  useEffect(() => {
    let active = true
    async function load() {
      try {
        if (!supabase) return
        const { data, error } = await supabase
          .from('users')
          .select('id, first_nmae, last_name, country, avatar, description, role')
          .eq('role', 'brand')
        if (error) return
        if (!active || !data) return
        const normalized = (data || []).map((u) => ({
          id: u.id,
          accountType: 'brand',
          title: `${(u.first_nmae || '').trim()} ${(u.last_name || '').trim()}`.trim() || 'CREATOR',
          location: (u.country || '').toUpperCase(),
          image: u.avatar || '/assets/collab-5.jpg',
          firstName: u.first_nmae || '',
          lastName: u.last_name || '',
          country: (u.country || ''),
          city: '',
          brandLink: '',
          description: u.description || '',
        }))
        setItems(normalized)
      } catch (_) {
        // swallow
      }
    }
    load()
    return () => { active = false }
  }, [])

  const dataToRender = items.length ? items : sampleData
  return (
    <>
      <UserHeader />
      <main className="px-4 md:px-6 py-10 md:py-[60px]">
        <div className="max-w-[1090px] mx-auto">
          <h1 className="text-center text-[#05162A] text-[28px] sm:text-[35px] lg:text-[41px] leading-[36px] sm:leading-[46px] lg:leading-[57px] font-semibold">Find Authentic Brands For New Content and Promo</h1>
          <div className="mt-10 md:mt-[56px] justify-items-center grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 md:gap-8 lg:gap-x-[44.67px] lg:gap-y-[56.5px]">
            {dataToRender.map((item) => {
              const base = item.accountType === 'brand' ? '/brands-account' : '/creater-account'
              const href = `${base}/${item.id}`
              return <Card key={item.id} item={item} href={href} />
            })}
          </div>
        </div>
      </main>
    </>
  )
}

export default FindBrands

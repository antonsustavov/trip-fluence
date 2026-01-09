import React, { useEffect, useState } from 'react'
import UserHeader from '../components/UserHeader'
import { Link } from 'react-router-dom'
import { supabase } from '../supabaseClient'

// Fallback data for development when Supabase isn't configured
const sampleData = [
  { 
    id: 1, 
    accountType: 'brand', 
    title: 'AIRBNB', 
    location: 'USA, NEW YORK', 
    image: '/assets/collab-1.jpg', 
    firstName: 'Alex', 
    lastName: 'Johnson', 
    brandLink: 'https://airbnb.com', 
    description: 'Book unique homes and experiences all over the world.' 
  },
  { 
    id: 2, 
    accountType: 'brand', 
    title: 'HOTEL', 
    location: 'FRANCE, PARIS', 
    image: '/assets/collab-2.jpg', 
    firstName: 'Marie', 
    lastName: 'Dupont', 
    brandLink: 'https://example-hotel.com', 
    description: 'Boutique stays for modern travelers.' 
  },
  { 
    id: 3, 
    accountType: 'brand', 
    title: 'AIRBNB', 
    location: 'MEXICO, TULUM', 
    image: '/assets/collab-3.jpg', 
    firstName: 'Carlos', 
    lastName: 'Mendez', 
    brandLink: 'https://airbnb.com/tulum', 
    description: 'Beachside rentals perfect for creators.' 
  },
  { 
    id: 4, 
    accountType: 'brand', 
    title: 'AIRBNB', 
    location: 'NORWAY, LOFOTEN', 
    image: '/assets/collab-4.jpg', 
    firstName: 'Nora', 
    lastName: 'Solberg', 
    brandLink: 'https://airbnb.com/lofoten', 
    description: 'Scenic getaways in the Arctic circle.' 
  },
  { 
    id: 5, 
    accountType: 'brand', 
    title: 'AIRBNB', 
    location: 'USA, NEW YORK', 
    image: '/assets/collab-1.jpg', 
    firstName: 'Alex', 
    lastName: 'Johnson', 
    brandLink: 'https://airbnb.com', 
    description: 'Book unique homes and experiences all over the world.' 
  },
  { 
    id: 6, 
    accountType: 'brand', 
    title: 'HOTEL', 
    location: 'FRANCE, PARIS', 
    image: '/assets/collab-2.jpg', 
    firstName: 'Marie', 
    lastName: 'Dupont', 
    brandLink: 'https://example-hotel.com', 
    description: 'Boutique stays for modern travelers.' 
  },
  { 
    id: 7, 
    accountType: 'brand', 
    title: 'AIRBNB', 
    location: 'MEXICO, TULUM', 
    image: '/assets/collab-3.jpg', 
    firstName: 'Carlos', 
    lastName: 'Mendez', 
    brandLink: 'https://airbnb.com/tulum', 
    description: 'Beachside rentals perfect for creators.' 
  },
  { 
    id: 8, 
    accountType: 'brand', 
    title: 'AIRBNB', 
    location: 'NORWAY, LOFOTEN', 
    image: '/assets/collab-4.jpg', 
    firstName: 'Nora', 
    lastName: 'Solberg', 
    brandLink: 'https://airbnb.com/lofoten', 
    description: 'Scenic getaways in the Arctic circle.' 
  },
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

const FindCreators = () => {
  const [items, setItems] = useState([])

  useEffect(() => {
    let active = true
    async function load() {
      try {
        if (!supabase) return
        const { data, error } = await supabase
          .from('users')
          .select('id, first_nmae, last_name, country, avatar, brand_url, description, role')
          .eq('role', 'brand')
        if (error) return
        if (!active || !data) return
        const normalized = (data || []).map((u) => ({
          id: u.id,
          accountType: 'brand',
          title: `${(u.first_nmae || '').trim()} ${(u.last_name || '').trim()}`.trim() || 'Brand',
          location: (u.country || '').toUpperCase(),
          image: u.avatar || '/assets/collab-1.jpg',
          firstName: u.first_nmae || '',
          lastName: u.last_name || '',
          country: (u.country || ''),
          city: '',
          brandLink: u.brand_url || '',
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
      <main className="px-4 md:px-6 py-10 sm:py-[60px]">
        <div className="max-w-[1070px] mx-auto">
          <h1 className="text-center text-[#05162A] text-[28px] sm:text-[40px] lg:text-[48px] leading-[36px] sm:leading-[48px] lg:leading-[67px] font-semibold">Find Travel Collabs For The Next Trips</h1>
          <div className="mt-10 md:mt-[56px] justify-items-center grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 md:gap-8 lg:gap-x-[44.67px] lg:gap-y-[56.5px]">
            {dataToRender.map((item) => {
              const href = `/brands-account/${item.id}`
              return <Card key={item.id} item={item} href={href} />
            })}
          </div>
        </div>
      </main>
    </>
  )
}

export default FindCreators

import { siteConfig } from '@/lib/config'
import DarkModeButton from '@/components/DarkModeButton'
import Link from 'next/link'
import { useRouter } from 'next/router'

export default function LogoBar(props) {
  const router = useRouter()
  const isHomePage = router.asPath === '/' || router.asPath.startsWith('/page/')

  return (
    <div id='top-wrapper' className='w-full flex items-center '>
      <Link href='/' className='logo text-md md:text-xl dark:text-gray-200'>
        {isHomePage ? <h1>{siteConfig('TITLE')}</h1> : <span>{siteConfig('TITLE')}</span>}
      </Link>
      <DarkModeButton/>
    </div>
  )
}
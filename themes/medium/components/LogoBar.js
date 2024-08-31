import Link from 'next/link'
import { useRouter } from 'next/router'
import { siteConfig } from '@/lib/config'

export default function LogoBar (props) {
  const router = useRouter();
  const isHomePage = router.pathname === '/';
  const isPageNumber = router.pathname.startsWith('/page/');

  return (
    <div id='top-wrapper' className='w-full flex items-center '>
      {isHomePage || isPageNumber ? (
        <h1>
          <Link href='/' className='text-md md:text-xl dark:text-gray-200'>
            {siteConfig('TITLE')}
          </Link>
        </h1>
      ) : (
        <Link href='/' className='text-md md:text-xl dark:text-gray-200'>
          {siteConfig('TITLE')}
        </Link>
      )}
    </div>
  );
}

import { siteConfig } from '@/lib/config'

/**
 * facebook个人主页
 * @returns
 */
const FacebookPage = () => {
  const facebookPage = siteConfig('FACEBOOK_PAGE')
  const facebookPageTitle = siteConfig('FACEBOOK_PAGE_TITLE')

  if (!facebookPage) {
    return <></>
  }
  return (
    <div className='shadow-md hover:shadow-xl dark:text-gray-300 border dark:border-black rounded-xl px-2 py-4 bg-white dark:bg-hexo-black-gray lg:duration-100 justify-center'>
      {facebookPage && (
        <div className='flex items-center pb-2'>
          <a
            href={facebookPage}
            target='_blank'
            rel='noopener noreferrer'
            className='p-1 pr-2 pt-0'
          >
            <span className='inline-flex w-7 h-7 rounded-full items-center justify-center bg-blue-600 text-white'>
              <i className='fab fa-facebook-f' />
            </span>
          </a>
          <a href={facebookPage} rel='noopener noreferrer' target='_blank'>
            {facebookPageTitle}
          </a>
        </div>
      )}
      <iframe
        title='Facebook Page'
        src={`https://www.facebook.com/plugins/page.php?href=${encodeURIComponent(facebookPage)}&tabs=timeline&small_header=false&adapt_container_width=true&hide_cover=false&show_facepile=true`}
        width='100%'
        height='500'
        style={{ border: 'none', overflow: 'hidden' }}
        scrolling='no'
        frameBorder='0'
        allow='autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share'
      />
    </div>
  )
}
export default FacebookPage

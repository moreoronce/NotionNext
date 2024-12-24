import { siteConfig } from '@/lib/config'

/**
 * 社交联系方式按钮组
 * @returns {JSX.Element}
 * @constructor
 */
const SocialButton = () => {
  return (
    <div className='space-x-3 text-xl text-gray-600 dark:text-gray-400 flex-wrap flex justify-center '>
      {siteConfig('CONTACT_TELEGRAM') && (
        <a
          target='_blank'
          rel='noreferrer'
          href={siteConfig('CONTACT_TELEGRAM')}
          title={'telegram'}>
          <i className='fab fa-telegram transform hover:scale-125 duration-150 hover:text-green-600' />
        </a>
      )}
      {JSON.parse(siteConfig('ENABLE_RSS')) && (
        <a
          target='_blank'
          rel='noreferrer'
          title={'RSS'}
          href={'/rss/feed.xml'}>
          <i className='fas fa-rss transform hover:scale-125 duration-150 hover:text-green-600' />
        </a>
      )}
    </div>
  )
}
export default SocialButton

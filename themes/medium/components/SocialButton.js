import { siteConfig } from '@/lib/config'
import { useRef } from 'react'
import { handleEmailClick } from '@/lib/plugins/mailEncrypt'

/**
 * 社交联系方式按钮组
 * @returns {JSX.Element}
 * @constructor
 */
const SocialButton = () => {
  const CONTACT_GITHUB = siteConfig('CONTACT_GITHUB')
  const CONTACT_ORCID = siteConfig('CONTACT_ORCID')
  const CONTACT_CSDN = siteConfig('CONTACT_CSDN')
  const CONTACT_JUEJIN = siteConfig('CONTACT_JUEJIN')
  const CONTACT_TWITTER = siteConfig('CONTACT_TWITTER')
  const CONTACT_TELEGRAM = siteConfig('CONTACT_TELEGRAM')
  const ENABLE_RSS = siteConfig('ENABLE_RSS')

  const emailIcon = useRef(null)

  return (
    <div className='space-x-3 text-xl text-gray-600 dark:text-gray-400 flex-wrap flex justify-center '>
      {CONTACT_GITHUB && (
        <a
          target='_blank'
          rel='noreferrer'
          title={'github'}
          href={CONTACT_GITHUB}>
          <i className='fab fa-github transform hover:scale-125 duration-150 hover:text-green-600' />
        </a>
      )}
      {CONTACT_ORCID && (
        <a
          target='_blank'
          rel='noreferrer'
          title={'ORCID'}
          href={CONTACT_ORCID}>
          <i className='fab fa-orcid transform hover:scale-125 duration-150 hover:text-green-600' />
        </a>
      )}
      {CONTACT_CSDN && (
        <a
          target='_blank'
          rel='noreferrer'
          title={'CSDN'}
          href={CONTACT_CSDN}>
          <i className='fab fa-csdn transform hover:scale-125 duration-150 hover:text-green-600' />
        </a>
      )}
      {CONTACT_JUEJIN && (
        <a
          target='_blank'
          rel='noreferrer'
          title={'稀土掘金'}
          href={CONTACT_JUEJIN}>
          <i className='fab fa-juejin transform hover:scale-125 duration-150 hover:text-green-600' />
        </a>
      )}
      {CONTACT_TWITTER && (
        <a
          target='_blank'
          rel='noreferrer'
          title={'twitter'}
          href={CONTACT_TWITTER}>
          <i className='fab fa-twitter transform hover:scale-125 duration-150 hover:text-green-600' />
        </a>
      )}
      {CONTACT_TELEGRAM && (
        <a
          target='_blank'
          rel='noreferrer'
          href={CONTACT_TELEGRAM}
          title={'telegram'}>
          <i className='fab fa-telegram transform hover:scale-125 duration-150 hover:text-green-600' />
        </a>
      )}
      {siteConfig('CONTACT_LINKEDIN') && (
        <a
          target='_blank'
          rel='noreferrer'
          href={siteConfig('CONTACT_LINKEDIN')}
          title={'linkedIn'}>
          <i className='transform hover:scale-125 duration-150 fab fa-linkedin dark:hover:text-indigo-400 hover:text-indigo-600' />
        </a>
      )}
      {siteConfig('CONTACT_WEIBO') && (
        <a
          target='_blank'
          rel='noreferrer'
          title={'weibo'}
          href={siteConfig('CONTACT_WEIBO')}>
          <i className='fab fa-weibo transform hover:scale-125 duration-150 hover:text-green-600' />
        </a>
      )}
      {siteConfig('CONTACT_INSTAGRAM') && (
        <a
          target='_blank'
          rel='noreferrer'
          title={'instagram'}
          href={siteConfig('CONTACT_INSTAGRAM')}>
          <i className='fab fa-instagram transform hover:scale-125 duration-150 hover:text-green-600' />
        </a>
      )}
      {siteConfig('CONTACT_EMAIL') && (
        <a
          target='_blank'
          rel='noreferrer'
          title={'email'}
          href={`mailto:${siteConfig('CONTACT_EMAIL')}`}>
          <i className='fas fa-envelope transform hover:scale-125 duration-150 hover:text-green-600' />
        </a>
      )}
      {ENABLE_RSS && (
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

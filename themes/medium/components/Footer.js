import DarkModeButton from '@/components/DarkModeButton'
import { siteConfig } from '@/lib/config'

const Footer = ({ title }) => {
  const d = new Date()
  const currentYear = d.getFullYear()
  const since = siteConfig('SINCE')
  const copyrightDate = parseInt(since) < currentYear ? since + '-' + currentYear : currentYear

  return (
    <footer
      className='z-10 dark:bg-hexo-black-gray flex-shrink-0 justify-center text-center m-auto w-full leading-6 text-sm p-6 relative'
    >
       <DarkModeButton/>
      <i className='fas fa-copyright' /> {`${copyrightDate}`} <span><i className='mx-1 animate-pulse fas fa-heart'/> <a href={siteConfig('LINK')} className='underline font-bold text-gray-500 dark:text-gray-300 '>{siteConfig('AUTHOR')}</a>.<br/>
        <br/>
        {title}
        <span className='text-xs font-serif'>Powered by <a href='https://github.com/tangly1024/NotionNext' className='underline text-gray-500 dark:text-gray-300' rel='nofollow'>NotionNext {siteConfig('VERSION')}</a>.</span></span>
    </footer>
  )
}

export default Footer

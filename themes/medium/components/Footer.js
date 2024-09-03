import DarkModeButton from '@/components/DarkModeButton'
import { siteConfig } from '@/lib/config'

const Footer = ({ title }) => {
  const d = new Date()
  const currentYear = d.getFullYear()
  const since = siteConfig('SINCE')
  const copyrightDate = parseInt(since) < currentYear ? since + '-' + currentYear : currentYear
  return (
    <footer className='z-10 dark:bg-hexo-black-gray flex-shrink-0 justify-center text-center m-auto w-full leading-6 text-sm p-6 relative'>
      <DarkModeButton/>
      <div className="flex justify-center">
        <a href="https://www.travellings.cn/go.html" target="_blank" rel="noopener" title="开往-友链接力">
          <img src="https://www.travellings.cn/assets/logo.gif" alt="开往-友链接力" width="120" />
        </a>
      </div>
      <div>
        <i className='fas fa-copyright' /> {`${copyrightDate}`} <span><i className='mx-1 animate-pulse fas fa-heart'/> <a href={siteConfig('LINK')} className='underline font-bold text-gray-500 dark:text-gray-300 '>{siteConfig('AUTHOR')}</a>.<br/>
        <br/>
        <span className='text-xs font-serif'>Powered by <a href='https://github.com/tangly1024/NotionNext' className='underline text-gray-500 dark:text-gray-300' rel='nofollow'>NotionNext {siteConfig('VERSION')}</a>.</span></span>
      </div>
    </footer>
  )
}

export default Footer

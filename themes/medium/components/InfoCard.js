import LazyImage from '@/components/LazyImage'
import Router from 'next/router'
import SocialButton from './SocialButton'
import { siteConfig } from '@/lib/config'

const InfoCard = (props) => {
  const { siteInfo } = props
  return <div id='info-card' className='py-4'>
    <div className='items-center justify-center'>
        <div className='hover:scale-105 transform duration-200 cursor-pointer flex justify-center' onClick={ () => { Router.push('/about') }}>
            <LazyImage src={siteInfo?.icon} className='rounded-full' width={120} alt={siteConfig('AUTHOR')}/>
         </div>
        <div className='text-xl py-2 hover:scale-105 transform duration-200 flex justify-center dark:text-gray-300'>{siteConfig('AUTHOR')}</div>
        <div className='font-light text-gray-600 mb-2 hover:scale-105 transform duration-200 flex justify-center dark:text-gray-400'>{siteConfig('BIO')}</div> 
        <SocialButton/>
        <div className="flex justify-center">
        <a href="https://www.travellings.cn/go.html" target="_blank" rel="noopener" title="开往-友链接力">
          <img src="https://cdn.jsdelivr.net/gh/travellings-link/travellings/assets/w.png" alt="开往-友链接力" width="120" />
        </a>
      </div>
    </div>
  </div>
}

export default InfoCard

import { useGlobal } from '@/lib/global'

/**
 * 文章列表上方嵌入
 * @param {*} props
 * @returns
 */
export default function BlogPostBar(props) {
  const { tag, category } = props
  const { locale } = useGlobal()

  if (tag) {
    return (
      <div className='flex items-center text-xl py-8'>
        <h1><i className='mr-2 fas fa-tag' />
        {locale.COMMON.TAGS}:{tag}</h1>
      </div>
    )
  } else if (category) {
    return (
      <div className='flex items-center text-xl py-8'>
        <h1><i className='mr-2 fas fa-th' />
        {locale.COMMON.CATEGORY}:{category}</h1>
      </div>
    )
  } else {
    return <></>
  }
}

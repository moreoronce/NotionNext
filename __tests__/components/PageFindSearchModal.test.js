import { act, render, screen, waitFor } from '@testing-library/react'
import { createRef } from 'react'
import PageFindSearchModal from '@/components/PageFindSearchModal'

const mockRouter = { asPath: '/', query: {} }
const mockSearch = jest.fn(async () => ({
  results: [{ data: async () => ({
    url: '/article/kixdns', meta: { title: 'KixDNS Guide' }
  }) }]
}))

jest.mock('next/router', () => ({ useRouter: () => mockRouter }))
jest.mock('@/lib/config', () => ({ siteConfig: (_key, fallback) => fallback }))
jest.mock('@/lib/global', () => ({ useGlobal: () => ({ tagOptions: [] }) }))
jest.mock('@/components/Mark', () => jest.fn())
jest.mock('react-hotkeys-hook', () => ({ useHotkeys: () => {} }))
jest.mock('/pagefind/pagefind.js', () => ({
  init: async () => {},
  search: (...args) => mockSearch(...args)
}), { virtual: true })

it('opens with an initial query and searches the real modal without extra typing', async () => {
  const ref = createRef()
  const { container } = render(<PageFindSearchModal cRef={ref} />)
  await act(async () => ref.current.openSearch('KixDNS'))
  await waitFor(() => expect(mockSearch).toHaveBeenCalledWith('KixDNS'))
  expect(screen.getByPlaceholderText('在这里输入搜索关键词...')).toHaveValue('KixDNS')
  expect(container.querySelector('#search-wrapper')).not.toHaveClass('invisible')
  expect(await screen.findByText('KixDNS Guide')).toBeInTheDocument()
})

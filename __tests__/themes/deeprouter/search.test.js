import { act, fireEvent, render, screen } from '@testing-library/react'
import { LayoutBase, LayoutSearch } from '@/themes/deeprouter'

const mockOpenSearch = jest.fn()
const mockPush = jest.fn()
let mockFinishLoading

jest.mock('@/lib/config', () => ({
  siteConfig: (_key, fallback) => fallback
}))
jest.mock('@/lib/global', () => ({ useGlobal: () => ({ fullWidth: false }) }))
jest.mock('next/router', () => ({ useRouter: () => ({ push: mockPush }) }))
jest.mock('@/themes/deeprouter/style', () => ({ Style: () => null }))
jest.mock('@/themes/deeprouter/components/Header', () => ({ onSearch }) => (
  <button onClick={() => onSearch()}>全站搜索</button>
))
jest.mock('@/themes/deeprouter/components/Footer', () => () => null)
jest.mock('next/dynamic', () => loader => {
  if (!loader.toString().includes('PageFindSearchModal')) return () => null
  const React = require('react')
  function Modal({ cRef }) {
    const [open, setOpen] = React.useState(false)
    React.useImperativeHandle(cRef, () => ({
      openSearch: query => {
        mockOpenSearch(query)
        setOpen(true)
      }
    }), [])
    return open ? <button onClick={() => setOpen(false)}>关闭搜索</button> : null
  }
  return function DelayedModal(props) {
    const [loaded, setLoaded] = React.useState(false)
    React.useEffect(() => {
      mockFinishLoading = () => setLoaded(true)
    }, [])
    return loaded ? <Modal {...props} /> : null
  }
})

beforeEach(() => {
  mockOpenSearch.mockClear()
  mockPush.mockClear()
  mockFinishLoading = undefined
})

it('opens after the lazy modal attaches its ref, and opens again after closing', () => {
  render(<LayoutBase><p>Home</p></LayoutBase>)
  expect(mockFinishLoading).toBeUndefined()
  fireEvent.click(screen.getByRole('button', { name: '全站搜索' }))
  expect(mockOpenSearch).not.toHaveBeenCalled()
  act(() => mockFinishLoading())
  expect(mockOpenSearch).toHaveBeenCalledTimes(1)
  fireEvent.click(screen.getByRole('button', { name: '关闭搜索' }))
  fireEvent.click(screen.getByRole('button', { name: '全站搜索' }))
  expect(mockOpenSearch).toHaveBeenCalledTimes(2)
})

it('submits the standalone search to PageFind without navigating to a dynamic route', () => {
  render(<LayoutBase><LayoutSearch posts={[]} /></LayoutBase>)
  const input = screen.getByPlaceholderText('搜索文章...')
  fireEvent.change(input, { target: { value: '  KixDNS  ' } })
  fireEvent.submit(input.closest('form'))
  expect(mockPush).not.toHaveBeenCalled()
  act(() => mockFinishLoading())
  expect(mockOpenSearch).toHaveBeenCalledWith('KixDNS')
})

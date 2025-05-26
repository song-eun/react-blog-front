import { useCallback, useEffect, useRef, useState } from 'react'
import { PostCard } from '../components/PostCard'
import css from './postlistpage.module.css'
import { getPostList } from '../apis/postApi'

export const PostListPage = () => {
  const [postList, setPostList] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  const [page, setPage] = useState(0)
  const [hasMore, setHasMore] = useState(true)
  const listRef = useRef(null)
  const observer = useRef()

  const lastPostElementRef = useCallback(
    node => {
      if (isLoading) return
      if (observer.current) observer.current.disconnect()

      observer.current = new IntersectionObserver(entries => {
        if (entries[0].isIntersecting && hasMore) {
          setPage(prev => prev + 1)
        }
      })

      if (node) observer.current.observe(node)
    },
    [isLoading, hasMore]
  )

  useEffect(() => {
    const fetchPostList = async () => {
      try {
        setIsLoading(true)

        const data = await getPostList(page)

        // 현재 첫 페이지면 data.posts 그대로 아니면 전에 있던 것에 덧붙이기
        setPostList(prev => (page === 0 ? data.posts : [...prev, ...data.posts]))
        setHasMore(data.hasMore)
      } catch (error) {
        console.error(error)
        setError('글 목록을 불러오는 데 실패했습니다')
      } finally {
        setIsLoading(false)
      }
    }
    fetchPostList()
  }, [page])

  return (
    <main className={css.postlistpage}>
      <h2>리스트</h2>
      {error && <p className={css.errorMessage}>{error}</p>}
      {isLoading && page === 0 ? (
        <p>로딩중...</p>
      ) : postList.length === 0 ? (
        <p className={css.noPostMessage}>아직 게시물이 없습니다</p>
      ) : (
        <ul className={css.postList} ref={listRef}>
          {postList.map((post, i) => (
            <li key={post._id} ref={i === postList.length - 1 ? lastPostElementRef : null}>
              <PostCard post={post} />
            </li>
          ))}
        </ul>
      )}
    </main>
  )
}

import { Link, useNavigate } from 'react-router-dom'
import css from './postcard.module.css'
import { formatDate } from '../util/feature'
import noCoverImg from '../assets/no-img.png'

export const PostCard = ({ post }) => {
  const { title, summary, createdAt, author, cover, _id } = post
  const navigate = useNavigate()
  const handleClick = () => {
    navigate(`/post/${_id}`)
  }

  return (
    <article className={css.postcard} onClick={handleClick}>
      <div className={css.post_img}>
        <img
          src={cover ? `${import.meta.env.VITE_BACK_URL}/${cover}` : noCoverImg}
          alt="이미지이름"
        />
      </div>
      <h3 className={css.title}>{title}</h3>

      <div className={css.info}>
        <p>
          <Link to={'/mypage'} className={css.author}>
            {author}
          </Link>
          <time className={css.date}>{formatDate(createdAt)}</time>
        </p>
        <p>
          <span>❤️</span> <span>30</span> <span>💬</span> <span>30</span>
        </p>
      </div>
      <p className={css.summary}>{summary}</p>
    </article>
  )
}

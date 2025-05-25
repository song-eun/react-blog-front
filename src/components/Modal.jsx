import css from './modal.module.css'

export default function Modal({ onCancel, onConfirm, message, action }) {
  return (
    <div className={css.overlay} onClick={onCancel}>
      <div className={css.modal} onClick={e => e.stopPropagation()}>
        <h3 className={css.message}>{message}</h3>
        <div className={css.buttons}>
          <button className={css.confirm} onClick={onConfirm}>
            {action}
          </button>
          <button className={css.cancel} onClick={onCancel}>
            취소
          </button>
        </div>
      </div>
    </div>
  )
}

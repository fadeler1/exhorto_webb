import { useEffect, useId } from 'react'
import { createPortal } from 'react-dom'
import './ConfirmDialog.css'

/**
 * @param {{
 *   isOpen: boolean
 *   title: string
 *   message: string
 *   detail?: string
 *   confirmLabel?: string
 *   cancelLabel?: string
 *   isBusy?: boolean
 *   tone?: 'danger' | 'warning'
 *   onCancel: () => void
 *   onConfirm: () => void | Promise<void>
 * }} props
 */
export function ConfirmDialog({
  isOpen,
  title,
  message,
  detail = '',
  confirmLabel = 'Eliminar',
  cancelLabel = 'Cancelar',
  isBusy = false,
  tone = 'danger',
  onCancel,
  onConfirm,
}) {
  const titleId = useId()
  const descId = useId()

  useEffect(() => {
    if (!isOpen) return undefined

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    function onKeyDown(event) {
      if (event.key === 'Escape' && !isBusy) onCancel()
    }

    window.addEventListener('keydown', onKeyDown)
    return () => {
      window.removeEventListener('keydown', onKeyDown)
      document.body.style.overflow = previousOverflow
    }
  }, [isBusy, isOpen, onCancel])

  if (!isOpen) return null

  return createPortal(
    <div className="confirmDialogRoot" role="presentation">
      <button
        type="button"
        className="confirmDialogRoot__backdrop"
        aria-label="Cerrar confirmación"
        disabled={isBusy}
        onClick={isBusy ? undefined : onCancel}
      />
      <section
        className={`confirmDialog confirmDialog--${tone}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={descId}
      >
        <div className="confirmDialog__icon" aria-hidden>
          !
        </div>

        <div className="confirmDialog__content">
          <header className="confirmDialog__header">
            <p className="confirmDialog__eyebrow">Confirmación requerida</p>
            <h2 id={titleId} className="confirmDialog__title">
              {title}
            </h2>
          </header>

          <p id={descId} className="confirmDialog__message">
            {message}
          </p>
          {detail ? <p className="confirmDialog__detail">{detail}</p> : null}

          <footer className="confirmDialog__footer">
            <button
              type="button"
              className="confirmDialog__btn confirmDialog__btn--secondary"
              disabled={isBusy}
              onClick={onCancel}
            >
              {cancelLabel}
            </button>
            <button
              type="button"
              className="confirmDialog__btn confirmDialog__btn--danger"
              disabled={isBusy}
              onClick={onConfirm}
            >
              {isBusy ? 'Eliminando...' : confirmLabel}
            </button>
          </footer>
        </div>
      </section>
    </div>,
    document.body,
  )
}

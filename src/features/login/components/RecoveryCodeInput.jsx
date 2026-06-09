import { useCallback, useId, useRef } from 'react'
import './RecoveryCodeInput.css'

const CODE_LENGTH = 5

/**
 * @param {{
 *   value: string
 *   onChange: (value: string) => void
 *   disabled?: boolean
 *   idPrefix?: string
 *   inputRef?: import('react').RefObject<HTMLInputElement | null>
 * }} props
 */
export function RecoveryCodeInput({
  value,
  onChange,
  disabled = false,
  idPrefix = 'recovery-code',
  inputRef,
}) {
  const groupId = useId()
  const localRefs = useRef(/** @type {(HTMLInputElement | null)[]} */ ([]))
  const refs = localRefs

  const digits = Array.from({ length: CODE_LENGTH }, (_, i) => value[i] ?? '')

  const focusAt = useCallback(
    (index) => {
      const el = refs.current[index]
      if (el) {
        el.focus()
        el.select()
      }
    },
    [refs],
  )

  function updateDigit(index, raw) {
    const digit = raw.replace(/\D/g, '').slice(-1)
    const next = digits.slice()
    next[index] = digit
    onChange(next.join('').slice(0, CODE_LENGTH))
    if (digit && index < CODE_LENGTH - 1) {
      focusAt(index + 1)
    }
  }

  function handleKeyDown(index, e) {
    if (e.key === 'Backspace' && !digits[index] && index > 0) {
      e.preventDefault()
      focusAt(index - 1)
      const next = digits.slice()
      next[index - 1] = ''
      onChange(next.join(''))
    }
    if (e.key === 'ArrowLeft' && index > 0) {
      e.preventDefault()
      focusAt(index - 1)
    }
    if (e.key === 'ArrowRight' && index < CODE_LENGTH - 1) {
      e.preventDefault()
      focusAt(index + 1)
    }
  }

  function handlePaste(e) {
    e.preventDefault()
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, CODE_LENGTH)
    if (!pasted) return
    onChange(pasted)
    focusAt(Math.min(pasted.length, CODE_LENGTH - 1))
  }

  return (
    <div
      className="recoveryCodeInput"
      role="group"
      aria-labelledby={`${groupId}-label`}
      onPaste={handlePaste}
    >
      {digits.map((digit, index) => (
        <input
          key={index}
          ref={(el) => {
            refs.current[index] = el
            if (index === 0 && inputRef) {
              inputRef.current = el
            }
          }}
          id={`${idPrefix}-${index}`}
          type="text"
          inputMode="numeric"
          autoComplete={index === 0 ? 'one-time-code' : 'off'}
          className="recoveryCodeInput__digit"
          value={digit}
          maxLength={1}
          disabled={disabled}
          aria-label={`Dígito ${index + 1} de ${CODE_LENGTH}`}
          onChange={(e) => updateDigit(index, e.target.value)}
          onKeyDown={(e) => handleKeyDown(index, e)}
          onFocus={(e) => e.target.select()}
        />
      ))}
    </div>
  )
}

export { CODE_LENGTH }

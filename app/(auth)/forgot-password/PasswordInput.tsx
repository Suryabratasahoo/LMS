import { useState, useEffect } from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { EyeIcon, EyeOffIcon } from 'lucide-react'

interface PasswordInputProps {
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  onStrengthChange?: (strength: number) => void
  placeholder?: string
}

export default function PasswordInput({ value, onChange, onStrengthChange, placeholder }: PasswordInputProps) {
  const [showPassword, setShowPassword] = useState(false)
  const [validationMessages, setValidationMessages] = useState<string[]>([])

  useEffect(() => {
    const messages = []
    let strength = 0

    if (value.length < 8) {
      messages.push('Password must be at least 8 characters long')
    } else {
      strength += 25
    }

    if (!/[A-Z]/.test(value) || !/[a-z]/.test(value)) {
      messages.push('Password must include both uppercase and lowercase letters')
    } else {
      strength += 25
    }

    if (!/\d/.test(value)) {
      messages.push('Password must include at least one number')
    } else {
      strength += 25
    }

    if (!/[!@#$%^&*(),.?":{}|<>]/.test(value)) {
      messages.push('Password must include at least one special character')
    } else {
      strength += 25
    }

    setValidationMessages(messages)
    if (onStrengthChange) {
      onStrengthChange(strength)
    }
  }, [value, onStrengthChange])

  return (
    <div className="space-y-2">
      <Label htmlFor="password">{placeholder || 'Password'}</Label>
      <div className="relative">
        <Input
          id="password"
          type={showPassword ? 'text' : 'password'}
          value={value}
          onChange={onChange}
          className="pr-10"
          placeholder={placeholder}
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600"
        >
          {showPassword ? (
            <EyeOffIcon className="h-5 w-5" />
          ) : (
            <EyeIcon className="h-5 w-5" />
          )}
        </button>
      </div>
      {validationMessages.length > 0 && (
        <ul className="text-sm text-red-500 list-disc list-inside">
          {validationMessages.map((message, index) => (
            <li key={index}>{message}</li>
          ))}
        </ul>
      )}
    </div>
  )
}


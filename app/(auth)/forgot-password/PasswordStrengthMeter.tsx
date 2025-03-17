interface PasswordStrengthMeterProps {
    strength: number
  }
  
  export default function PasswordStrengthMeter({ strength }: PasswordStrengthMeterProps) {
    const getStrengthLabel = (strength: number) => {
      if (strength === 0) return 'Very Weak'
      if (strength <= 25) return 'Weak'
      if (strength <= 50) return 'Moderate'
      if (strength <= 75) return 'Strong'
      return 'Very Strong'
    }
  
    const getStrengthColor = (strength: number) => {
      if (strength === 0) return 'bg-gray-200'
      if (strength <= 25) return 'bg-red-500'
      if (strength <= 50) return 'bg-yellow-500'
      if (strength <= 75) return 'bg-blue-500'
      return 'bg-green-500'
    }
  
    return (
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span>Password Strength:</span>
          <span className="font-medium">{getStrengthLabel(strength)}</span>
        </div>
        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
          <div
            className={`h-full ${getStrengthColor(strength)} transition-all duration-300 ease-in-out`}
            style={{ width: `${strength}%` }}
          ></div>
        </div>
      </div>
    )
  }
  
      
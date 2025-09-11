import * as React from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"

export interface CalendarProps {
  mode?: "single" | "range" | "multiple"
  selected?: Date | undefined
  onSelect?: (date: Date | undefined) => void
  className?: string
  classNames?: Record<string, string>
  showOutsideDays?: boolean
  initialFocus?: boolean
}

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  selected,
  onSelect,
  mode = "single",
  initialFocus = false,
  ...props
}: CalendarProps) {
  const [currentMonth, setCurrentMonth] = React.useState(new Date())
  
  const today = new Date()
  const year = currentMonth.getFullYear()
  const month = currentMonth.getMonth()
  
  const firstDayOfMonth = new Date(year, month, 1)
  const lastDayOfMonth = new Date(year, month + 1, 0)
  const firstDayOfWeek = firstDayOfMonth.getDay()
  const daysInMonth = lastDayOfMonth.getDate()
  
  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ]
  
  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
  
  const days = []
  
  // Add empty cells for days before the first day of the month
  for (let i = 0; i < firstDayOfWeek; i++) {
    days.push(null)
  }
  
  // Add days of the month
  for (let day = 1; day <= daysInMonth; day++) {
    days.push(new Date(year, month, day))
  }
  
  const handlePreviousMonth = () => {
    setCurrentMonth(new Date(year, month - 1, 1))
  }
  
  const handleNextMonth = () => {
    setCurrentMonth(new Date(year, month + 1, 1))
  }
  
  const handleDayClick = (day: Date) => {
    onSelect?.(day)
  }
  
  const isSelected = (day: Date) => {
    if (!selected) return false
    return day.toDateString() === selected.toDateString()
  }
  
  const isToday = (day: Date) => {
    return day.toDateString() === today.toDateString()
  }

  return (
    <div className={cn("p-3", className)}>
      <div className="flex items-center justify-between mb-4">
        <Button
          variant="outline"
          size="sm"
          onClick={handlePreviousMonth}
          className="h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <div className="text-sm font-medium">
          {monthNames[month]} {year}
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={handleNextMonth}
          className="h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
      
      <div className="grid grid-cols-7 gap-1 mb-2">
        {dayNames.map((day) => (
          <div
            key={day}
            className="text-muted-foreground rounded-md w-9 font-normal text-[0.8rem] text-center py-2"
          >
            {day}
          </div>
        ))}
      </div>
      
      <div className="grid grid-cols-7 gap-1">
        {days.map((day, index) => {
          if (!day) {
            return <div key={index} className="h-9 w-9" />
          }
          
          return (
            <button
              key={index}
              onClick={() => handleDayClick(day)}
              className={cn(
                buttonVariants({ variant: "ghost" }),
                "h-9 w-9 p-0 font-normal",
                isSelected(day) && "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
                isToday(day) && !isSelected(day) && "bg-accent text-accent-foreground",
                "hover:bg-accent hover:text-accent-foreground"
              )}
            >
              {day.getDate()}
            </button>
          )
        })}
      </div>
    </div>
  )
}
Calendar.displayName = "Calendar"

export { Calendar }

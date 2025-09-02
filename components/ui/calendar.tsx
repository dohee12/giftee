'use client'

import * as React from 'react'
import {
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from 'lucide-react'
import { DayButton, DayPicker, getDefaultClassNames } from 'react-day-picker'

import { cn } from '@/lib/utils'
import { Button, buttonVariants } from '@/components/ui/button'

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  captionLayout = 'label',
  buttonVariant = 'ghost',
  formatters,
  components,
  getDayBadge,
  ...props
}: React.ComponentProps<typeof DayPicker> & {
  buttonVariant?: React.ComponentProps<typeof Button>['variant']
  getDayBadge?: (date: Date) => string | null
}) {
  const defaultClassNames = getDefaultClassNames()

  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn(
        'bg-background group/calendar p-0 [--cell-size:--spacing(8)] [[data-slot=card-content]_&]:bg-transparent [[data-slot=popover-content]_&]:bg-transparent',
        String.raw`rtl:**:[.rdp-button\_next>svg]:rotate-180`,
        String.raw`rtl:**:[.rdp-button\_previous>svg]:rotate-180`,
        className
      )}
      captionLayout={captionLayout}
      formatters={{
        formatMonthDropdown: date =>
          date.toLocaleString('default', { month: 'short' }),
        formatWeekdayName: date =>
          date.toLocaleDateString('en-US', { weekday: 'short' }),
        ...formatters,
      }}
      classNames={{
        root: cn('w-fit', defaultClassNames.root),
        months: cn(
          'flex gap-1 flex-col md:flex-row relative',
          defaultClassNames.months
        ),
        month: cn('flex flex-col w-full gap-1', defaultClassNames.month),
        nav: cn(
          'flex items-center gap-1 w-full absolute top-0 inset-x-0 justify-between',
          defaultClassNames.nav
        ),
        button_previous: cn(
          buttonVariants({ variant: buttonVariant }),
          'size-[--cell-size] aria-disabled:opacity-50 p-0 select-none',
          defaultClassNames.button_previous
        ),
        button_next: cn(
          buttonVariants({ variant: buttonVariant }),
          'size-[--cell-size] aria-disabled:opacity-50 p-0 select-none',
          defaultClassNames.button_next
        ),
        month_caption: cn(
          'flex items-center justify-center h-[calc(var(--cell-size)*0.6)] w-full px-2 -mb-2',
          defaultClassNames.month_caption
        ),
        dropdowns: cn(
          'w-full flex items-center text-xs font-medium justify-center h-6 gap-1',
          defaultClassNames.dropdowns
        ),
        dropdown_root: cn(
          'relative has-focus:border-ring border border-input shadow-xs has-focus:ring-ring/50 has-focus:ring-[3px] rounded-md',
          defaultClassNames.dropdown_root
        ),
        dropdown: cn(
          'absolute bg-popover inset-0 opacity-0',
          defaultClassNames.dropdown
        ),
        caption_label: cn(
          'select-none font-semibold',
          captionLayout === 'label'
            ? 'text-base'
            : 'rounded-md pl-2 pr-2 flex items-center gap-1 text-base h-9 [&>svg]:text-muted-foreground [&>svg]:size-4',
          defaultClassNames.caption_label
        ),
        table: 'w-full border-collapse',
        weekdays: cn('flex mb-[-75px] border-b border-border translate-y-[11px]', defaultClassNames.weekdays),
        weekday: cn(
          'text-muted-foreground rounded-md flex-1 font-normal text-xs leading-none select-none',
          defaultClassNames.weekday
        ),
        week: cn(
          'relative flex w-full mt-0',
          defaultClassNames.week
        ),
        week_number_header: cn(
          'select-none w-[--cell-size]',
          defaultClassNames.week_number_header
        ),
        week_number: cn(
          'text-[0.8rem] select-none text-muted-foreground',
          defaultClassNames.week_number
        ),
        day: cn(
          'relative w-full h-full p-0 text-center group/day aspect-square select-none flex items-center justify-center translate-y-[3px] [&>button]:z-10',
          defaultClassNames.day
        ),
        range_start: cn(
          'rounded-l-md bg-accent',
          defaultClassNames.range_start
        ),
        range_middle: cn('rounded-none', defaultClassNames.range_middle),
        range_end: cn('rounded-r-md bg-accent', defaultClassNames.range_end),
        today: cn(
          defaultClassNames.today
        ),
        outside: cn(
          'text-muted-foreground aria-selected:text-muted-foreground opacity-60 pointer-events-none [&>button]:cursor-default [&>button]:opacity-50 [&>button]:scale-90 md:[&>button]:scale-[.6] [&>button>span]:text-[10px] md:[&>button>span]:text-[11px]',
          defaultClassNames.outside
        ),
        disabled: cn(
          'text-muted-foreground opacity-50',
          defaultClassNames.disabled
        ),
        hidden: cn('invisible', defaultClassNames.hidden),
        ...classNames,
      }}
      components={{
        Root: ({ className, rootRef, ...props }) => {
          return (
            <div
              data-slot="calendar"
              ref={rootRef}
              className={cn(className)}
              {...props}
            />
          )
        },
        Chevron: ({ className, orientation, ...props }) => {
          if (orientation === 'left') {
            return (
              <ChevronLeftIcon className={cn('size-4', className)} {...props} />
            )
          }

          if (orientation === 'right') {
            return (
              <ChevronRightIcon
                className={cn('size-4', className)}
                {...props}
              />
            )
          }

          return (
            <ChevronDownIcon className={cn('size-4', className)} {...props} />
          )
        },
        DayButton: (p) => <CalendarDayButton {...p} getDayBadge={getDayBadge} />,
        WeekNumber: ({ children, ...props }) => {
          return (
            <td {...props}>
              <div className="flex size-[--cell-size] items-center justify-center text-center">
                {children}
              </div>
            </td>
          )
        },
        ...components,
      }}
      {...props}
    />
  )
}

function CalendarDayButton({
  className,
  day,
  modifiers,
  getDayBadge,
  ...props
}: React.ComponentProps<typeof DayButton> & { getDayBadge?: (date: Date) => string | null }) {
  const defaultClassNames = getDefaultClassNames()

  const ref = React.useRef<HTMLButtonElement>(null)
  React.useEffect(() => {
    if (modifiers.focused) ref.current?.focus()
  }, [modifiers.focused])

  const badgeText = getDayBadge ? getDayBadge(day.date) : null

  return (
    <Button
      ref={ref}
      variant="ghost"
      size="icon"
      data-day={day.date.toLocaleDateString()}
      data-selected-single={
        modifiers.selected &&
        !modifiers.range_start &&
        !modifiers.range_end &&
        !modifiers.range_middle
      }
      data-range-start={modifiers.range_start}
      data-range-end={modifiers.range_end}
      data-range-middle={modifiers.range_middle}
      className={cn(
        // hover는 연한 배경, 선택 시 얇은(지름 축소) 채워진 원을 숫자 뒤에 표시
        'relative flex aspect-square w-full min-w-[--cell-size] items-center justify-center rounded-full transition-colors [&>span]:relative [&>span]:z-10 [&>span>*]:relative [&>span>*]:z-10 [&>span>time]:relative [&>span>time]:z-10 hover:bg-transparent',
        // Hover: same circular shape and color as selected, no extra bg
        "before:content-[''] before:absolute before:left-1/2 before:top-1/2 before:-translate-x-1/2 before:-translate-y-1/2 before:w-[19px] before:h-[19px] before:rounded-full before:bg-amber-400 before:opacity-0 hover:before:opacity-100",
        // Selected: filled circle (same as hover)
        "data-[selected-single=true]:text-white data-[selected-single=true]:[&_*]:text-white data-[selected-single=true]:after:content-[''] data-[selected-single=true]:after:absolute data-[selected-single=true]:after:left-1/2 data-[selected-single=true]:after:top-1/2 data-[selected-single=true]:after:-translate-x-1/2 data-[selected-single=true]:after:-translate-y-1/2 data-[selected-single=true]:after:w-[19px] data-[selected-single=true]:after:h-[19px] data-[selected-single=true]:after:bg-amber-400 data-[selected-single=true]:after:rounded-full data-[selected-single=true]:after:z-0 data-[selected-single=true]:before:opacity-0",
        // Remove focus ring/outline to avoid extra shape
        'focus:outline-none focus-visible:outline-none outline-none ring-0 group-data-[focused=true]/day:ring-0',
        defaultClassNames.day,
        className
      )}
      {...props}
    >
      <span className="relative z-10 pointer-events-none">{props.children}</span>
      {badgeText ? (
        <div className="absolute left-1/2 -translate-x-1/2 bottom-[-2px] pointer-events-none">
          <span className="inline-block w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-rose-500"></span>
        </div>
      ) : null}
    </Button>
  )
}

export { Calendar, CalendarDayButton }

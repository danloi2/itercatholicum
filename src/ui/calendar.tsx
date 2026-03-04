'use client';

import * as React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { DayPicker } from 'react-day-picker';

import { cn } from '@shared/lib/utils';
import { buttonVariants } from './button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './select';

export type CalendarProps = React.ComponentProps<typeof DayPicker>;

function Calendar({ className, classNames, showOutsideDays = true, ...props }: CalendarProps) {
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn('p-3', className)}
      classNames={{
        /* Layout general */
        months: 'flex flex-col gap-3',
        month: 'space-y-2',

        /* Header */
        month_caption: 'flex items-center justify-between h-8 px-1',
        caption_label: 'text-sm font-medium',

        nav: 'flex items-center gap-1',

        button_previous: cn(
          buttonVariants({ variant: 'ghost' }),
          'h-7 w-7 p-0 opacity-60 hover:opacity-100'
        ),
        button_next: cn(
          buttonVariants({ variant: 'ghost' }),
          'h-7 w-7 p-0 opacity-60 hover:opacity-100'
        ),

        dropdowns: 'flex gap-1',

        /* Grid */
        month_grid: 'w-full border-collapse',

        weekdays: 'flex justify-between',
        weekday: 'w-8 text-[11px] font-medium text-muted-foreground text-center',

        week: 'flex justify-between',

        /* Día wrapper */
        day: 'text-center',

        /* Botón del día */
        day_button: cn(
          buttonVariants({ variant: 'ghost' }),
          'h-8 w-8 p-0 text-sm font-medium rounded-md aria-selected:opacity-100'
        ),

        /* Estados */
        selected:
          'bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground transition-colors',

        today: 'bg-accent text-accent-foreground',

        outside: 'text-muted-foreground opacity-40 aria-selected:bg-accent/40',

        disabled: 'text-muted-foreground opacity-30',

        range_start: 'rounded-l-md bg-primary text-primary-foreground',
        range_end: 'rounded-r-md bg-primary text-primary-foreground',
        range_middle: 'aria-selected:bg-accent aria-selected:text-accent-foreground',

        hidden: 'invisible',

        ...classNames,
      }}
      components={{
        Chevron: ({ orientation }) =>
          orientation === 'left' ? (
            <ChevronLeft className="h-4 w-4" />
          ) : (
            <ChevronRight className="h-4 w-4" />
          ),

        Dropdown: ({ value, onChange, options }) => {
          const selected = options?.find((option) => option.value === value);

          const handleChange = (value: string) => {
            const changeEvent = {
              target: { value },
            } as React.ChangeEvent<HTMLSelectElement>;
            onChange?.(changeEvent);
          };

          return (
            <Select value={value?.toString()} onValueChange={(value) => handleChange(value)}>
              <SelectTrigger className="h-7 px-1 text-xs font-medium border-none shadow-none bg-transparent hover:bg-accent focus:ring-0">
                <SelectValue>{selected?.label}</SelectValue>
              </SelectTrigger>

              <SelectContent position="popper">
                {options?.map((option) => (
                  <SelectItem
                    key={option.value}
                    value={option.value.toString()}
                    className="text-xs"
                  >
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          );
        },
      }}
      {...props}
    />
  );
}

Calendar.displayName = 'Calendar';

export { Calendar };

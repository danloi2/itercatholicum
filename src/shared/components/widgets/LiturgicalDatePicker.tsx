'use client';

import * as React from 'react';
import { format } from 'date-fns';
import { Calendar as CalendarIcon } from 'lucide-react';
import { es } from 'date-fns/locale';

import { cn } from '@shared/lib/utils';
import { Button } from '@ui/button';
import { Calendar } from '@ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@ui/popover';
import { la } from '@shared/lib/locales';

interface LiturgicalDatePickerProps {
  date?: Date;
  onSelect: (date: Date | undefined) => void;
  language: 'es' | 'la';
  trigger?: React.ReactNode;
}

export function LiturgicalDatePicker({
  date,
  onSelect,
  language,
  trigger,
}: LiturgicalDatePickerProps) {
  const [open, setOpen] = React.useState(false);

  const label = language === 'la' ? 'Dies Selectio' : 'Elige una fecha';

  const currentLocale = language === 'la' ? la : es;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        {trigger || (
          <Button
            variant={'outline'}
            className={cn(
              'w-[280px] justify-start text-left font-normal border-[#c49b9b]/30 bg-white/50 backdrop-blur-sm hover:bg-white/80 transition-all duration-300',
              !date && 'text-muted-foreground'
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4 text-[#8B0000]" />
            {date ? (
              format(date, 'PPP', { locale: currentLocale })
            ) : (
              <span className="font-serif italic">{label}</span>
            )}
          </Button>
        )}
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0 border-[#c49b9b]/20 shadow-xl" align="start">
        <Calendar
          mode="single"
          selected={date}
          onSelect={(d) => {
            onSelect(d);
            setOpen(false);
          }}
          initialFocus
          locale={currentLocale}
          className="font-serif"
          captionLayout="dropdown"
          fromYear={1900}
          toYear={2100}
        />
      </PopoverContent>
    </Popover>
  );
}

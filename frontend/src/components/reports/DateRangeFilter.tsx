import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { CalendarDays } from 'lucide-react';

interface DateRangeFilterProps {
  startDate: string;
  endDate: string;
  onStartDateChange: (date: string) => void;
  onEndDateChange: (date: string) => void;
  onApply: () => void;
}

export default function DateRangeFilter({
  startDate,
  endDate,
  onStartDateChange,
  onEndDateChange,
  onApply,
}: DateRangeFilterProps) {
  return (
    <div className="flex items-end gap-2">
      <div className="flex-1 space-y-1">
        <Label className="text-xs text-muted-foreground">From</Label>
        <Input
          type="date"
          value={startDate}
          onChange={e => onStartDateChange(e.target.value)}
          className="h-9 text-sm"
        />
      </div>
      <div className="flex-1 space-y-1">
        <Label className="text-xs text-muted-foreground">To</Label>
        <Input
          type="date"
          value={endDate}
          onChange={e => onEndDateChange(e.target.value)}
          className="h-9 text-sm"
        />
      </div>
      <Button onClick={onApply} size="sm" className="h-9 px-3 shrink-0">
        <CalendarDays size={14} />
      </Button>
    </div>
  );
}

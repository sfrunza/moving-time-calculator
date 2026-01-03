import { Input } from '@/components/ui/input';

export function NumberInput({
  value,
  setValue,
  ...rest
}: React.ComponentProps<'input'> & {
  setValue: (value: number | string) => void;
}) {
  return (
    <Input
      type="number"
      inputMode="numeric"
      pattern="[0-9]*"
      value={value}
      onChange={(e) => {
        const input = e.target.value;
        // Allow empty string or valid number string
        if (input === '' || /^-?\d*\.?\d*$/.test(input)) {
          setValue(input);
        }
      }}
      onBlur={() => {
        if (value === '') {
          setValue(0);
        }
      }}
      {...rest}
    />
  );
}

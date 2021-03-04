import * as React from 'react';
import { Select } from '@supabase/ui';

const { Option } = Select;

interface SelectEditorProps {
  value: string;
  onChange: (value: string) => void;
  options: string[];
}

export function SelectEditor({ value, onChange, options }: SelectEditorProps) {
  function onChangeHandle(event: React.ChangeEvent<HTMLSelectElement>) {
    onChange(event.target.value);
  }

  return (
    <Select
      value={value}
      layout="vertical"
      onChange={onChangeHandle}
      size="tiny"
    >
      {options.map(x => {
        return (
          <Option key={x} value={x}>
            {x}
          </Option>
        );
      })}
    </Select>
  );
}

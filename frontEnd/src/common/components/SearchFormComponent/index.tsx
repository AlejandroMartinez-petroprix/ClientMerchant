"use client";

import { useState } from "react";
import { Input, Checkbox } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import { useSearchParams, usePathname, useRouter } from "next/navigation";
import { useDebouncedCallback } from "use-debounce";

interface SearchFormProps {
  fields: { key: string; label: string; placeholder: string; type?: string }[];
  errorMessage: string;
  title: string;
  simpleOutput: boolean;
  onSimpleOutputChange?: (checked: boolean) => void;
}

const SearchForm: React.FC<SearchFormProps> = ({ fields, title, simpleOutput, onSimpleOutputChange }) => {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  const [localSimpleOutput, setLocalSimpleOutput] = useState(simpleOutput);
  
  const initialState = fields.reduce((acc, field) => {
    acc[field.key] = searchParams.get(field.key) || "";
    return acc;
  }, {} as Record<string, string>);

  const [search, setSearch] = useState(initialState);
  const [hasSearched, setHasSearched] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateSearchParams = (newSearch: Record<string, string>) => {
    const params = new URLSearchParams();
    Object.entries(newSearch).forEach(([key, value]) => {
      if (value) params.set(key, value);
    });

    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };

  const debouncedSearch = useDebouncedCallback(async () => {
    updateSearchParams(search);
    setError(null);
    setHasSearched(true);
  }, 500);

  const handleChange = (key: string, value: string) => {
    setSearch((prevSearch) => ({ ...prevSearch, [key]: value }));
    debouncedSearch();
  };

  const handleSimpleOutputChange = (checked: boolean) => {
    setLocalSimpleOutput(checked);
    if (onSimpleOutputChange) {
      onSimpleOutputChange(checked);
    }
    debouncedSearch();
  };

  return (
    <div className="p-4 shadow rounded">
      <h2 className="text-xl font-bold mb-4">{title}</h2>
  
      <div className="grid grid-cols-3 gap-4 mb-4">
        {fields.map((field) => (
          <div key={field.key} className="flex flex-col">
            <label className="block font-medium">{field.label}</label>
            <Input
              placeholder={field.placeholder}
              value={search[field.key]}
              onChange={(e) => handleChange(field.key, e.target.value)}
              prefix={<SearchOutlined />}
              type={field.type || "text"}
            />
            {field.key === "id" && (
              <Checkbox
                checked={localSimpleOutput}
                onChange={(e) => handleSimpleOutputChange(e.target.checked)}
                className="mt-2"
              >
                Activar Simple Output
              </Checkbox>
            )}
          </div>
        ))}
      </div>
  
      {hasSearched && error && <p className="text-red-500">{error}</p>}
    </div>
  );
};

export default SearchForm;

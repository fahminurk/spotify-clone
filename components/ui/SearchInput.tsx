"use client";

import useDebounce from "@/hooks/useDebounce";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import qs from "query-string";
import Input from "./Input";

const SearchInput = () => {
  const router = useRouter();
  const [value, setValue] = useState<string>("");
  const debounceValue = useDebounce<string>(value, 1000);

  useEffect(() => {
    const url = qs.stringifyUrl({
      url: "/search",
      query: { title: debounceValue },
    });

    router.push(url);
  }, [debounceValue, router]);
  return (
    <Input
      onChange={(e) => setValue(e.target.value)}
      value={value}
      placeholder="Search"
    />
  );
};

export default SearchInput;

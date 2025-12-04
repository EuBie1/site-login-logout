import { InputHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {}

export function Input(props: InputProps){
  return(
    <input
      className="h-10 w-full rounded-md border border-zinc-300 bg-white px-3 text-zinc-900 placeholder:text-zinc-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-300 outline-none mb-3"
      {...props}
    />
  )
}

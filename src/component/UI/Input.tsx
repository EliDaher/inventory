interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

export default function Input({ label, ...props }: InputProps) {
  return (
    <div className="mb-4">
      {label && <label className="block mb-1 text-light-text dark:text-dark-text select-none">{label}</label>}
      <input
        {...props}
        className="select-none w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-dark-card text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-light-primary dark:focus:ring-dark-primary"
      />
    </div>
  );
}

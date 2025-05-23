
interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
}

export default function Button({ children, onClick, className = "" }: ButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`bg-primary dark:bg-dark-primary text-white px-4 py-2 rounded-md hover:bg-primary-hover dark:hover:bg-dark-primary-hover transition ${className}`}
    >
      {children}
    </button>
  );
}

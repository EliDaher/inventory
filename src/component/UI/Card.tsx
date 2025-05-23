interface CardProps {
  children: React.ReactNode;
  className?: string;
}

export default function Card({ children, className = "" }: CardProps) {
  return (
    <div dir="rtl" className={`bg-light-card dark:bg-dark-card shadow-lg p-4 rounded-lg ${className}`}>
      {children}
    </div>
  );
}

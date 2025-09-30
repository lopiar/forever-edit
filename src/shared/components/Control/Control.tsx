interface ControlProps {
  label: string;
  children: React.ReactNode;
}

export function Control({ label, children }: ControlProps) {
  return (
    <>
      <label>{label}</label>
      <div>{children}</div>
    </>
  );
}

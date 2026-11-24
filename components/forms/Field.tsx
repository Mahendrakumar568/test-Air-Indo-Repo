type Props = {
  id: string;
  label: string;
  optional?: string;
  error?: string;
  children: React.ReactNode;
};

export function Field({ id, label, optional, error, children }: Props) {
  return (
    <div className="field">
      <label htmlFor={id}>
        {label} {optional && <span className="opt">({optional})</span>}
      </label>
      {children}
      {error && (
        <span className="err" id={`${id}-err`}>
          {error}
        </span>
      )}
    </div>
  );
}

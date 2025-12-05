export default function IconButton({ ariaLabel, className = "", ...rest }) {
  return (
    <button
      aria-label={ariaLabel}
      className={
        "inline-flex items-center justify-center rounded-full p-2 hover:bg-neutral-100 active:bg-neutral-200 transition " +
        className
      }
      {...rest}
    />
  );
}

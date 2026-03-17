"use client";

interface SideSelectorProps {
  /** Available side options for the dish */
  sides: string[];
  /** Currently selected side */
  value: string;
  /** Called when a side is selected */
  onChange: (side: string) => void;
}

/**
 * Radio-style side picker with glass-styled option pills.
 *
 * Controlled component that renders each available side as a
 * selectable pill button with visual feedback for the active state.
 */
export { SideSelector };
export default function SideSelector({
  sides,
  value,
  onChange,
}: SideSelectorProps) {
  if (sides.length === 0) return null;

  return (
    <fieldset className="flex flex-col gap-2">
      <legend className="text-sm font-medium text-text-secondary">
        Choose a side
      </legend>
      <div className="flex flex-wrap gap-2" role="radiogroup">
        {sides.map((side) => {
          const isSelected = value === side;

          return (
            <button
              key={side}
              type="button"
              role="radio"
              aria-checked={isSelected}
              onClick={() => onChange(side)}
              className={`
                rounded-full px-4 py-1.5 text-sm
                border transition-colors duration-200
                touch-action-manipulation
                focus-visible:outline-none focus-visible:ring-2
                focus-visible:ring-brand-lemon-dark dark:focus-visible:ring-brand-lemon focus-visible:ring-offset-2
                focus-visible:ring-offset-white dark:focus-visible:ring-offset-brand-dark
                ${
                  isSelected
                    ? "border-brand-lemon-dark dark:border-brand-lemon bg-brand-lemon-dark/10 dark:bg-brand-lemon/10 text-brand-lemon-dark dark:text-brand-lemon"
                    : "border-glass-border bg-glass-bg text-text-secondary hover:border-glass-hover hover:text-text-primary"
                }
              `}
            >
              {side}
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}

import React from "react"
import { useIncrement } from "~/hooks/useMagicNumber"

export type ButtonIncrementProps = React.ComponentPropsWithoutRef<"button">

export const ButtonIncrement = React.forwardRef<
  React.ElementRef<"button">,
  ButtonIncrementProps
>(function ButtonIncrementComponent({ onClick, className, ...props }, ref) {
  // const increment = useIncrement(undefined, ["magic-number", 30])
  const increment = useIncrement(undefined, ["magic-number"])

  return (
    <button
      ref={ref}
      onClick={e => {
        increment()
        onClick?.(e)
      }}
      {...props}
    />
  )
})

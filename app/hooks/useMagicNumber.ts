import { createActionHookFactory } from "~/hooks/createHookFactory"

export const [MagicNumberProvider, createActionHook] =
  createActionHookFactory<number>(["magic-number"])

export const useIncrement = createActionHook(() => {
  return oldValue => oldValue + 1
})

export const useDecrement = createActionHook(() => {
  return oldValue => oldValue - 1
})

export const useDouble = createActionHook(() => {
  return oldValue => oldValue * 2
})

export const useSet = createActionHook((value: number) => {
  return () => value
})

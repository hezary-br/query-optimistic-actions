import { QueryClient, QueryKey, useQueryClient } from "@tanstack/react-query"
import { produce } from "immer"
import { createContext, useContext } from "react"

type Action<T> = (previousValue: T) => void
type GenericActionHook<T, TArgs extends any[]> = (...args: TArgs) => Action<T>

export function createQuerySetter<T>(
  queryClient: QueryClient,
  queryKey: QueryKey
) {
  return function querySetter(setter: (previousValue: T) => T) {
    queryClient.setQueryData<T>(queryKey, previousValue => {
      if (!previousValue)
        throw new Error(
          `There is no record on query provider with key [${queryKey}]`
        )
      return setter(previousValue)
    })
  }
}

type QueryKeyProviderProps = {
  children?: React.ReactNode
  queryKey: QueryKey
}

export function createActionHookFactory<T>(rootQueryKey?: QueryKey) {
  const QueryKeyContext = createContext<QueryKey | undefined>(rootQueryKey)

  function QueryKeyProvider({ children, queryKey }: QueryKeyProviderProps) {
    return (
      <QueryKeyContext.Provider value={queryKey}>
        {children}
      </QueryKeyContext.Provider>
    )
  }

  const createActionHook = function createActionHook<TArgs extends any[]>(
    action: GenericActionHook<T, TArgs>
  ) {
    return function hook(queryClient?: QueryClient, queryKey?: QueryKey) {
      queryClient ??= useQueryClient()
      queryKey ??= useContext(QueryKeyContext)
      queryKey ??= rootQueryKey
      if (!queryKey) throw new Error("No query key found for this hook.")
      const querySetter = createQuerySetter(queryClient, queryKey)

      return (...args: TArgs) =>
        querySetter(currentValue => produce(currentValue, action(...args)))
    }
  }

  return [QueryKeyProvider, createActionHook] as const
}

// export function QueryKeyProvider({ children }: PropsWithChildren) {
//   const [queryKeysList] = useState(() => new Map())

//   return (
//     <QueryKeyContext.Provider value={queryKeysList}>
//       {children}
//     </QueryKeyContext.Provider>
//   )
// }

import type { LoaderFunctionArgs, MetaFunction } from "@remix-run/node"
import { useLoaderData } from "@remix-run/react"
import {
  HydrationBoundary,
  QueryClient,
  dehydrate,
  useQueryClient,
} from "@tanstack/react-query"
import { ButtonIncrement } from "~/components/ButtonIncrement"
import { MagicNumber } from "~/components/MagicNumber"
import {
  MagicNumberProvider,
  useDecrement,
  useDouble,
  useIncrement,
  useSet,
} from "~/hooks/useMagicNumber"

export const meta: MetaFunction = () => {
  return [
    { title: "New Remix App" },
    { name: "description", content: "Welcome to Remix!" },
  ]
}

async function getMagicNumber() {
  await new Promise(res => setTimeout(res, 1500))
  return parseInt(Math.random().toString().slice(2, 7))
}

export async function loader({}: LoaderFunctionArgs) {
  const queryClient = new QueryClient()

  await Promise.all([
    queryClient.prefetchQuery({
      queryKey: ["magic-number"],
      queryFn: getMagicNumber,
    }),
    queryClient.prefetchQuery({
      queryKey: ["magic-number", 30],
      queryFn: getMagicNumber,
    }),
  ])

  return {
    dehydratedState: dehydrate(queryClient),
  }
}

export default function Index() {
  const { dehydratedState } = useLoaderData<typeof loader>()
  const queryClient = useQueryClient()

  const decrement = useDecrement(queryClient)
  const double = useDouble(queryClient)
  const set = useSet(queryClient)

  return (
    <HydrationBoundary state={dehydratedState}>
      <div style={{ display: "flex", flexDirection: "column" }}>
        {/* <MagicNumberProvider queryKey={["magic-number", 30]}> */}
        <ButtonIncrement>increment</ButtonIncrement>
        {/* </MagicNumberProvider> */}
        <button onClick={decrement}>Decrement</button>
        <button onClick={double}>Double</button>
        <input
          type="number"
          onBlur={e => {
            set(parseInt(e.target.value))
          }}
        />
      </div>
      <div style={{ display: "flex", flexDirection: "column" }}>
        <MagicNumber />
        <MagicNumber props={[30]} />
      </div>
      <pre>{JSON.stringify({ dehydratedState }, null, 2)}</pre>
    </HydrationBoundary>
  )
}

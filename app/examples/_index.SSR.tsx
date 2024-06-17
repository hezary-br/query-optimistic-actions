import type { LoaderFunctionArgs, MetaFunction } from "@remix-run/node"
import { useLoaderData } from "@remix-run/react"
import {
  HydrationBoundary,
  QueryClient,
  dehydrate,
} from "@tanstack/react-query"

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

  await queryClient.prefetchQuery({
    queryKey: ["magic-number"],
    queryFn: getMagicNumber,
  })

  return {
    dehydratedState: dehydrate(queryClient),
  }
}

export default function Index() {
  const { dehydratedState } = useLoaderData<typeof loader>()

  return (
    <HydrationBoundary state={dehydratedState}>
      <pre>{JSON.stringify({ dehydratedState }, null, 2)}</pre>
    </HydrationBoundary>
  )
}

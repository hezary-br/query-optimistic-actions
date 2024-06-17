import { useQuery } from "@tanstack/react-query"

type MagicNumberProps = {
  props?: any[]
}

export function MagicNumber({ props = [] }: MagicNumberProps) {
  const { data } = useQuery({
    queryKey: ["magic-number", ...props],
  })

  return (
    <>
      <pre>{JSON.stringify({ props }, null, 2)}</pre>
      {data}
    </>
  )
}

import type { Mowing, MowingLocation } from "@prisma/client";
import type { NextPage } from "next";
import { NextRouter, useRouter } from "next/router";
import { trpc } from "../../utils/trpc";

type Mow = Mowing & { location: MowingLocation }

const MowingRow = ({ mowing, router }: { mowing: Mow, router: NextRouter }) => {

  const edit = (id: string) => {
    router.push(`/mowing/${id}`)
  }

  return (
    <tr className="flex w-full hover:bg-green-100 border-b border-collapse border-slate-500 text-lg"
      onClick={() => edit(mowing.id)}>
      <td className="w-1/4">{mowing.location.name}</td>
      <td className="w-1/4">{mowing.direction}</td>
      <td className="w-1/2">{mowing.date.toDateString()} </td>
    </tr>
  )
}

const MowingTable = ({ mowings }: { mowings: Array<Mow> }) => {
  const router = useRouter()
  return (
    <table className="text-left w-full max-w-md m-auto">
      <thead className="flex w-full">
        <tr className="flex w-full bg-green-500 text-neutral-100 px-2">
          <td className="w-1/4">Location</td>
          <td className="w-1/4">Direction</td>
          <td className="w-1/2">Date</td>
        </tr>
      </thead>
      <tbody className="h-[50vh] flex flex-col overflow-y-auto w-full px-2">
        {mowings.map(mow => <MowingRow key={mow.id} mowing={mow} router={router} />)}
      </tbody>
    </table>
  )
}

const MowingPage: NextPage = () => {

  const mowingQuery = trpc.useQuery(["mowing.getAll"])
  if (!mowingQuery.data)
    return (
      <>
        <h1>Mowings</h1>
        <p>Loading...</p>
      </>
    )
  else {
    return (
      <>
        <div className="container m-auto p-8 h-screen overflow-y-hidden">
          <h1 className="text-center text-3xl">Mowing</h1>
          <MowingTable mowings={mowingQuery.data} />
          <div className="max-w-md m-auto">
            <a href="/mowing/new" className="bg-green-500 rounded-lg px-8 py-2 text-neutral-50 text-2xl mt-8 float-right">+</a>
          </div>
        </div>
      </>
    )
  }
}

export default MowingPage

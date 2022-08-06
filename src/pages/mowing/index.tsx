import type { Mowing, MowingLocation } from "@prisma/client";
import type { NextPage } from "next";
import { NextRouter, useRouter } from "next/router";
import { trpc } from "../../utils/trpc";

type Mow = Mowing & { location: MowingLocation }

const MowTD = ({ text }: { text: string }) => {
  return (
    <td className="w-1/3">{text}</td>
  )
}

const MowTH = ({ text }: { text: string }) => {
  return (
    <th className="w-1/3">{text}</th>
  )
}

const MowingRow = ({ mowing, router }: { mowing: Mow, router: NextRouter }) => {

  const edit = (id: string) => {
    router.push(`/mowing/${id}`)

  }

  return (
    <tr className="flex w-full hover:bg-green-100 border-b border-collapse border-slate-500 text-lg"
      onClick={() => edit(mowing.id)}>
      <MowTD text={mowing.location.name} />
      <MowTD text={mowing.direction} />
      <MowTD text={mowing.date.toDateString()} />
    </tr>
  )
}

const MowingTable = ({ mowings }: { mowings: Array<Mow> }) => {
  const router = useRouter()
  return (
    <div className="">
      <table className="text-left w-full">
        <thead className="flex w-full">
          <tr className="flex w-full">
            <MowTH text="Location" />
            <MowTH text="Direction" />
            <MowTH text="Date" />
          </tr>
        </thead>
        <tbody className="h-[75vh] flex flex-col items-center justify-between overflow-y-auto w-full">
          {mowings.map(mow => <MowingRow key={mow.id} mowing={mow} router={router} />)}
        </tbody>
      </table>
    </div>
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
  else
    return (
      <>
        <div className="container m-auto p-8 h-screen overflow-y-hidden">
          <h1 className="text-center text-3xl">Mowing</h1>
          <MowingTable mowings={mowingQuery.data} />
        </div>
      </>
    )
}

export default MowingPage

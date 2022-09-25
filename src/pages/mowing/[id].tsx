import { trpc } from "../../utils/trpc";
import { NextPage } from "next"
import MowingForm from "../../server/mowing/mowing-form";
import { useRouter } from "next/router";


const EditPage: NextPage = () => {

  const router = useRouter()

  const locationQuery = trpc.useQuery(["location.getLocations"])
  const mowQuery = trpc.useQuery(["mowing.findMowing", router.query.id as string])

  if (!locationQuery.data || !mowQuery.data)
    return (
      <div className="w-screen h-screen">
        <p className="mar text-5xl mt-[50vh] text-center" >...</p>
      </div>
    )
  else
    return (
      <>
        <div className="container m-auto p-8 h-screen overflow-y-hidden">
          <h1 className="text-center text-3xl">Edit Mowing</h1>
          <MowingForm locations={locationQuery.data} mowing={mowQuery.data}/>
        </div>
      </>
    )
}

export default EditPage

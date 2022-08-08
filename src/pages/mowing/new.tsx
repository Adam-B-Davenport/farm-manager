import { trpc } from "../../utils/trpc";
import { NextPage } from "next"
import MowingForm from "../../server/mowing/mowing-form";
import { useRouter } from "next/router";

const NewPage: NextPage = () => {
  const locationQuery = trpc.useQuery(["mowing.getLocations"])
  const router = useRouter()
  const loader = (
      <div className="w-screen h-screen">
        <p className="mar text-5xl mt-[50vh] text-center" >...</p>
      </div>
    )
  if (locationQuery.data && locationQuery.data.length === 0){
    router.push('/location/new')
    return loader
  }
  if (!locationQuery.data)
    return loader
  else
    return (
      <>
        <div className="container m-auto p-8 h-screen overflow-y-hidden">
          <h1 className="text-center text-3xl">New Mowing</h1>
          <MowingForm locations={locationQuery.data} />
        </div>
      </>
    )
}

export default NewPage

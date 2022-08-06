import { Mowing, MowingLocation } from "@prisma/client";
import { NextPage } from "next"
import { useRouter } from "next/router";
import { ChangeEvent, useEffect, useState } from "react";
import { trpc } from "../../utils/trpc";

const Directions = [
  { value: "N", display: "North" },
  { value: "E", display: "East" },
  { value: "NE", display: "Northeast" },
  { value: "NW", display: "Northwest" },
]

const MowingForm = ({ locations, mowing }: { locations: Array<MowingLocation>, mowing?: Mowing }) => {
  const [location, setLocation] = useState(locations[0].id)
  const router = useRouter()
  const mutation = trpc.useMutation(['mowing.createMowing'])

  useEffect(() => {
    if (mowing) {
      setLocation(mowing.locationId)
    }
  }, [])

  const locationChanged = (event: ChangeEvent<HTMLSelectElement>) => {
    setLocation(event.target.value)
  }

  const clickEvent = async (val: string) => {
    let valid = false
    try {
      console.log(val, location)
      mutation.mutate({ direction: val, locationId: location })
      valid = true
    }
    catch {
      alert("Failed to post mowing.")
    }
    if (valid)
      router.push('/mowing')
  }

  return (
    <>
      <div className="w-full max-w-xs">
        <form className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="location">
              Location
            </label>
            <select
              className="block appearance-none w-full bg-white border border-gray-400 hover:border-gray-500 px-4 py-2 pr-8 rounded shadow leading-tight focus:outline-none focus:shadow-outline"
              value={location}
              name="location"
              id="locations"
              onChange={locationChanged}>
              {
                locations.map(loc => {
                  return <option key={loc.id} value={loc.id}>{loc.name}</option>
                })
              }
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {Directions.map((d) =>
              <button
                onClick={(e) => {
                  e.preventDefault()
                  clickEvent(d.value)
                }}
                className="font-bold text-slate-100 bg-green-500 hover:bg-green-600 rounded px-4 py-2 focus:outline-none focus:shadow-outline"
                key={d.value}>
                {d.display}
              </button>
            )}

          </div>
        </form>
      </div>
    </>

  )
}

const NewPage: NextPage = () => {
  const locationQuery = trpc.useQuery(["mowing.getLocations"])
  if (!locationQuery.data)
    return (
      <div className="w-screen h-screen">
        <p className="mar text-5xl mt-[50vh] text-center" >...</p>
      </div>
    )
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

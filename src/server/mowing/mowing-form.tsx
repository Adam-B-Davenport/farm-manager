import { Mowing, MowingLocation } from "@prisma/client";

import { useRouter } from "next/router";
import { ChangeEvent, useEffect, useState } from "react";
import { trpc } from "../../utils/trpc";
import { MouseEvent} from "react"

const Directions = [
  { value: "N", display: "North" },
  { value: "E", display: "East" },
  { value: "NE", display: "Northeast" },
  { value: "NW", display: "Northwest" },
]

const MowingForm = ({ locations, mowing }: { locations: Array<MowingLocation>, mowing?: Mowing }) => {
  const [location, setLocation] = useState(locations[0].id)
  const [isNew, setIsNew] = useState(true)

  const router = useRouter()

  const newMutation = trpc.useMutation(['mowing.createMowing'])
  const editMutation = trpc.useMutation(['mowing.updateMowing'])
  const deleteMutation = trpc.useMutation(['mowing.deleteMowing'])

  useEffect(() => {
    if (mowing) {
      setIsNew(false)
      setLocation(mowing.locationId)
    }
  }, [])

  const locationChanged = (event: ChangeEvent<HTMLSelectElement>) => {
    setLocation(event.target.value)
  }

  const clickEvent = async (val: string) => {
    let valid = false
      if(!mowing){
        newMutation.mutate({ direction: val, locationId: location })
      }
      else{
        mowing.direction = val
        mowing.locationId = location
        console.log(mowing)
        editMutation.mutate(mowing)
      }
      valid = true
    if (newMutation.error)
      alert("Failed to post mowing.")
    else if (editMutation.error)
      alert("Failed to update mowing.")
    if (valid)
      router.push('/mowing')
  }

  const deleteCLick = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()
    deleteMutation.mutate(router.query.id as string)
    if(!deleteMutation.error)
      router.push('/mowing')
    else
      alert("Failed to delete.")
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
            { !isNew && <button onClick={deleteCLick}>delete</button> }
          </div>
        </form>
      </div>
    </>

  )
}

export default MowingForm


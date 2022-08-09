import { Mowing, MowingLocation } from "@prisma/client";
import { useRouter } from "next/router";
import { ChangeEvent, useEffect, useState } from "react";
import { trpc } from "../../utils/trpc";
import { MouseEvent } from "react"

const htmlDate = (date: Date) => {

  const year = date.getFullYear()
  const month = (date.getMonth() + 1 < 10) ?
    `0${date.getMonth() + 1}` :
    date.getUTCMonth
  const day = date.getUTCDate() < 10 ?
    `0${date.getDate()}` :
    date.getUTCMonth
  console.log(`${year}-${month}-${day}`)
  return `${year}-${month}-${day}`
}

const Directions = [
  { value: "N", display: "North" },
  { value: "E", display: "East" },
  { value: "NE", display: "Northeast" },
  { value: "NW", display: "Northwest" },
]

const MowingForm = ({ locations, mowing }: { locations: Array<MowingLocation>, mowing?: Mowing }) => {
  const [location, setLocation] = useState(locations[0].id)
  const [date, setDate] = useState("")
  const [isNew, setIsNew] = useState(true)

  const router = useRouter()

  const newMutation = trpc.useMutation(['mowing.createMowing'])
  const editMutation = trpc.useMutation(['mowing.updateMowing'])
  const deleteMutation = trpc.useMutation(['mowing.deleteMowing'])

  useEffect(() => {
    if (mowing) {
      setIsNew(false)
      setLocation(mowing.locationId)
      setDate(htmlDate(mowing.date))
    }
    else {
      const now = new Date()
      setDate(htmlDate(now))
    }
  }, [])

  const locationChanged = (event: ChangeEvent<HTMLSelectElement>) => {
    setLocation(event.target.value)
  }

  const clickEvent = async (val: string) => {
    if (!date || date === "") {
      alert("Date must be set.")
      return
    }

    let valid = false
    if (!mowing) {
      let dt = new Date(date)
      dt.setDate(dt.getDate() + 1)
      console.log(dt.toString())
      newMutation.mutate({ direction: val, locationId: location, date: dt })
    }
    else {
      mowing.direction = val
      mowing.locationId = location
      mowing.date = new Date(date)
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
    if (confirm("Are you sure you want to delete this record?") && mowing) {
      deleteMutation.mutate(mowing.id)
      if (!deleteMutation.error)
        router.push('/mowing')
      else
        alert("Failed to delete.")
    }
  }

  return (
    <>
      <div className="w-full max-w-md m-auto">
        <form className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
          <div className="mb-4">
            <label className="block text-gray-700 text-xl font-bold mb-2" htmlFor="location">
              Location
            </label>
            <select
              className="block text-xl appearance-none w-full bg-white border border-gray-400 hover:border-gray-500 px-4 py-2 pr-8 rounded shadow leading-tight focus:outline-none focus:shadow-outline"
              value={location}
              name="location"
              id="locations"
              onChange={locationChanged}>
              {
                locations.map(loc => {
                  return <option className="text-xl" key={loc.id} value={loc.id}>{loc.name}</option>
                })
              }
            </select>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-xl font-bold mb-2" htmlFor="location">
              Date
            </label>
            <input
              type="date"
              className="block text-xl appearance-none w-full bg-white border border-gray-400 hover:border-gray-500 px-4 py-2 pr-8 rounded shadow leading-tight focus:outline-none focus:shadow-outline"
              value={date}
              onChange={(e) => { setDate(e.target.value) }}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            {Directions.map((d) =>
              <button
                onClick={(e) => {
                  e.preventDefault()
                  clickEvent(d.value)
                }}
                className="font-bold text-xl text-slate-100 bg-green-500 hover:bg-green-600 rounded px-4 py-4 focus:outline-none focus:shadow-outline"
                key={d.value}>
                {d.display}
              </button>
            )}
            {!isNew && <button
              className="bg-red-400 rounded col-span-2 w-2/3 m-auto px-5 py-1 mt-10 text-xl text-slate-100"
              onClick={deleteCLick}>delete</button>}
          </div>
        </form>
      </div>
    </>

  )
}

export default MowingForm


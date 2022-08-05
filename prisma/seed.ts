import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()
const uid = "cl6cl6bgd000600jhj2uavnpl"

const locationNames = [
  "Home",
  "Farm",
  "Trails",
]

const directions = [
  "N",
  "E",
  "NE"
]

const seed = async () => {
  await prisma.mowing.deleteMany()
  await prisma.mowingLocation.deleteMany()
  const locations = []
  for (let i = 0; i < locationNames.length; i++) {
    locations.push(await prisma.mowingLocation.create({
      data: {
        name: locationNames[i],
        user: { connect: { id: uid } }
      },
    }))
  }
  const day = (1000 * 60 * 60 * 24)
  let dt = new Date(2021, 3, 21)
  for (let i = 0; i < 48; i++) {
    const location = locations[Math.floor(Math.random() * locations.length)]

    dt = new Date(dt.getTime() + day * 3);


    await prisma.mowing.create({
      data: {
        direction: directions[Math.floor(Math.random() * directions.length)],
        location: { connect: { id: location.id } },
        date: dt,
        user: { connect: { id: uid } },
      }
    })
  }
}

seed()
  .catch((err) => { console.log(err) })
  .finally(() => prisma.$disconnect())


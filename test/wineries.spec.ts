require('dotenv').config()
import { spec } from "pactum";

describe('Wineries API should ', () => {

    const url = process.env.WINERIES_URL as string
    const winery = {name: 'Terre di San Vito', address: 'Bari, Italy'}

    test(' create a winery', async () => {
        await spec()
            .post(url)
            .withBody(winery)
            .expectStatus(201)
            .expectJsonLike(winery)
    })

    test(' query the winery by name', async () => {
        await spec()
            .get(`${url}/${winery.name}`)
            .expectStatus(200)
            .expectJsonLike(winery)
    })

    test(' update the winery', async () => {
        const updatedWinery = winery
        winery.address = 'Polignano a Mare, Bari, Italy'
        await spec()
            .put(`${url}/${winery.name}`)
            .withBody(updatedWinery)
            .expectStatus(204)
    })

    test(' list winerys', async () => {
        await spec()
            .get(url)
            .expectStatus(200)
            .expectJsonLength(1)
    })

    test(' delete the winery', async () => {
        await spec()
            .delete(`${url}/${winery.name}`)
            .expectStatus(204)
    })
})
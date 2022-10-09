require('dotenv').config()
import { spec } from "pactum";

describe('Grapes API should ', () => {

    const url = process.env.GRAPES_URL as string
    const grape = {name: 'Carmenere', color: 'Red'}

    test(' create a grape', async () => {
        await spec()
            .post(url)
            .withBody(grape)
            .expectStatus(201)
            .expectJsonLike(grape)
    })

    test(' query the grape by name', async () => {
        await spec()
            .get(`${url}/${grape.name}`)
            .expectStatus(200)
            .expectJsonLike(grape)
    })

    test(' update the grape', async () => {
        const updatedGrape = grape
        grape.color = 'Noir'
        await spec()
            .put(`${url}/${grape.name}`)
            .withBody(updatedGrape)
            .expectStatus(204)
    })

    test(' list grapes', async () => {
        await spec()
            .get(url)
            .expectStatus(200)
            .expectJsonLength(1)
    })

    test(' delete the grape', async () => {
        await spec()
            .delete(`${url}/${grape.name}`)
            .expectStatus(204)
    })
})
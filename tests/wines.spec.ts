import { spec } from "pactum";

describe ('Wines API should', () => {

    const url = 'http://127.0.0.1:3000'

    test (' create a Wine', async () => {

        const wine = {
            wineryName: 'Erns Loosen',
            label: 'Dornfelder',
            country: 'Germany',
            region: 'Pfalz',
            grapes: ['Dornfelder'],
            year: '2018'
        }

        await spec()
            .post(url)
            .withBody(wine)
            .expectStatus(201)
            .expectJsonLike(wine)
    })

    test (' fetch for Wines', async () => {
        await spec()
            .get(url)
            .expectStatus(200)
    })

    test (' get a Wine', async () => {
        await spec()
            .get(`${url}/1`)
            .expectStatus(200)
    })

    test (' update a Wine', async () => {

        const wine = {
            wineryName: 'Erns Loosen',
            label: 'Dornfelder',
            country: 'Germany',
            region: 'Pfalz',
            grapes: ['Dornfelder'],
            year: '2018'
        }

        await spec()
            .patch(`${url}/1`)
            .withBody(wine)
            .expectStatus(204)
    })

    test (' delete a Wine', async () => {
        await spec()
            .delete(`${url}/1`)
            .expectStatus(204)
    })
})